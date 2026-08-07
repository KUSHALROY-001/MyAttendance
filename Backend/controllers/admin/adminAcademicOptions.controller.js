const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const {
  stampOnCreate,
  stampOnUpdate,
  auditActorSelect,
} = require("../../utils/auditStamp");

// Helper to enforce SUPER_ADMIN role for modifications
const enforceSuperAdmin = (req) => {
  if (req.user?.role !== "SUPER_ADMIN") {
    throw new ApiError(
      403,
      "Forbidden: Only Super Admins have permission to manage academic options.",
    );
  }
};

// Validates the raw semesterDetails payload BEFORE it gets stamped —
// stamping alone (the old stampSemesterDetails) accepted anything: a
// non-integer semester, a duplicate semester number, or a semester with
// zero sections would all have been silently written to the database.
// This restores the checks that existed before this controller was last
// touched, merged with the audit stamping so both happen in one pass.
const validateAndStampSemesterDetails = (rawSemesterDetails, actorUserId) => {
  // Omitting semesterDetails entirely is allowed — a department can be
  // created with no semesters yet and have them added via a later update.
  // Providing something that isn't an array, though, is a real input error.
  if (rawSemesterDetails === undefined || rawSemesterDetails === null) {
    return [];
  }
  if (!Array.isArray(rawSemesterDetails)) {
    throw new ApiError(400, "semesterDetails must be an array.");
  }

  const seenSemesters = new Set();
  const now = new Date().toISOString();

  return rawSemesterDetails.map((entry) => {
    const semester = Number(entry?.semester);
    if (!Number.isInteger(semester) || semester < 1) {
      throw new ApiError(
        400,
        "Each semester entry needs a valid semester number.",
      );
    }
    if (seenSemesters.has(semester)) {
      throw new ApiError(400, `Semester ${semester} is listed more than once.`);
    }
    seenSemesters.add(semester);

    const rawSections = Array.isArray(entry?.sections) ? entry.sections : [];
    const sectionNames = [
      ...new Set(
        rawSections
          .map((s) => {
            const name = typeof s === "string" ? s : s?.name;
            return String(name || "").trim().toUpperCase();
          })
          .filter(Boolean),
      ),
    ];

    if (sectionNames.length === 0) {
      throw new ApiError(
        400,
        `Semester ${semester} needs at least one section.`,
      );
    }

    return {
      semester,
      updatedById: actorUserId,
      updatedAt: now,
      sections: sectionNames.map((name) => ({
        name,
        updatedById: actorUserId,
        updatedAt: now,
      })),
    };
  });
};

const readAcademicOptions = asyncHandler(async (req, res) => {
  const departments = await prisma.departmentInfo.findMany({
    where: { instituteId: req.user.instituteId },
    orderBy: { code: "asc" },
  });
  res.status(200).json(departments);
});

const createAcademicOption = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const { name, code, semesterDetails } = req.body;

  if (!name || !String(name).trim() || !code || !String(code).trim()) {
    throw new ApiError(400, "Department name and code are required.");
  }

  const normalizedCode = String(code).trim().toUpperCase();
  const normalizedName = String(name).trim();

  const existing = await prisma.departmentInfo.findFirst({
    where: {
      instituteId: req.user.instituteId,
      code: normalizedCode,
    },
  });

  if (existing) {
    throw new ApiError(409, "A department with this code already exists.");
  }

  const formattedSemesterDetails = validateAndStampSemesterDetails(
    semesterDetails,
    req.user.userId,
  );

  const created = await prisma.departmentInfo.create({
    data: {
      instituteId: req.user.instituteId,
      name: normalizedName,
      code: normalizedCode,
      semesterDetails: formattedSemesterDetails,
      ...stampOnCreate(req.user.userId),
    },
  });

  res.status(201).json(created);
});

const updateAcademicOption = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const { id } = req.params;
  const { name, code, semesterDetails } = req.body;

  const existing = await prisma.departmentInfo.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });

  if (!existing) {
    throw new ApiError(404, "Department not found.");
  }

  if (code && String(code).trim().toUpperCase() !== existing.code) {
    const codeTaken = await prisma.departmentInfo.findFirst({
      where: {
        instituteId: req.user.instituteId,
        code: String(code).trim().toUpperCase(),
        NOT: { id: Number(id) },
      },
    });
    if (codeTaken) {
      throw new ApiError(409, "A department with this code already exists.");
    }
  }

  const updated = await prisma.departmentInfo.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name: String(name).trim() }),
      ...(code && { code: String(code).trim().toUpperCase() }),
      ...(semesterDetails !== undefined && {
        semesterDetails: validateAndStampSemesterDetails(
          semesterDetails,
          req.user.userId,
        ),
      }),
      ...stampOnUpdate(req.user.userId),
    },
  });

  res.status(200).json(updated);
});

const deleteAcademicOption = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const { id } = req.params;

  const existing = await prisma.departmentInfo.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
  });

  if (!existing) {
    throw new ApiError(404, "Department not found.");
  }

  const deleted = await prisma.departmentInfo.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({
    message: "Department deleted successfully.",
    deleted,
  });
});

const getDepartmentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await prisma.departmentInfo.findFirst({
    where: { id: Number(id), instituteId: req.user.instituteId },
    include: {
      createdBy: auditActorSelect,
      updatedBy: auditActorSelect,
    },
  });

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  // Resolve every updatedById embedded inside semesterDetails in one batch
  // query rather than one query per semester/section.
  const embeddedIds = new Set();
  for (const sem of department.semesterDetails || []) {
    if (sem.updatedById) embeddedIds.add(sem.updatedById);
    for (const sec of sem.sections || []) {
      if (typeof sec === "object" && sec.updatedById) {
        embeddedIds.add(sec.updatedById);
      }
    }
  }

  const resolvedUsers = embeddedIds.size
    ? await prisma.user.findMany({
        where: { id: { in: [...embeddedIds] } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const userMap = new Map(resolvedUsers.map((u) => [u.id, u]));

  // Backward-compat: departments written before this feature may still have
  // plain-string sections (["A", "B"]) rather than the new object shape.
  // Render both without erroring.
  const semesterDetailsWithAudit = (department.semesterDetails || []).map(
    (sem) => ({
      ...sem,
      updatedBy: sem.updatedById ? userMap.get(sem.updatedById) || null : null,
      sections: (sem.sections || []).map((sec) =>
        typeof sec === "object"
          ? {
              ...sec,
              updatedBy: sec.updatedById
                ? userMap.get(sec.updatedById) || null
                : null,
            }
          : { name: sec, updatedBy: null },
      ),
    }),
  );

  res.status(200).json({
    id: department.id,
    name: department.name,
    code: department.code,
    recordCreatedAt: department.createdAt,
    recordUpdatedAt: department.updatedAt,
    createdBy: department.createdBy,
    updatedBy: department.updatedBy,
    semesterDetails: semesterDetailsWithAudit,
  });
});

module.exports = {
  readAcademicOptions,
  createAcademicOption,
  updateAcademicOption,
  deleteAcademicOption,
  getDepartmentDetail,
};
