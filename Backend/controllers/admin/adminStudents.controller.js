const { prisma } = require("../../utils/prisma.js");
const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { getWhereClause } = require("./adminHelpers");

const formatStudent = (student) => ({
  id: student.id,
  userId: student.userId,
  name: student.user?.name || "",
  email: student.user?.email || "",
  rollNumber: student.rollNumber,
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
    department,
    semester,
    section,
    batch,
    contactNumber,
  } = req.body;

  if (!name || !email || !rollNumber || !department || !semester || !batch) {
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
      },
    });

    const student = await tx.student.create({
      data: {
        userId: user.id,
        instituteId: req.user.instituteId,
        rollNumber,
        department,
        semester: Number(semester),
        section: section || "A",
        batch,
        contactNumber: contactNumber || null,
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

  // Update User + Student in a single transaction
  const updatedStudent = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: student.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    const updated = await tx.student.update({
      where: { id: Number(id) },
      data: {
        ...(rollNumber && { rollNumber }),
        ...(department && { department }),
        ...(semester && { semester: Number(semester) }),
        ...(section && { section }),
        ...(batch && { batch }),
        ...(contactNumber !== undefined && {
          contactNumber: contactNumber || null,
        }),
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

module.exports = {
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  formatStudent,
};
