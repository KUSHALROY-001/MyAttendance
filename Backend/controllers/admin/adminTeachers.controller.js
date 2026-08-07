const { prisma } = require("../../utils/prisma.js");
const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const {
  stampOnCreate,
  stampOnUpdate,
  auditActorSelect,
} = require("../../utils/auditStamp");

const formatTeacher = (teacher) => ({
  id: teacher.id,
  userId: teacher.userId,
  name: teacher.user?.name || "",
  email: teacher.user?.email || "",
  employeeId: teacher.employeeId,
  department: teacher.department,
  designation: teacher.designation,
  contactNumber: teacher.contactNumber,
});

const readTeacher = asyncHandler(async (req, res) => {
  const dept = req.query.department || req.query.dept;
  const nameOnly = req.query.nameOnly;

  const where = {
    instituteId: req.user.instituteId,
    ...(dept && { department: dept }),
  };
  if (nameOnly === "true") {
    const teachers = await prisma.teacher.findMany({
      where,
      select: {
        id: true,
        userId: true,
        employeeId: true,
        department: true,
        designation: true,
        contactNumber: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return res.status(200).json(teachers.map(formatTeacher));
  }
  const teachers = await prisma.teacher.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
    },
  });
  res.status(200).json(teachers.map(formatTeacher));
});

const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, employeeId, department, contactNumber, designation } =
    req.body;

  if (!name || !email || !department || !employeeId || !designation) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  // Check if email or employeeId already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }
  const existingEmp = await prisma.teacher.findFirst({
    where: { instituteId: req.user.instituteId, employeeId },
  });
  if (existingEmp) {
    throw new ApiError(409, "A teacher with this employee ID already exists.");
  }

  const hashedPassword = await bcrypt.hash("teacher123", 10);

  const newTeacher = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
        instituteId: req.user.instituteId,
        ...stampOnCreate(req.user.userId),
      },
    });
    const teacher = await tx.teacher.create({
      data: {
        userId: user.id,
        instituteId: req.user.instituteId,
        employeeId,
        department,
        contactNumber: contactNumber || null,
        designation,
        ...stampOnCreate(req.user.userId),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    return teacher;
  });

  res.status(201).json(formatTeacher(newTeacher));
});

const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, employeeId, department, contactNumber, designation } =
    req.body;
  const teacher = await prisma.teacher.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    include: { user: true },
  });
  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }
  if (email && email !== teacher.user.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      throw new ApiError(409, "A user with this email already exists.");
    }
  }
  if (employeeId && employeeId !== teacher.employeeId) {
    const empTaken = await prisma.teacher.findFirst({
      where: { instituteId: req.user.instituteId, employeeId },
    });
    if (empTaken) {
      throw new ApiError(
        409,
        "A teacher with this employee ID already exists.",
      );
    }
  }
  const updatedTeacher = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: teacher.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...stampOnUpdate(req.user.userId),
      },
    });
    const updated = await tx.teacher.update({
      where: { id: Number(id) },
      data: {
        ...(employeeId && { employeeId }),
        ...(department && { department }),
        ...(contactNumber !== undefined && {
          contactNumber: contactNumber || null,
        }),
        ...(designation && { designation }),
        ...stampOnUpdate(req.user.userId),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    return updated;
  });
  res.status(200).json(formatTeacher(updatedTeacher));
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await prisma.teacher.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });
  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }
  const deletedTeacher = await prisma.user.delete({
    where: { id: teacher.userId },
  });
  res.status(200).json({
    message: "Teacher deleted successfully.",
    deletedTeacher,
  });
});

const getTeacherDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await prisma.teacher.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      createdBy: auditActorSelect,
      updatedBy: auditActorSelect,
      courseAllocations: {
        select: {
          id: true,
          department: true,
          semester: true,
          section: true,
          course: { select: { name: true, code: true } },
        },
      },
    },
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  res.status(200).json({
    ...formatTeacher(teacher),
    accountCreatedAt: teacher.user.createdAt,
    recordCreatedAt: teacher.createdAt,
    recordUpdatedAt: teacher.updatedAt,
    createdBy: teacher.createdBy,
    updatedBy: teacher.updatedBy,
    allocationCount: teacher.courseAllocations.length,
    allocations: teacher.courseAllocations.map((a) => ({
      id: a.id,
      department: a.department,
      semester: a.semester,
      section: a.section,
      courseName: a.course?.name,
      courseCode: a.course?.code,
    })),
  });
});

module.exports = {
  readTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherDetail,
  formatTeacher,
};
