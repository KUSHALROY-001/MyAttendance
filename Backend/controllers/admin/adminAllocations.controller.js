const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { getWhereClause, syncStudentsForCourseAllocation } = require("./adminHelpers");

const getcourseAllocations = async (whereClause) => {
  const courseAllocations = await prisma.courseAllocation.findMany({
    where: whereClause,
    select: {
      id: true,
      department: true,
      semester: true,
      section: true,
      academicYear: true,
      courseId: true,
      teacherId: true,
      course: {
        select: { name: true, code: true, id: true },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return courseAllocations;
};

const formatCourseAllocation = (allocation) => ({
  id: allocation.id,
  department: allocation.department,
  semester: allocation.semester,
  section: allocation.section,
  academicYear: allocation.academicYear,
  courseId: allocation.courseId,
  courseName: allocation.course?.name || "",
  courseCode: allocation.course?.code || "",
  teacherId: allocation.teacherId,
  teacherName: allocation.teacher?.user?.name || "",
  teacherEmployeeId: allocation.teacher?.employeeId || "",
});

const readCourseAllocation = asyncHandler(async (req, res) => {
  const query = req.query;
  const whereClause = getWhereClause(query, req.user.instituteId);
  const courseAllocations = await getcourseAllocations(whereClause);

  res.status(200).json(courseAllocations.map(formatCourseAllocation));
});

const createCourseAllocation = asyncHandler(async (req, res) => {
  const { courseId, teacherId, department, semester, section, academicYear } =
    req.body;
  if (!courseId || !teacherId || !department || !semester || !section) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  const instituteId = req.user.instituteId;

  // Verify the course and teacher actually belong to this admin's institute
  // — otherwise an admin could allocate another institute's teacher/course.
  const [course, teacher] = await Promise.all([
    prisma.course.findFirst({
      where: { id: Number(courseId), instituteId },
      select: { id: true },
    }),
    prisma.teacher.findFirst({
      where: { id: Number(teacherId), instituteId },
      select: { id: true },
    }),
  ]);

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }
  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  try {
    const newCourseAllocation = await prisma.$transaction(async (tx) => {
      const createdAllocation = await tx.courseAllocation.create({
        data: {
          courseId: Number(courseId),
          teacherId: Number(teacherId),
          department,
          semester: Number(semester),
          section,
          academicYear: academicYear || "2023-2024",
          instituteId,
        },
        select: {
          id: true,
          instituteId: true,
          department: true,
          semester: true,
          section: true,
          academicYear: true,
          courseId: true,
          teacherId: true,
          course: {
            select: { id: true, name: true, code: true },
          },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              user: { select: { name: true } },
            },
          },
        },
      });

      await syncStudentsForCourseAllocation(tx, createdAllocation);

      return createdAllocation;
    });

    res.status(201).json(formatCourseAllocation(newCourseAllocation));
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "This exact allocation already exists.");
    }
    throw error;
  }
});

const updateCourseAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { courseId, teacherId, department, semester, section, academicYear } =
    req.body;

  const instituteId = req.user.instituteId;

  const courseAllocation = await prisma.courseAllocation.findFirst({
    where: { id: Number(id), instituteId },
  });
  if (!courseAllocation) {
    throw new ApiError(404, "Course allocation not found.");
  }

  if (courseId) {
    const course = await prisma.course.findFirst({
      where: { id: Number(courseId), instituteId },
      select: { id: true },
    });
    if (!course) {
      throw new ApiError(404, "Course not found.");
    }
  }

  if (teacherId) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: Number(teacherId), instituteId },
      select: { id: true },
    });
    if (!teacher) {
      throw new ApiError(404, "Teacher not found.");
    }
  }

  try {
    const updatedCourseAllocation = await prisma.$transaction(async (tx) => {
      const nextAllocation = await tx.courseAllocation.update({
        where: { id: Number(id) },
        data: {
          ...(courseId && { courseId: Number(courseId) }),
          ...(teacherId && { teacherId: Number(teacherId) }),
          ...(department && { department }),
          ...(semester && { semester: Number(semester) }),
          ...(section && { section }),
          ...(academicYear && { academicYear }),
        },
        select: {
          id: true,
          instituteId: true,
          department: true,
          semester: true,
          section: true,
          academicYear: true,
          courseId: true,
          teacherId: true,
          course: {
            select: { id: true, name: true, code: true },
          },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              user: { select: { name: true } },
            },
          },
        },
      });

      await syncStudentsForCourseAllocation(tx, nextAllocation);

      return nextAllocation;
    });

    res.status(200).json(formatCourseAllocation(updatedCourseAllocation));
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(
        409,
        "This update would cause a duplicate allocation.",
      );
    }
    throw error;
  }
});

const deleteCourseAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const courseAllocation = await prisma.courseAllocation.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });
  if (!courseAllocation) {
    throw new ApiError(404, "Course allocation not found.");
  }
  const deletedCourseAllocation = await prisma.courseAllocation.delete({
    where: { id: Number(id) },
  });
  res.status(200).json({
    message: "Course allocation deleted successfully.",
    deletedCourseAllocation,
  });
});

module.exports = {
  readCourseAllocation,
  createCourseAllocation,
  updateCourseAllocation,
  deleteCourseAllocation,
  getcourseAllocations,
  formatCourseAllocation,
};
