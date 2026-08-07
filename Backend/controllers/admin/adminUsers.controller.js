const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const {
  stampOnUpdate,
  auditActorSelect,
} = require("../../utils/auditStamp");

const getAllowedRolesForUser = (user, actingUserRole) => {
  // SUPER_ADMIN is permanent once granted — never a valid target to move
  // *away* from through this endpoint, by anyone, including themselves.
  if (user.role === "SUPER_ADMIN") {
    return [];
  }

  // Offer STUDENT/TEACHER as options whenever that profile still exists —
  // this lets an admin who was originally a student/teacher be reverted
  // back to their original profile. This is independent of their CURRENT
  // role: someone promoted from teacher -> admin still has a Teacher row
  // (it's never deleted on promotion), so it stays offered as a revert
  // option even though their role right now is ADMIN.
  const roles = [];
  if (user.student) roles.push("STUDENT");
  if (user.teacher) roles.push("TEACHER");
  roles.push("ADMIN");

  // SUPER_ADMIN eligibility is judged purely off the account's CURRENT
  // role, not profile history — only an account that is right now an
  // ADMIN can be promoted further, and only an existing SUPER_ADMIN can
  // grant it.
  if (user.role === "ADMIN" && actingUserRole === "SUPER_ADMIN") {
    roles.push("SUPER_ADMIN");
  }
  return roles;
};

const ensureRoleChangeAllowed = (user, nextRole, actingUserRole) => {
  if (user.role === "SUPER_ADMIN") {
    throw new ApiError(
      400,
      "The institute's founding super admin's role cannot be changed.",
    );
  }

  if (nextRole === "SUPER_ADMIN" && actingUserRole !== "SUPER_ADMIN") {
    throw new ApiError(
      403,
      "Only a super admin can promote another user to super admin.",
    );
  }

  const allowedRoles = getAllowedRolesForUser(user, actingUserRole);

  if (!allowedRoles.includes(nextRole)) {
    throw new ApiError(
      400,
      `This account can only use these roles: ${allowedRoles.join(", ")}.`,
    );
  }
};

const readUser = asyncHandler(async (req, res) => {
  const role = req.query.role;

  const users = await prisma.user.findMany({
    where: {
      instituteId: req.user.instituteId,
      ...(role && { role }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          rollNumber: true,
        },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
        },
      },
    },
  });

  res.status(200).json(
    users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      profileType: user.student
        ? "STUDENT"
        : user.teacher
          ? "TEACHER"
          : "ADMIN",
      profileId: user.student?.id || user.teacher?.id || null,
      profileCode: user.student?.rollNumber || user.teacher?.employeeId || null,
      allowedRoles: getAllowedRolesForUser(user, req.user.role),
    })),
  );
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required.");
  }

  const nextRole = role.toUpperCase();
  if (!["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"].includes(nextRole)) {
    throw new ApiError(400, "Invalid role selected.");
  }

  const user = await prisma.user.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    select: {
      id: true,
      role: true,
      student: { select: { id: true, rollNumber: true } },
      teacher: { select: { id: true, employeeId: true } },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  ensureRoleChangeAllowed(user, nextRole, req.user.role);

  // Promoting an ADMIN to SUPER_ADMIN doesn't reduce admin-tier coverage —
  // it's the same person with more access, not fewer admins — so it
  // shouldn't trip the "last admin" safety check. Only moving down to
  // STUDENT/TEACHER actually removes admin-tier access.
  if (
    user.role === "ADMIN" &&
    nextRole !== "ADMIN" &&
    nextRole !== "SUPER_ADMIN"
  ) {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN", instituteId: req.user.instituteId },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "At least one admin account must remain active.");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { role: nextRole, ...stampOnUpdate(req.user.userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          rollNumber: true,
        },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
        },
      },
    },
  });

  res.status(200).json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
    profileType: updatedUser.student
      ? "STUDENT"
      : updatedUser.teacher
        ? "TEACHER"
        : "ADMIN",
    profileId: updatedUser.student?.id || updatedUser.teacher?.id || null,
    profileCode:
      updatedUser.student?.rollNumber ||
      updatedUser.teacher?.employeeId ||
      null,
    allowedRoles: getAllowedRolesForUser(updatedUser, req.user.role),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    select: {
      id: true,
      role: true,
      name: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.role === "SUPER_ADMIN") {
    throw new ApiError(
      400,
      "The institute's founding super admin account cannot be deleted.",
    );
  }

  if (user.role === "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN", instituteId: req.user.instituteId },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "You cannot delete the last admin account.");
    }
  }

  await prisma.user.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({
    message: `${user.name} deleted successfully.`,
  });
});

const getUserDetailFull = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      createdBy: auditActorSelect,
      updatedBy: auditActorSelect,
      student: {
        select: {
          id: true,
          rollNumber: true,
          enrollmentNumber: true,
          department: true,
          semester: true,
          section: true,
        },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
          department: true,
          designation: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Two distinct "no creator" cases, not one — the frontend needs to tell
  // them apart (see RecordDetailPanel's renderAuditActor):
  //   - institute founder (SUPER_ADMIN, never had a creator) -> "System / Self-registered"
  //   - self-signup student still PENDING approval -> "Awaiting approval"
  // Everything else with a null createdBy is a genuinely pre-audit record.
  const isFounder = user.role === "SUPER_ADMIN" && !user.createdBy;
  const isPendingApproval = user.status === "PENDING" && !user.createdBy;

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    recordCreatedAt: user.createdAt,
    recordUpdatedAt: user.updatedAt,
    createdBy: user.createdBy,
    updatedBy: user.updatedBy,
    isFounder,
    isPendingApproval,
    profileType: user.student ? "STUDENT" : user.teacher ? "TEACHER" : "ADMIN",
    studentProfile: user.student || null,
    teacherProfile: user.teacher || null,
    allowedRoles: getAllowedRolesForUser(user, req.user.role),
  });
});

module.exports = {
  readUser,
  updateUserRole,
  deleteUser,
  getAllowedRolesForUser,
  ensureRoleChangeAllowed,
  getUserDetailFull,
};
