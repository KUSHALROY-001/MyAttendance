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
const {
  parseSpreadsheet,
  validateRowShape,
  buildTemplateWorkbook,
  MAX_ROWS_PER_IMPORT,
} = require("../../utils/studentImport");
const previewCache = require("../../utils/previewCache");

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

// Core creation logic shared between the single-student form (createStudent
// below) and the bulk import confirm step (confirmStudentImport further
// down) — so there's exactly one place that hashes the password, checks
// duplicates, auto-enrolls in matching courses, and stamps audit fields,
// rather than two copies that could quietly drift apart.
const createStudentRecord = async (fields, instituteId, actorUserId) => {
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
  } = fields;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const existingRoll = await prisma.student.findFirst({
    where: { instituteId, rollNumber },
  });
  if (existingRoll) {
    throw new ApiError(409, "A student with this roll number already exists.");
  }

  const existingEnrollment = await prisma.student.findFirst({
    where: { instituteId, enrollmentNumber },
  });
  if (existingEnrollment) {
    throw new ApiError(
      409,
      "A student with this enrollment number already exists.",
    );
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  const courses = await prisma.course.findMany({
    where: {
      instituteId,
      department,
      semester: Number(semester),
    },
  });

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        instituteId,
        ...stampOnCreate(actorUserId),
      },
    });

    const student = await tx.student.create({
      data: {
        userId: user.id,
        instituteId,
        rollNumber,
        enrollmentNumber,
        department,
        semester: Number(semester),
        section: section || "A",
        batch,
        contactNumber: contactNumber || null,
        ...stampOnCreate(actorUserId),
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
};

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

  const newStudent = await createStudentRecord(
    {
      name,
      email,
      rollNumber,
      enrollmentNumber,
      department,
      semester,
      section,
      batch,
      contactNumber,
    },
    req.user.instituteId,
    req.user.userId,
  );

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

const downloadImportTemplate = asyncHandler(async (req, res) => {
  const buffer = buildTemplateWorkbook();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=student-import-template.xlsx",
  );
  res.status(200).send(buffer);
});

const previewStudentImport = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded.");
  }

  let rows;
  try {
    rows = parseSpreadsheet(req.file.buffer);
  } catch (_err) {
    throw new ApiError(
      400,
      "Couldn't read this file — please upload a valid .xlsx or .csv file.",
    );
  }

  if (rows.length === 0) {
    throw new ApiError(400, "The file has no data rows.");
  }
  if (rows.length > MAX_ROWS_PER_IMPORT) {
    throw new ApiError(
      400,
      `Maximum ${MAX_ROWS_PER_IMPORT} students per import. Please split the file.`,
    );
  }

  const instituteId = req.user.instituteId;

  // Pass 1: per-row shape validation + duplicate-within-this-file checks.
  const seenEmails = new Set();
  const seenRolls = new Set();
  const seenEnrollments = new Set();

  const shapeResults = rows.map((row, i) => {
    const result = validateRowShape(row, i + 2); // +2: header row + 1-indexed
    if (!result.isValid) return result;

    const email = String(row.email).trim().toLowerCase();
    const roll = String(row.rollNumber).trim();
    const enrollment = String(row.enrollmentNumber).trim();
    const dupErrors = [];

    if (seenEmails.has(email))
      dupErrors.push("Duplicate email within this file");
    if (seenRolls.has(roll))
      dupErrors.push("Duplicate roll number within this file");
    if (seenEnrollments.has(enrollment))
      dupErrors.push("Duplicate enrollment number within this file");
    seenEmails.add(email);
    seenRolls.add(roll);
    seenEnrollments.add(enrollment);

    return {
      ...result,
      errors: [...result.errors, ...dupErrors],
      isValid: dupErrors.length === 0,
    };
  });

  // Pass 2: batch-check against existing data — one query per field across
  // all shape-valid rows, not one query per row.
  const shapeValidIndexes = shapeResults
    .map((r, i) => (r.isValid ? i : -1))
    .filter((i) => i !== -1);

  const candidateEmails = shapeValidIndexes.map((i) =>
    String(rows[i].email).trim().toLowerCase(),
  );
  const candidateRolls = shapeValidIndexes.map((i) =>
    String(rows[i].rollNumber).trim(),
  );
  const candidateEnrollments = shapeValidIndexes.map((i) =>
    String(rows[i].enrollmentNumber).trim(),
  );

  const [existingUsers, existingByRoll, existingByEnrollment] =
    await Promise.all([
      candidateEmails.length
        ? prisma.user.findMany({
            where: { email: { in: candidateEmails } },
            select: { email: true },
          })
        : [],
      candidateRolls.length
        ? prisma.student.findMany({
            where: { instituteId, rollNumber: { in: candidateRolls } },
            select: { rollNumber: true },
          })
        : [],
      candidateEnrollments.length
        ? prisma.student.findMany({
            where: {
              instituteId,
              enrollmentNumber: { in: candidateEnrollments },
            },
            select: { enrollmentNumber: true },
          })
        : [],
    ]);

  const existingEmailSet = new Set(existingUsers.map((u) => u.email));
  const existingRollSet = new Set(existingByRoll.map((s) => s.rollNumber));
  const existingEnrollmentSet = new Set(
    existingByEnrollment.map((s) => s.enrollmentNumber),
  );

  const finalResults = rows.map((row, i) => {
    const result = shapeResults[i];
    if (!result.isValid) return { ...result, row };

    const email = String(row.email).trim().toLowerCase();
    const roll = String(row.rollNumber).trim();
    const enrollment = String(row.enrollmentNumber).trim();
    const dbErrors = [];

    if (existingEmailSet.has(email)) dbErrors.push("Email already exists");
    if (existingRollSet.has(roll)) dbErrors.push("Roll number already exists");
    if (existingEnrollmentSet.has(enrollment))
      dbErrors.push("Enrollment number already exists");

    return {
      rowNumber: result.rowNumber,
      row,
      errors: dbErrors,
      isValid: dbErrors.length === 0,
    };
  });

  const previewToken = previewCache.set({ instituteId, results: finalResults });

  res.status(200).json({
    previewToken,
    totalRows: rows.length,
    validCount: finalResults.filter((r) => r.isValid).length,
    results: finalResults,
  });
});

