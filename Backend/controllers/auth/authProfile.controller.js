const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { prisma } = require("../../utils/prisma");
const { buildSafeAuthUser } = require("../../utils/auth.utils");
const { getUserForSession } = require("./authSession.controller");

const getProfile = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      institute: { select: { id: true, name: true, code: true } },
      student: {
        select: {
          rollNumber: true,
          enrollmentNumber: true,
          department: true,
          semester: true,
          section: true,
          batch: true,
          contactNumber: true,
        },
      },
      teacher: {
        select: {
          employeeId: true,
          department: true,
          designation: true,
          contactNumber: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res.status(200).json({ profile: user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  if (!newPassword) {
    throw new ApiError(400, "New password is required.");
  }

  if (String(newPassword).length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long.");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      password: true,
      mustChangePassword: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // The forced first-change flow (mustChangePassword: true) reaches this
  // endpoint only after the user has already authenticated with the real
  // current (default) password via /login — that login IS the proof, so
  // re-asking for it here just invites the classic browser-autofill trap:
  // several stacked password fields make Chrome/Edge/1Password treat the
  // "current password" field as part of a signup form and silently
  // overwrite it with a generated suggestion, which then fails the
  // bcrypt.compare below every time. Anywhere else changePassword is
  // called (a normal settings-page change, once one exists) still requires
  // and verifies currentPassword as before — this branch is decided by the
  // server-side flag, not anything the client sends, so it can't be used
  // to skip verification outside the intended first-login flow.
  if (!user.mustChangePassword) {
    if (!currentPassword) {
      throw new ApiError(400, "Current password is required.");
    }
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!passwordMatches) {
      throw new ApiError(401, "Current password is incorrect.");
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      // Clears the forced-change gate (see requirePasswordChange middleware)
      // for accounts created with a shared default password. A no-op write
      // for accounts that were never flagged.
      mustChangePassword: false,
    },
  });

  return res.status(200).json({
    message: "Password changed successfully.",
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!currentUser) {
    throw new ApiError(404, "User not found.");
  }

  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required.");
  }

  const duplicateEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: currentUser.id },
    },
    select: { id: true },
  });

  if (duplicateEmail) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        email,
      },
    });

    if (currentUser.role === "STUDENT") {
      const rollNumber = String(req.body.rollNumber || "").trim();
      const enrollmentNumber = String(req.body.enrollmentNumber || "").trim();
      const department = String(req.body.department || "")
        .trim()
        .toUpperCase();
      const semester = Number(req.body.semester);
      const section = String(req.body.section || "")
        .trim()
        .toUpperCase();
      const batch = String(req.body.batch || "").trim();
      const contactNumber = String(req.body.contactNumber || "").trim();

      if (
        !rollNumber ||
        !enrollmentNumber ||
        !department ||
        !Number.isInteger(semester) ||
        semester < 1 ||
        !section ||
        !batch ||
        !contactNumber
      ) {
        throw new ApiError(400, "All student profile fields are required.");
      }

      const duplicateRollNumber = await tx.student.findFirst({
        where: {
          instituteId: currentUser.instituteId,
          rollNumber,
          NOT: { id: currentUser.student?.id || 0 },
        },
        select: { id: true },
      });

      if (duplicateRollNumber) {
        throw new ApiError(
          409,
          "A student with this roll number already exists.",
        );
      }

      const duplicateEnrollmentNumber = await tx.student.findFirst({
        where: {
          instituteId: currentUser.instituteId,
          enrollmentNumber,
          NOT: { id: currentUser.student?.id || 0 },
        },
        select: { id: true },
      });

      if (duplicateEnrollmentNumber) {
        throw new ApiError(
          409,
          "A student with this enrollment number already exists.",
        );
      }

      await tx.student.update({
        where: { userId: currentUser.id },
        data: {
          rollNumber,
          enrollmentNumber,
          department,
          semester,
          section,
          batch,
          contactNumber,
        },
      });

      const targetCourses = await tx.course.findMany({
        where: { instituteId: currentUser.instituteId, department, semester },
        select: { id: true },
      });

      await tx.studentCourse.deleteMany({
        where: {
          studentId: currentUser.student.id,
        },
      });

      if (targetCourses.length > 0) {
        await tx.studentCourse.createMany({
          data: targetCourses.map((course) => ({
            studentId: currentUser.student.id,
            courseId: course.id,
          })),
          skipDuplicates: true,
        });
      }

      for (const course of targetCourses) {
        await tx.studentAttendanceStat.upsert({
          where: {
            studentId_courseId: {
              studentId: currentUser.student.id,
              courseId: course.id,
            },
          },
          update: {},
          create: {
            studentId: currentUser.student.id,
            courseId: course.id,
          },
        });
      }
    }

    if (currentUser.role === "TEACHER") {
      const employeeId = String(req.body.employeeId || "").trim();
      const department = String(req.body.department || "")
        .trim()
        .toUpperCase();
      const designation = String(req.body.designation || "").trim();
      const contactNumber = String(req.body.contactNumber || "").trim();

      if (!employeeId || !department || !designation || !contactNumber) {
        throw new ApiError(400, "All teacher profile fields are required.");
      }

      const duplicateEmployeeId = await tx.teacher.findFirst({
        where: {
          instituteId: currentUser.instituteId,
          employeeId,
          NOT: { id: currentUser.teacher?.id || 0 },
        },
        select: { id: true },
      });

      if (duplicateEmployeeId) {
        throw new ApiError(
          409,
          "A teacher with this employee ID already exists.",
        );
      }

      await tx.teacher.update({
        where: { userId: currentUser.id },
        data: {
          employeeId,
          department,
          designation,
          contactNumber,
        },
      });
    }
  });

  const updatedUser = await getUserForSession(currentUser.id);

  return res.status(200).json({
    message: "Profile updated successfully.",
    user: buildSafeAuthUser(updatedUser),
  });
});

module.exports = {
  getProfile,
  changePassword,
  updateProfile,
};
