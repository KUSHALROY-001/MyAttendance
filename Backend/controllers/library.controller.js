const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// ── GET  /api/library?department=BCA&semester=3&subjectName=OS ──────────────────
// Returns resources AND filter options (departments, semesters, subjects) in one call.
const getLibraryResources = asyncHandler(async (req, res) => {
  const { department, semester, subjectName } = req.query;

  // Build where clause for resources
  const where = {};
  if (department) where.department = department;
  if (semester) where.semester = parseInt(semester, 10);
  if (subjectName) where.subjectName = subjectName;

  // Build where clause for subject filter (scoped by dept/sem only, not by subject itself)
  const subjectWhere = {};
  if (department) subjectWhere.department = department;
  if (semester) subjectWhere.semester = parseInt(semester, 10);

  // Fire all queries in parallel — single round-trip to the DB
  const [resources, deptRows, semRows, subjectRows] = await Promise.all([
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
    prisma.department.findMany({
      select: { code: true },
    }),
    prisma.course.findMany({
      select: { semester: true },
      distinct: ["semester"],
    }),
    prisma.libraryResource.findMany({
      where: subjectWhere,
      select: { subjectName: true },
      distinct: ["subjectName"],
    }),
  ]);

  return res.status(200).json({
    resources,
    filters: {
      departments: deptRows.map((r) => r.code).sort(),
      semesters: semRows.map((r) => r.semester).sort((a, b) => a - b),
      subjects: subjectRows
        .map((r) => r.subjectName)
        .filter(Boolean)
        .sort(),
    },
  });
});

// ── POST  /api/library ───────────────────────────────────────────
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

  // Basic validation
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

  // Validate Google Drive link format (basic check)
  if (!driveLink.includes("drive.google.com")) {
    throw new ApiError(400, "Please provide a valid Google Drive link.");
  }

  // Ensure user exists
  const user = await prisma.user.findUnique({
    where: { id: parseInt(contributorId, 10) },
  });
  if (!user) throw new ApiError(404, "Contributor user not found.");

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

// ── DELETE  /api/library/:id ─────────────────────────────────────
const deleteLibraryResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // The user attempting the delete

  const resource = await prisma.libraryResource.findUnique({
    where: { id: parseInt(id, 10) },
  });
  if (!resource) throw new ApiError(404, "Resource not found.");

  // Only the contributor or an ADMIN can delete
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });
  if (!user) throw new ApiError(404, "User not found.");
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
