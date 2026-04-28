const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Reusable function to fetch recent sessions
const fetchRecentSessions = async (limit) => {
  const queryOptions = {
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      courseAllocation: {
        select: {
          department: true,
          semester: true,
          section: true,
          course: {
            select: {
              name: true,
            },
          },
          teacher: {
            select: { user: { select: { name: true } } }, // The name is stored inside the User model!
          },
        },
      },
      records: { select: { status: true, studentId: true } }, // We need this to calculate Present vs Total
    },
  };

  if (limit) {
    queryOptions.take = Number(limit);
  }

  const sessions = await prisma.attendanceSession.findMany(queryOptions);

  return sessions.map((session) => {
    const presentCount = session.records.filter(
      (r) => r.status === "PRESENT",
    ).length;

    return {
      id: session.id,
      date: session.date,
      course: session.courseAllocation.course.name,
      teacher: session.courseAllocation.teacher.user.name,
      department: session.courseAllocation.department,
      semester: session.courseAllocation.semester,
      section: session.courseAllocation.section,
      present: presentCount,
      total: session.records.length,
    };
  });
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getAdminDashboard = asyncHandler(async (req, res) => {
  // Fetch counts of all entities in ONE single trip to the database using Prisma's $transaction
  const [studentCount, teacherCount, departmentCount] =
    await prisma.$transaction([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.departmentInfo.count(),
    ]);

  // Fetch 10 most recent sessions using our helper function
  const recentSessionsFormatted = await fetchRecentSessions(10);

  res.status(200).json({
    student: studentCount,
    teacher: teacherCount,
    department: departmentCount,
    recentSessions: recentSessionsFormatted,
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/

const getDepartment = asyncHandler(async (req, res) => {
  const departments = await prisma.departmentInfo.findMany({
    select: { code: true, semesterDetails: true },
  });
  res.status(200).json(departments);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// STUDENT CRUD — Create, Read, Update, Delete
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readStudent = asyncHandler(async (req, res) => {
  const dept = req.query.department || req.query.dept || "BCA";
  const sem =
    req.query.semester || req.query.sem
      ? Number(req.query.semester || req.query.sem)
      : 1;
  const sec = req.query.section || req.query.sec;

  const whereClause = { department: dept, semester: sem };

  if (sec) {
    whereClause.section = sec;
  }

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  res.status(200).json(students);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
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

  const existingRoll = await prisma.student.findUnique({
    where: { rollNumber },
  });
  if (existingRoll) {
    throw new ApiError(409, "A student with this roll number already exists.");
  }

  // Hash a default password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create User + Student in a single transaction
  const newStudent = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    const student = await tx.student.create({
      data: {
        userId: user.id,
        rollNumber,
        department,
        semester: Number(semester),
        section: section || "A",
        batch,
        contactNumber: contactNumber || null,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return student;
  });

  res.status(201).json(newStudent);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
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

  // Find the existing student
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
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
    const rollTaken = await prisma.student.findUnique({
      where: { rollNumber },
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

  res.status(200).json(updatedStudent);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
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

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// Teacher CRUD — Create, Read, Update, Delete
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readTeacher = asyncHandler(async (req, res) => {
  const dept = req.query.department || req.query.dept || "BCA";
  const teachers = await prisma.teacher.findMany({
    where: { department: dept },
    include: {
      user: { select: { name: true, email: true } },
    },
  });
  res.status(200).json(teachers);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, empId, department, contactNumber, designation } =
    req.body;

  if (!name || !email || !department || !empId || !designation) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  // Check if email or empId already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }
  const existingEmp = await prisma.teacher.findUnique({
    where: { empId },
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
      },
    });
    const teacher = await tx.teacher.create({
      data: {
        userId: user.id,
        empId,
        department,
        contactNumber: contactNumber || null,
        designation,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    return teacher;
  });

  res.status(201).json(newTeacher);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, empId, department, contactNumber, designation } =
    req.body;
  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(id) },
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
  if (empId && empId !== teacher.empId) {
    const empTaken = await prisma.teacher.findUnique({ where: { empId } });
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
      },
    });
    const updated = await tx.teacher.update({
      where: { id: Number(id) },
      data: {
        ...(empId && { empId }),
        ...(department && { department }),
        ...(contactNumber !== undefined && {
          contactNumber: contactNumber || null,
        }),
        ...(designation && { designation }),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    return updated;
  });
  res.status(200).json(updatedTeacher);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(id) },
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

module.exports = {
  getAdminDashboard,
  getDepartment,
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  readTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
