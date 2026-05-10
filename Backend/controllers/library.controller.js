const { prisma } = require("../utils/prisma.js");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getLibraryResources = asyncHandler(async (req, res) => {
  const { department, semester, subjectName } = req.query;
  const parsedSemester = semester ? parseInt(semester, 10) : undefined;

  const where = {};
  if (department) where.department = department;
  if (parsedSemester) where.semester = parsedSemester;
  if (subjectName) where.subjectName = subjectName;

  const [resources, deptRows, selectedDepartment] = await Promise.all([
    prisma.libraryResource.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subjectName: true,
        department: true,
        semester: true,
        driveLink: true,
        description: true,
        createdAt: true,
        contributor: {
          select: { id: true, name: true, role: true },
        },
      },
    }),
    prisma.departmentInfo.findMany({
      select: { code: true },
    }),
    department
      ? prisma.departmentInfo.findFirst({
          where: { code: department },
          select: { semesterDetails: true },
        })
      : Promise.resolve(null),
  ]);

  const semesters = selectedDepartment?.semesterDetails
    ? selectedDepartment.semesterDetails
        .map((detail) => detail.semester)
        .filter((value) => Number.isInteger(value))
        .sort((a, b) => a - b)
    : (
        await prisma.course.findMany({
          where: department ? { department } : undefined,
          select: { semester: true },
          distinct: ["semester"],
        })
      )
        .map((course) => course.semester)
        .sort((a, b) => a - b);

  const subjectRows = await prisma.course.findMany({
    where: {
      ...(department && { department }),
      ...(parsedSemester && { semester: parsedSemester }),
    },
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });

  return res.status(200).json({
    resources,
    filters: {
      departments: deptRows.map((row) => row.code).sort(),
      semesters: [...new Set(semesters)],
      subjects: subjectRows
        .map((row) => row.name)
        .filter(Boolean)
        .sort(),
    },
  });
});

const createLibraryResource = asyncHandler(async (req, res) => {
  const {
    title,
    subjectName,
    department,
    semester,
    driveLink,
    description,
    contributorId,
  } = req.body;

  if (
    !title ||
    !subjectName ||
    !department ||
    !semester ||
    !driveLink ||
    !contributorId
  ) {
    throw new ApiError(
      400,
      "title, subjectName, department, semester, driveLink, and contributorId are required.",
    );
  }

  if (!driveLink.includes("drive.google.com")) {
    throw new ApiError(400, "Please provide a valid Google Drive link.");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(contributorId, 10) },
  });

  if (!user) {
    throw new ApiError(404, "Contributor user not found.");
  }

  const resource = await prisma.libraryResource.create({
    data: {
      title,
      subjectName,
      department,
      semester: parseInt(semester, 10),
      driveLink,
      description: description || null,
      contributorId: parseInt(contributorId, 10),
    },
  });

  return res
    .status(201)
    .json({ message: "Resource shared successfully!", resource });
});

const deleteLibraryResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const resource = await prisma.libraryResource.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (resource.contributorId !== user.id && user.role !== "ADMIN") {
    throw new ApiError(403, "You are not authorized to delete this resource.");
  }

  await prisma.libraryResource.delete({ where: { id: parseInt(id, 10) } });

  return res.status(200).json({ message: "Resource deleted." });
});

module.exports = {
  getLibraryResources,
  createLibraryResource,
  deleteLibraryResource,
};
