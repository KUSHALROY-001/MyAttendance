const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { prisma } = require("../../utils/prisma");

const getAcademicOptions = asyncHandler(async (req, res) => {
  let instituteId;

  // ── Path 1: authenticated caller (e.g. edit-profile page) ──────────────────
  if (req.user?.instituteId) {
    instituteId = req.user.instituteId;
  } else {
    // ── Path 2: public caller (e.g. signup page) — requires ?instituteCode= ──
    const code = String(req.query.instituteCode || "")
      .trim()
      .toUpperCase();

    if (!code) {
      throw new ApiError(
        400,
        "instituteCode query parameter is required for unauthenticated requests.",
      );
    }

    const institute = await prisma.institute.findUnique({
      where: { code },
      select: { id: true, isActive: true },
    });

    if (!institute || !institute.isActive) {
      throw new ApiError(404, "Invalid institute code.");
    }

    instituteId = institute.id;
  }

  // ── Shared: build department list for the resolved institute ────────────────
  const departments = await prisma.departmentInfo.findMany({
    where: { instituteId },
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

  // Fallback: derive departments from Course records if DepartmentInfo is empty
  const courses = await prisma.course.findMany({
    where: { instituteId },
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
  getAcademicOptions,
};