const confirmStudentImport = asyncHandler(async (req, res) => {
  const { previewToken } = req.body;
  if (!previewToken) {
    throw new ApiError(400, "previewToken is required.");
  }

  const cached = previewCache.get(previewToken);
  if (!cached) {
    throw new ApiError(
      400,
      "This import preview has expired. Please re-upload the file.",
    );
  }
  if (cached.instituteId !== req.user.instituteId) {
    throw new ApiError(403, "This preview doesn't belong to your institute.");
  }

  const validRows = cached.results.filter((r) => r.isValid);
  const outcomes = [];

  for (const { row, rowNumber } of validRows) {
    try {
      await createStudentRecord(
        {
          name: String(row.name).trim(),
          email: String(row.email).trim().toLowerCase(),
          rollNumber: String(row.rollNumber).trim(),
          enrollmentNumber: String(row.enrollmentNumber).trim(),
          department: String(row.department).trim().toUpperCase(),
          semester: Number(row.semester),
          section: row.section
            ? String(row.section).trim().toUpperCase()
            : undefined,
          batch: String(row.batch).trim(),
          contactNumber: row.contactNumber
            ? String(row.contactNumber).trim()
            : undefined,
        },
        req.user.instituteId,
        req.user.userId,
      );
      outcomes.push({
        rowNumber,
        success: true,
        name: row.name,
        email: row.email,
      });
    } catch (err) {
      outcomes.push({
        rowNumber,
        success: false,
        name: row.name,
        email: row.email,
        error: err.message || "Failed to create this student.",
      });
    }
  }

  previewCache.remove(previewToken);

  res.status(200).json({
    imported: outcomes.filter((o) => o.success).length,
    failed: outcomes.filter((o) => !o.success).length,
    outcomes,
  });
});

module.exports = {
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDetail,
  formatStudent,
  downloadImportTemplate,
  previewStudentImport,
  confirmStudentImport,
};
