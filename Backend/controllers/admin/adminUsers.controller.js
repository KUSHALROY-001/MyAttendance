const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");

const getAllowedRolesForUser = (user) => {
  if (user.student) {
    return ["STUDENT", "ADMIN"];
  }

  if (user.teacher) {
    return ["TEACHER", "ADMIN"];
  }

  return ["ADMIN"];
};

const ensureRoleChangeAllowed = (user, nextRole) => {
  const allowedRoles = getAllowedRolesForUser(user);

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
      allowedRoles: getAllowedRolesForUser(user),
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
  if (!["STUDENT", "TEACHER", "ADMIN"].includes(nextRole)) {
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

  ensureRoleChangeAllowed(user, nextRole);

  if (user.role === "ADMIN" && nextRole !== "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN", instituteId: req.user.instituteId },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "At least one admin account must remain active.");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { role: nextRole },
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
    allowedRoles: getAllowedRolesForUser(updatedUser),
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

module.exports = {
  readUser,
  updateUserRole,
  deleteUser,
  getAllowedRolesForUser,
  ensureRoleChangeAllowed,
};
