const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { syncExistingStudentsForCourse } = require("./adminHelpers");
const {
  stampOnCreate,
  stampOnUpdate,
  auditActorSelect,
} = require("../../utils/auditStamp");

const readCourse = asyncHandler(async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { instituteId: req.user.instituteId },
  });
  res.status(200).json(courses);
});

const createCourse = asyncHandler(async (req, res) => {
  const { name, code, department, semester, credits } = req.body;
  if (!name || !code || !department || !semester) {
    throw new ApiError(400, "All required fields must be provided.");
  }
  const existingCourse = await prisma.course.findFirst({
    where: { instituteId: req.user.instituteId, code },
  });
  if (existingCourse) {
    throw new ApiError(409, "A course with this code already exists.");
  }
  const newCourse = await prisma.$transaction(async (tx) => {
    const createdCourse = await tx.course.create({
      data: {
        name,
        code,
        department,
        semester: Number(semester),
        credits: credits ? Number(credits) : 3,
        instituteId: req.user.instituteId,
        ...stampOnCreate(req.user.userId),
      },
    });

    await syncExistingStudentsForCourse(tx, {
      instituteId: req.user.instituteId,
      courseId: createdCourse.id,
      department: createdCourse.department,
      semester: createdCourse.semester,
    });

    return createdCourse;
  });
  res.status(201).json(newCourse);
});

const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, department, semester, credits } = req.body;
  const course = await prisma.course.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });
  if (!course) {
    throw new ApiError(404, "Course not found.");
  }
  const updatedCourse = await prisma.course.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(code && { code }),
      ...(department && { department }),
      ...(semester && { semester: Number(semester) }),
      ...(credits !== undefined && { credits: Number(credits) }),
      ...stampOnUpdate(req.user.userId),
    },
  });
  res.status(200).json(updatedCourse);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await prisma.course.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });
  if (!course) {
    throw new ApiError(404, "Course not found.");
  }
  const deletedCourse = await prisma.course.delete({
    where: { id: Number(id) },
  });
  res.status(200).json({
    message: "Course deleted successfully.",
    deletedCourse,
  });
});

const getCourseDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await prisma.course.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    include: {
      createdBy: auditActorSelect,
      updatedBy: auditActorSelect,
      enrolledStudents: { select: { studentId: true } },
      allocations: {
        select: {
          id: true,
          section: true,
          teacher: { select: { user: { select: { name: true } } } },
        },
      },
    },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  res.status(200).json({
    id: course.id,
    name: course.name,
    code: course.code,
    department: course.department,
    semester: course.semester,
    credits: course.credits,
    recordCreatedAt: course.createdAt,
    recordUpdatedAt: course.updatedAt,
    createdBy: course.createdBy,
    updatedBy: course.updatedBy,
    enrolledStudentCount: course.enrolledStudents.length,
    allocations: course.allocations.map((a) => ({
      id: a.id,
      section: a.section,
      teacherName: a.teacher?.user?.name || "",
    })),
  });
});

module.exports = {
  readCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseDetail,
};
