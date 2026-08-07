const { prisma } = require("../../utils/prisma.js");
const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { getWhereClause } = require("./adminHelpers");
const {
  stampOnCreate,
  stampOnUpdate,
  auditActorSelect,
} = require("../../utils/auditStamp");

const formatStudent = (student) => ({
  id: student.id,
  userId: student.userId,
  name: student.user?.name || "",
  email: student.user?.email || "",
  rollNumber: student.rollNumber,
  enrollmentNumber: student.enrollmentNumber,
  department: student.department,
  semester: student.semester,
  section: student.section,
  batch: student.batch,
  contactNumber: student.contactNumber,
});

const readStudent = asyncHandler(async (req, res) => {
  const query = req.query;
  if (!query.semester) {
    query.semester = 1;
  }
  const whereClause = getWhereClause(query, req.user.instituteId);

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  res.status(200).json(students.map(formatStudent));
});

const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    rollNumber,
    enrollmentNumber,
    department,
    semester,
    section,
    batch,
    contactNumber,
  } = req.body;

  if (
    !name ||
    !email ||
    !rollNumber ||
    !enrollmentNumber ||
    !department ||
    !semester ||
    !batch
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  // Check if email or rollNumber already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const existingRoll = await prisma.student.findFirst({
    where: { instituteId: req.user.instituteId, rollNumber },
  });
  if (existingRoll) {
    throw new ApiError(409, "A student with this roll number already exists.");
  }

  const existingEnrollment = await prisma.student.findFirst({
    where: { instituteId: req.user.instituteId, enrollmentNumber },
  });
  if (existingEnrollment) {
    throw new ApiError(
      409,
      "A student with this enrollment number already exists.",
    );
  }

  // Hash a default password
  const hashedPassword = await bcrypt.hash("password123", 10);

  const courses = await prisma.course.findMany({
    where: {
      instituteId: req.user.instituteId,
      department: department,
      semester: Number(semester),
    },
  });

  // Create User + Student in a single transaction
  const newStudent = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        instituteId: req.user.instituteId,
        ...stampOnCreate(req.user.userId),
      },
    });

    const student = await tx.student.create({
      data: {
        userId: user.id,
        instituteId: req.user.instituteId,
        rollNumber,
        enrollmentNumber,
        department,
        semester: Number(semester),
        section: section || "A",
        batch,
        contactNumber: contactNumber || null,
        ...stampOnCreate(req.user.userId),
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
      include: {
        user: { select: { name: true, email: true } },
        enrolledCourses: true,
        attendanceStats: true,
      },
    });

    return student;
  });

  res.status(201).json(formatStudent(newStudent));
});

const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    rollNumber,
    enrollmentNumber,
    department,
    semester,
    section,
    batch,
    contactNumber,
  } = req.body;

  // Find the existing student — scoped to this admin's institute so an admin
  // from another institute can't read/edit by guessing an id.
  const student = await prisma.student.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    include: { user: true },
  });

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  // If email is changing, check it's not already taken by another user
  if (email && email !== student.user.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      throw new ApiError(409, "A user with this email already exists.");
    }
  }

  // If rollNumber is changing, check it's not already taken
  if (rollNumber && rollNumber !== student.rollNumber) {
    const rollTaken = await prisma.student.findFirst({
      where: { instituteId: req.user.instituteId, rollNumber },
    });
    if (rollTaken) {
      throw new ApiError(
        409,
        "A student with this roll number already exists.",
      );
    }
  }

  // Same for enrollmentNumber
  if (enrollmentNumber && enrollmentNumber !== student.enrollmentNumber) {
    const enrollmentTaken = await prisma.student.findFirst({
      where: { instituteId: req.user.instituteId, enrollmentNumber },
    });
    if (enrollmentTaken) {
      throw new ApiError(
        409,
        "A student with this enrollment number already exists.",
      );
    }
  }

  // Update User + Student in a single transaction
  const updatedStudent = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: student.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...stampOnUpdate(req.user.userId),
      },
    });

    const updated = await tx.student.update({
      where: { id: Number(id) },
      data: {
        ...(rollNumber && { rollNumber }),
        ...(enrollmentNumber && { enrollmentNumber }),
        ...(department && { department }),
        ...(semester && { semester: Number(semester) }),
        ...(section && { section }),
        ...(batch && { batch }),
        ...(contactNumber !== undefined && {
          contactNumber: contactNumber || null,
        }),
        ...stampOnUpdate(req.user.userId),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return updated;
  });

  res.status(200).json(formatStudent(updatedStudent));
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await prisma.student.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  // Delete the User — Student will cascade-delete automatically
  await prisma.user.delete({
    where: { id: student.userId },
  });

  res.status(200).json({ message: "Student deleted successfully." });
});

const getStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await prisma.student.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    include: {
      user: {
        select: { name: true, email: true, status: true, createdAt: true },
      },
      createdBy: auditActorSelect,
      updatedBy: auditActorSelect,
      attendanceStats: {
        include: { course: { select: { name: true, code: true } } },
      },
      enrolledCourses: {
        include: { course: { select: { id: true, name: true, code: true } } },
      },
    },
  });

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const totals = student.attendanceStats.reduce(
    (acc, s) => ({
      sessions: acc.sessions + s.totalSessions,
      attended: acc.attended + s.totalAttended,
    }),
    { sessions: 0, attended: 0 },
  );
  const overallAttendancePercentage =
    totals.sessions === 0
      ? null
      : Math.round((totals.attended / totals.sessions) * 1000) / 10;

  // Same convention as getUserDetailFull's isFounder/isPendingApproval —
  // computed server-side so the frontend doesn't need to re-derive this
  // logic itself for every detail endpoint that can hit a null createdBy.
  const isPendingApproval =
    student.user.status === "PENDING" && !student.createdBy;

  res.status(200).json({
    ...formatStudent(student),
    accountStatus: student.user.status,
    accountCreatedAt: student.user.createdAt,
    recordCreatedAt: student.createdAt,
    recordUpdatedAt: student.updatedAt,
    createdBy: student.createdBy,
    updatedBy: student.updatedBy,
    isPendingApproval,
    overallAttendancePercentage,
    perCourseAttendance: student.attendanceStats.map((s) => ({
      course: s.course.name,
      code: s.course.code,
      totalSessions: s.totalSessions,
      totalAttended: s.totalAttended,
    })),
    enrolledCourses: student.enrolledCourses.map((ec) => ec.course),
  });
});

module.exports = {
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDetail,
  formatStudent,
};
