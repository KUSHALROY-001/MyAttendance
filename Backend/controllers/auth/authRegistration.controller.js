const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { prisma } = require("../../utils/prisma");

const signupStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    instituteCode,
    rollNumber,
    department,
    semester,
    section,
    batch,
    contactNumber,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !instituteCode ||
    !rollNumber ||
    !department ||
    !semester ||
    !section ||
    !batch ||
    !contactNumber
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedInstituteCode = String(instituteCode).trim().toUpperCase();
  const normalizedDepartment = String(department).trim().toUpperCase();
  const normalizedRollNumber = String(rollNumber).trim();
  const normalizedSection = String(section).trim().toUpperCase();
  const normalizedBatch = String(batch).trim();
  const normalizedContactNumber = String(contactNumber).trim();
  const parsedSemester = Number(semester);

  if (!Number.isInteger(parsedSemester) || parsedSemester < 1) {
    throw new ApiError(400, "A valid semester is required.");
  }

  const institute = await prisma.institute.findUnique({
    where: { code: normalizedInstituteCode },
    select: { id: true, isActive: true },
  });

  if (!institute || !institute.isActive) {
    throw new ApiError(
      404,
      "Invalid institute code. Please check with your institute administrator.",
    );
  }

  const [existingUser, existingStudent] = await Promise.all([
    prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    }),
    prisma.student.findFirst({
      where: { instituteId: institute.id, rollNumber: normalizedRollNumber },
      select: { id: true },
    }),
  ]);

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  if (existingStudent) {
    throw new ApiError(409, "A student with this roll number already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const courses = await prisma.course.findMany({
    where: {
      instituteId: institute.id,
      department: normalizedDepartment,
      semester: parsedSemester,
    },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "STUDENT",
        instituteId: institute.id,
      },
    });

    await tx.student.create({
      data: {
        userId: user.id,
        instituteId: institute.id,
        rollNumber: normalizedRollNumber,
        department: normalizedDepartment,
        semester: parsedSemester,
        section: normalizedSection,
        batch: normalizedBatch,
        contactNumber: normalizedContactNumber,
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
    });
  });

  return res.status(201).json({
    message: "Student account created successfully. Please log in.",
  });
});

const registerInstitute = asyncHandler(async (req, res) => {
  const { instituteName, instituteCode, adminName, adminEmail, adminPassword } =
    req.body;

  if (
    !instituteName ||
    !instituteCode ||
    !adminName ||
    !adminEmail ||
    !adminPassword
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  if (String(adminPassword).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  const normalizedInstituteName = String(instituteName).trim();
  const normalizedInstituteCode = String(instituteCode).trim().toUpperCase();
  const normalizedAdminName = String(adminName).trim();
  const normalizedAdminEmail = String(adminEmail).trim().toLowerCase();

  if (!/^[A-Z0-9-]{3,20}$/.test(normalizedInstituteCode)) {
    throw new ApiError(
      400,
      "Institute code must be 3-20 characters: letters, numbers, or hyphens only.",
    );
  }

  const [existingInstitute, existingUser] = await Promise.all([
    prisma.institute.findUnique({
      where: { code: normalizedInstituteCode },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { email: normalizedAdminEmail },
      select: { id: true },
    }),
  ]);

  if (existingInstitute) {
    throw new ApiError(
      409,
      "An institute with this code already exists. Please choose another.",
    );
  }

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.$transaction(async (tx) => {
    const institute = await tx.institute.create({
      data: {
        name: normalizedInstituteName,
        code: normalizedInstituteCode,
      },
    });

    await tx.user.create({
      data: {
        name: normalizedAdminName,
        email: normalizedAdminEmail,
        password: hashedPassword,
        role: "ADMIN",
        instituteId: institute.id,
      },
    });
  });

  return res.status(201).json({
    message:
      "Institute registered successfully. Please log in as the institute admin.",
  });
});

const verifyInstituteCode = asyncHandler(async (req, res) => {
  const code = String(req.query.code || "")
    .trim()
    .toUpperCase();

  if (!code) {
    throw new ApiError(400, "Institute code is required.");
  }

  const institute = await prisma.institute.findUnique({
    where: { code },
    select: { id: true, name: true, code: true, isActive: true },
  });

  if (!institute || !institute.isActive) {
    throw new ApiError(404, "Invalid institute code.");
  }

  return res.status(200).json({
    id: institute.id,
    name: institute.name,
    code: institute.code,
  });
});

module.exports = {
  signupStudent,
  registerInstitute,
  verifyInstituteCode,
};
