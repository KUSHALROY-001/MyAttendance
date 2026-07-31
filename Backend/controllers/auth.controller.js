const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../utils/prisma");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseCookies,
  createCookie,
  getRefreshCookieOptions,
  buildSafeAuthUser,
} = require("../utils/auth.utils");

const getUserForSession = async (userId) => {
  return prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      student: true,
      teacher: true,
    },
  });
};

const issueAuthResponse = async (res, user) => {
  const safeUser = buildSafeAuthUser(user);
  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshCookie = createCookie(
    "refreshToken",
    refreshToken,
    getRefreshCookieOptions(),
  );

  res.setHeader("Set-Cookie", refreshCookie);

  return res.status(200).json({
    message: "Authentication successful.",
    accessToken,
    user: safeUser,
  });
};

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
      student: {
        select: {
          rollNumber: true,
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

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      student: true,
      teacher: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return issueAuthResponse(res, user);
});

const signupStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    rollNumber,
    department,
    semester,
    section,
    batch,
    contactNumber,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !rollNumber ||
    !department ||
    !semester ||
    !section ||
    !batch ||
    !contactNumber
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedDepartment = String(department).trim().toUpperCase();
  const normalizedRollNumber = String(rollNumber).trim();
  const normalizedSection = String(section).trim().toUpperCase();
  const normalizedBatch = String(batch).trim();
  const normalizedContactNumber = String(contactNumber).trim();
  const parsedSemester = Number(semester);

  if (!Number.isInteger(parsedSemester) || parsedSemester < 1) {
    throw new ApiError(400, "A valid semester is required.");
  }

  const [existingUser, existingStudent] = await Promise.all([
    prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    }),
    prisma.student.findUnique({
      where: { rollNumber: normalizedRollNumber },
      select: { id: true },
    }),
  ]);

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  if (existingStudent) {
    throw new ApiError(409, "A student with this roll number already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const courses = await prisma.course.findMany({
    where: {
      department: normalizedDepartment,
      semester: parsedSemester,
    },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    await tx.student.create({
      data: {
        userId: user.id,
        rollNumber: normalizedRollNumber,
        department: normalizedDepartment,
        semester: parsedSemester,
        section: normalizedSection,
        batch: normalizedBatch,
        contactNumber: normalizedContactNumber,
        enrolledCourses: {
          create: courses.map((course) => ({
            courseId: course.id,
          })),
        },
        attendanceStats: {
          create: courses.map((course) => ({
            courseId: course.id,
          })),
        },
      },
    });
  });

  return res.status(201).json({
    message: "Student account created successfully. Please log in.",
  });
});

const refreshSession = asyncHandler(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token.");
  }

  const user = await getUserForSession(payload.userId);
  if (!user) {
    throw new ApiError(401, "User session is no longer valid.");
  }

  return issueAuthResponse(res, user);
});

const logout = asyncHandler(async (req, res) => {
  const expiredCookie = createCookie("refreshToken", "", {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", expiredCookie);

  return res.status(200).json({ message: "Logged out successfully." });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await getUserForSession(req.user.userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res.status(200).json({
    user: buildSafeAuthUser(user),
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required.");
  }

  if (String(newPassword).length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long.");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
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
          rollNumber,
          NOT: { id: currentUser.student?.id || 0 },
        },
        select: { id: true },
      });

      if (duplicateRollNumber) {
        throw new ApiError(409, "A student with this roll number already exists.");
      }

      await tx.student.update({
        where: { userId: currentUser.id },
        data: {
          rollNumber,
          department,
          semester,
          section,
          batch,
          contactNumber,
        },
      });

      const targetCourses = await tx.course.findMany({
        where: { department, semester },
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
          employeeId,
          NOT: { id: currentUser.teacher?.id || 0 },
        },
        select: { id: true },
      });

      if (duplicateEmployeeId) {
        throw new ApiError(409, "A teacher with this employee ID already exists.");
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

const getAcademicOptions = asyncHandler(async (_req, res) => {
  const departments = await prisma.departmentInfo.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      semesterDetails: true,
    },
    orderBy: { code: "asc" },
  });

  if (departments.length > 0) {
    return res.status(200).json({ departments });
  }

  const courses = await prisma.course.findMany({
    select: { department: true, semester: true },
    distinct: ["department", "semester"],
    orderBy: [{ department: "asc" }, { semester: "asc" }],
  });

  const deptMap = {};
  for (const c of courses) {
    if (!deptMap[c.department]) {
      deptMap[c.department] = {
        code: c.department,
        name: c.department,
        semesterDetails: [],
      };
    }
    deptMap[c.department].semesterDetails.push({
      semester: c.semester,
      sections: ["A", "B", "C"],
    });
  }

  return res.status(200).json({ departments: Object.values(deptMap) });
});

module.exports = {
  getProfile,
  signupStudent,
  login,
  refreshSession,
  logout,
  getCurrentUser,
  changePassword,
  updateProfile,
  getAcademicOptions,
};

