const { prisma } = require("../utils/prisma.js");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const ATTENDED_STATUSES = new Set(["PRESENT", "LATE"]);

// Reusable functions
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
const getWhereClause = (query) => {
  const department = query.department || query.dept || "BCA";
  const semester = query.semester || query.sem;
  const section = query.section || query.sec;

  const whereClause = { department: department };

  if (semester) {
    whereClause.semester = Number(semester);
  }
  if (section) {
    whereClause.section = section;
  }
  return whereClause;
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
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

const parseNumberFilter = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getDateRangeFilter = (value) => {
  if (!value) {
    return undefined;
  }

  const selectedDate = new Date(value);
  if (Number.isNaN(selectedDate.getTime())) {
    throw new ApiError(400, "Invalid date filter.");
  }

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    gte: startOfDay,
    lte: endOfDay,
  };
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getLastTwoDaysFilter = async (allocationWhere) => {
  const latestSession = await prisma.attendanceSession.findFirst({
    where: {
      courseAllocation: allocationWhere,
    },
    orderBy: { date: "desc" },
    select: {
      date: true,
    },
  });

  if (!latestSession) {
    return undefined;
  }

  const endOfLatestDay = new Date(latestSession.date);
  endOfLatestDay.setHours(23, 59, 59, 999);

  const startOfWindow = new Date(latestSession.date);
  startOfWindow.setHours(0, 0, 0, 0);
  startOfWindow.setDate(startOfWindow.getDate() - 1);

  return {
    gte: startOfWindow,
    lte: endOfLatestDay,
  };
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getAllocationFilterClause = (query = {}) => {
  const department = query.department || query.dept;
  const semester = parseNumberFilter(query.semester || query.sem);
  const section = query.section || query.sec;
  const courseId = parseNumberFilter(query.courseId);
  const teacherId = parseNumberFilter(query.teacherId);

  return {
    ...(department && { department }),
    ...(semester !== undefined && { semester }),
    ...(section && { section }),
    ...(courseId !== undefined && { courseId }),
    ...(teacherId !== undefined && { teacherId }),
  };
};

const getAllowedRolesForUser = (user) => {
  if (user.student) {
    return ["STUDENT", "ADMIN"];
  }

  if (user.teacher) {
    return ["TEACHER", "ADMIN"];
  }

  return ["ADMIN"];
};

const ensureRoleChangeAllowed = (user, nextRole) => {
  const allowedRoles = getAllowedRolesForUser(user);

  if (!allowedRoles.includes(nextRole)) {
    throw new ApiError(
      400,
      `This account can only use these roles: ${allowedRoles.join(", ")}.`,
    );
  }
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const buildAdminSessionDetails = async (sessionId) => {
  const session = await prisma.attendanceSession.findUnique({
    where: { id: Number(sessionId) },
    select: {
      id: true,
      date: true,
      courseAllocation: {
        select: {
          department: true,
          semester: true,
          section: true,
          course: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              user: { select: { name: true } },
            },
          },
        },
      },
      records: {
        select: {
          status: true,
          student: {
            select: {
              id: true,
              rollNumber: true,
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw new ApiError(404, "Session not found.");
  }

  const presentCount = session.records.filter((record) =>
    ATTENDED_STATUSES.has(record.status),
  ).length;

  return {
    id: session.id,
    date: session.date,
    courseId: session.courseAllocation.course.id,
    courseName: session.courseAllocation.course.name,
    courseCode: session.courseAllocation.course.code,
    teacherId: session.courseAllocation.teacher.id,
    teacherName:
      session.courseAllocation.teacher.user?.name || "Unknown Teacher",
    teacherEmployeeId: session.courseAllocation.teacher.employeeId,
    department: session.courseAllocation.department,
    semester: session.courseAllocation.semester,
    section: session.courseAllocation.section,
    present: presentCount,
    total: session.records.length,
    students: session.records.map(({ student, status }) => ({
      id: student.id,
      name: student.user?.name || "Unknown Student",
      rollNumber: student.rollNumber,
      status,
    })),
  };
};

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const formatStudent = (student) => ({
  id: student.id,
  userId: student.userId,
  name: student.user?.name || "",
  email: student.user?.email || "",
  rollNumber: student.rollNumber,
  department: student.department,
  semester: student.semester,
  section: student.section,
  batch: student.batch,
  contactNumber: student.contactNumber,
});

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

const formatClassScheduleEntry = (entry) => ({
  id: entry.id,
  classTimetableId: entry.classTimetableId,
  periodNumber: entry.periodNumber,
  day: entry.day,
  courseAllocationId: entry.courseAllocationId,
  room: entry.room,
  classType: entry.classType,
  department: entry.courseAllocation?.department,
  semester: entry.courseAllocation?.semester,
  section: entry.courseAllocation?.section,
  academicYear: entry.courseAllocation?.academicYear,
  courseId: entry.courseAllocation?.course?.id,
  courseName: entry.courseAllocation?.course?.name || "",
  courseCode: entry.courseAllocation?.course?.code || "",
  teacherId: entry.courseAllocation?.teacher?.id,
  teacherName: entry.courseAllocation?.teacher?.user?.name || "",
  teacherEmployeeId: entry.courseAllocation?.teacher?.employeeId || "",
});

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
  const deptOnly = req.query.deptOnly;
  if (deptOnly === "true") {
    const departments = await prisma.departmentInfo.findMany({
      select: { code: true },
    });
    res.status(200).json(departments);
  } else {
    const departments = await prisma.departmentInfo.findMany({
      select: { code: true, semesterDetails: true },
    });
    res.status(200).json(departments);
  }
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// STUDENT CRUD — Create, Read, Update, Delete
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readStudent = asyncHandler(async (req, res) => {
  const query = req.query;
  if (!query.semester) {
    query.semester = 1;
  }
  const whereClause = getWhereClause(query);

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  res.status(200).json(students.map(formatStudent));
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

  const courses = await prisma.course.findMany({
    where: { department: department, semester: Number(semester) },
  });

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

  res.status(201).json(formatStudent(newStudent));
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

  res.status(200).json(formatStudent(updatedStudent));
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
  const dept = req.query.department || req.query.dept;
  const nameOnly = req.query.nameOnly;

  const where = dept ? { department: dept } : {};
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

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
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
  const existingEmp = await prisma.teacher.findUnique({
    where: { employeeId },
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
        employeeId,
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

  res.status(201).json(formatTeacher(newTeacher));
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, employeeId, department, contactNumber, designation } =
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
  if (employeeId && employeeId !== teacher.employeeId) {
    const empTaken = await prisma.teacher.findUnique({ where: { employeeId } });
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
        ...(employeeId && { employeeId }),
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
  res.status(200).json(formatTeacher(updatedTeacher));
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

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// Course CRUD
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readCourse = asyncHandler(async (req, res) => {
  const courses = await prisma.course.findMany();
  res.status(200).json(courses);
});

const createCourse = asyncHandler(async (req, res) => {
  const { name, code, department, semester, credits } = req.body;
  if (!name || !code || !department || !semester) {
    throw new ApiError(400, "All required fields must be provided.");
  }
  const existingCourse = await prisma.course.findUnique({
    where: { code },
  });
  if (existingCourse) {
    throw new ApiError(409, "A course with this code already exists.");
  }
  const newCourse = await prisma.course.create({
    data: {
      name,
      code,
      department,
      semester: Number(semester),
      credits: credits ? Number(credits) : 3,
    },
  });
  res.status(201).json(newCourse);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, department, semester, credits } = req.body;
  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
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
    },
  });
  res.status(200).json(updatedCourse);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
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

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// Course Allocation CRUD
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readCourseAllocation = asyncHandler(async (req, res) => {
  const query = req.query;
  const whereClause = getWhereClause(query);
  const courseAllocations = await getcourseAllocations(whereClause);

  res.status(200).json(courseAllocations.map(formatCourseAllocation));
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const createCourseAllocation = asyncHandler(async (req, res) => {
  const { courseId, teacherId, department, semester, section, academicYear } =
    req.body;
  if (!courseId || !teacherId || !department || !semester || !section) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  try {
    const newCourseAllocation = await prisma.courseAllocation.create({
      data: {
        courseId: Number(courseId),
        teacherId: Number(teacherId),
        department,
        semester: Number(semester),
        section,
        academicYear: academicYear || "2023-2024",
      },
      select: {
        id: true,
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
    res.status(201).json(formatCourseAllocation(newCourseAllocation));
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "This exact allocation already exists.");
    }
    throw error;
  }
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const updateCourseAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { courseId, teacherId, department, semester, section, academicYear } =
    req.body;

  const courseAllocation = await prisma.courseAllocation.findUnique({
    where: { id: Number(id) },
  });
  if (!courseAllocation) {
    throw new ApiError(404, "Course allocation not found.");
  }

  try {
    const updatedCourseAllocation = await prisma.courseAllocation.update({
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

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const deleteCourseAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const courseAllocation = await prisma.courseAllocation.findUnique({
    where: { id: Number(id) },
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

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// Class Timetable & Schedule — Period columns + cell assignments
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readClassTimetable = asyncHandler(async (req, res) => {
  const { department, semester, section } = req.query;
  if (!department || !semester) {
    throw new ApiError(400, "Department and semester are required.");
  }
  const sec = section || "A";

  // Upsert: create timetable row if it doesn't exist yet
  let timetable = await prisma.classTimetable.findUnique({
    where: {
      department_semester_section: {
        department,
        semester: Number(semester),
        section: sec,
      },
    },
  });

  if (!timetable) {
    timetable = await prisma.classTimetable.create({
      data: {
        department,
        semester: Number(semester),
        section: sec,
        periods: [],
      },
    });
  }

  const entries = await prisma.classScheduleEntry.findMany({
    where: { classTimetableId: timetable.id },
    include: {
      courseAllocation: {
        include: {
          course: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    timetable,
    entries: entries.map(formatClassScheduleEntry),
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/ const addClassPeriod =
  asyncHandler(async (req, res) => {
    const { department, semester, section, startTime, endTime, type } =
      req.body;
    if (!department || !semester || !startTime || !endTime) {
      throw new ApiError(
        400,
        "Department, semester, startTime, endTime required.",
      );
    }
    const sec = section || "A";

    let timetable = await prisma.classTimetable.findUnique({
      where: {
        department_semester_section: {
          department,
          semester: Number(semester),
          section: sec,
        },
      },
    });

    if (!timetable) {
      timetable = await prisma.classTimetable.create({
        data: {
          department,
          semester: Number(semester),
          section: sec,
          periods: [],
        },
      });
    }

    const periods = Array.isArray(timetable.periods) ? timetable.periods : [];
    const maxPeriod = periods.reduce(
      (max, p) => Math.max(max, p.period || 0),
      0,
    );

    periods.push({
      period: maxPeriod + 1,
      startTime,
      endTime,
      type: type || "class",
    });

    const updated = await prisma.classTimetable.update({
      where: { id: timetable.id },
      data: { periods },
    });

    res.status(201).json(updated);
  });

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/ const updateClassPeriod =
  asyncHandler(async (req, res) => {
    const { department, semester, section, periodNumber, startTime, endTime } =
      req.body;

    const timetable = await prisma.classTimetable.findUnique({
      where: {
        department_semester_section: {
          department,
          semester: Number(semester),
          section: section || "A",
        },
      },
    });
    if (!timetable) throw new ApiError(404, "Timetable not found.");

    const periods = Array.isArray(timetable.periods) ? timetable.periods : [];
    const idx = periods.findIndex((p) => p.period === Number(periodNumber));
    if (idx === -1) throw new ApiError(404, "Period not found.");

    if (startTime) periods[idx].startTime = startTime;
    if (endTime) periods[idx].endTime = endTime;

    const updated = await prisma.classTimetable.update({
      where: { id: timetable.id },
      data: { periods },
    });

    res.status(200).json(updated);
  });

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/ const deleteClassPeriod =
  asyncHandler(async (req, res) => {
    const { department, semester, section, periodNumber } = req.body;

    const timetable = await prisma.classTimetable.findUnique({
      where: {
        department_semester_section: {
          department,
          semester: Number(semester),
          section: section || "A",
        },
      },
    });
    if (!timetable) throw new ApiError(404, "Timetable not found.");

    await prisma.$transaction(async (tx) => {
      // 1. Find entries for this period to clean up TeacherSchedule
      const entriesToDelete = await tx.classScheduleEntry.findMany({
        where: {
          classTimetableId: timetable.id,
          periodNumber: Number(periodNumber),
        },
        include: { courseAllocation: true },
      });

      // 2. Remove synced TeacherSchedule entries
      for (const entry of entriesToDelete) {
        await tx.teacherSchedule.deleteMany({
          where: {
            teacherId: entry.courseAllocation.teacherId,
            courseAllocationId: entry.courseAllocationId,
            day: entry.day,
            slots: entry.periodNumber.toString(),
          },
        });
      }

      // 3. Delete all ClassScheduleEntry rows for this period
      await tx.classScheduleEntry.deleteMany({
        where: {
          classTimetableId: timetable.id,
          periodNumber: Number(periodNumber),
        },
      });

      // 4. Remove the period from the JSON array
      const periods = Array.isArray(timetable.periods)
        ? timetable.periods.filter((p) => p.period !== Number(periodNumber))
        : [];

      await tx.classTimetable.update({
        where: { id: timetable.id },
        data: { periods },
      });
    });

    res.status(200).json({ message: "Period column deleted." });
  });

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const createClassScheduleEntry = asyncHandler(async (req, res) => {
  const {
    classTimetableId,
    periodNumber,
    day,
    courseAllocationId,
    room,
    classType,
  } = req.body;

  if (!classTimetableId || !periodNumber || !day || !courseAllocationId) {
    throw new ApiError(400, "All fields are required.");
  }

  const allocation = await prisma.courseAllocation.findUnique({
    where: { id: Number(courseAllocationId) },
  });
  if (!allocation) throw new ApiError(404, "Course allocation not found.");

  // Conflict detection: check if this teacher already has a class at the same day+period
  const conflict = await prisma.teacherSchedule.findFirst({
    where: {
      teacherId: allocation.teacherId,
      day,
      slots: periodNumber.toString(),
    },
    include: {
      courseAllocation: {
        include: { course: { select: { name: true } } },
      },
    },
  });

  if (conflict) {
    throw new ApiError(
      409,
      `Teacher already has "${conflict.courseAllocation.course.name}" at this day/period.`,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the class schedule entry
    const entry = await tx.classScheduleEntry.create({
      data: {
        classTimetableId: Number(classTimetableId),
        periodNumber: Number(periodNumber),
        day,
        courseAllocationId: Number(courseAllocationId),
        room: room || null,
        classType: classType || "class",
      },
    });

    // 2. Auto-sync: create TeacherSchedule entry
    await tx.teacherSchedule.create({
      data: {
        teacherId: allocation.teacherId,
        courseAllocationId: Number(courseAllocationId),
        day,
        slots: periodNumber.toString(),
        room: room || null,
        classType: classType || "class",
      },
    });

    return entry;
  });

  res.status(201).json(result);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const deleteClassScheduleEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const entry = await prisma.classScheduleEntry.findUnique({
    where: { id: Number(id) },
    include: { courseAllocation: true },
  });
  if (!entry) throw new ApiError(404, "Schedule entry not found.");

  await prisma.$transaction(async (tx) => {
    await tx.classScheduleEntry.delete({ where: { id: Number(id) } });

    await tx.teacherSchedule.deleteMany({
      where: {
        teacherId: entry.courseAllocation.teacherId,
        courseAllocationId: entry.courseAllocationId,
        day: entry.day,
        slots: entry.periodNumber.toString(),
      },
    });
  });

  res.status(200).json({ message: "Schedule entry deleted." });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// Attendance Reports
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readAttendanceReportSessions = asyncHandler(async (req, res) => {
  const allocationWhere = getAllocationFilterClause(req.query);
  const dateFilter =
    getDateRangeFilter(req.query.date) ||
    (await getLastTwoDaysFilter(allocationWhere));

  const sessions = await prisma.attendanceSession.findMany({
    where: {
      courseAllocation: allocationWhere,
      ...(dateFilter && { date: dateFilter }),
    },
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      courseAllocation: {
        select: {
          department: true,
          semester: true,
          section: true,
          course: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              user: { select: { name: true } },
            },
          },
        },
      },
      records: {
        select: {
          status: true,
        },
      },
    },
  });

  const formattedSessions = sessions.map((session) => {
    const presentCount = session.records.filter((record) =>
      ATTENDED_STATUSES.has(record.status),
    ).length;

    return {
      id: session.id,
      date: session.date,
      courseId: session.courseAllocation.course.id,
      course: session.courseAllocation.course.name,
      courseCode: session.courseAllocation.course.code,
      teacherId: session.courseAllocation.teacher.id,
      teacher: session.courseAllocation.teacher.user?.name || "Unknown Teacher",
      teacherEmployeeId: session.courseAllocation.teacher.employeeId,
      department: session.courseAllocation.department,
      semester: session.courseAllocation.semester,
      section: session.courseAllocation.section,
      present: presentCount,
      total: session.records.length,
    };
  });

  res.status(200).json(formattedSessions);
});

const readAttendanceReportSessionDetail = asyncHandler(async (req, res) => {
  const sessionDetail = await buildAdminSessionDetails(req.params.id);
  res.status(200).json(sessionDetail);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readAttendanceReportDefaulters = asyncHandler(async (req, res) => {
  const allocationWhere = getAllocationFilterClause(req.query);
  const threshold = parseNumberFilter(req.query.threshold) ?? 75;

  const sessions = await prisma.attendanceSession.findMany({
    where: {
      courseAllocation: allocationWhere,
    },
    orderBy: { date: "desc" },
    select: {
      courseAllocation: {
        select: {
          department: true,
          semester: true,
          section: true,
          course: { select: { id: true, name: true, code: true } },
        },
      },
      records: {
        select: {
          status: true,
          student: {
            select: {
              id: true,
              rollNumber: true,
              batch: true,
              department: true,
              semester: true,
              section: true,
              user: { select: { name: true, email: true } },
            },
          },
        },
      },
    },
  });

  const groupedAttendance = new Map();

  sessions.forEach((session) => {
    const { course, department, semester, section } = session.courseAllocation;

    session.records.forEach((record) => {
      const key = `${record.student.id}-${course.id}`;
      const existing = groupedAttendance.get(key) || {
        id: key,
        studentId: record.student.id,
        rollNumber: record.student.rollNumber,
        name: record.student.user?.name || "Unknown Student",
        email: record.student.user?.email || "",
        batch: record.student.batch,
        department: record.student.department || department,
        semester: record.student.semester || semester,
        section: record.student.section || section,
        courseId: course.id,
        course: course.name,
        courseCode: course.code,
        attended: 0,
        total: 0,
      };

      existing.total += 1;
      if (ATTENDED_STATUSES.has(record.status)) {
        existing.attended += 1;
      }

      groupedAttendance.set(key, existing);
    });
  });

  const defaulters = Array.from(groupedAttendance.values())
    .map((record) => {
      const percentage =
        record.total > 0
          ? Math.round((record.attended / record.total) * 100)
          : 0;

      return {
        ...record,
        percentage,
      };
    })
    .filter((record) => record.total > 0 && record.percentage < threshold)
    .sort((a, b) => {
      if (a.percentage !== b.percentage) {
        return a.percentage - b.percentage;
      }
      return a.name.localeCompare(b.name);
    });

  res.status(200).json(defaulters);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
// RUD - User
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const readUser = asyncHandler(async (req, res) => {
  const role = req.query.role;

  const users = await prisma.user.findMany({
    where: {
      ...(role && { role }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          rollNumber: true,
        },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
        },
      },
    },
  });

  res.status(200).json(
    users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      profileType: user.student
        ? "STUDENT"
        : user.teacher
          ? "TEACHER"
          : "ADMIN",
      profileId: user.student?.id || user.teacher?.id || null,
      profileCode: user.student?.rollNumber || user.teacher?.employeeId || null,
      allowedRoles: getAllowedRolesForUser(user),
    })),
  );
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required.");
  }

  const nextRole = role.toUpperCase();
  if (!["STUDENT", "TEACHER", "ADMIN"].includes(nextRole)) {
    throw new ApiError(400, "Invalid role selected.");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      role: true,
      student: { select: { id: true, rollNumber: true } },
      teacher: { select: { id: true, employeeId: true } },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  ensureRoleChangeAllowed(user, nextRole);

  if (user.role === "ADMIN" && nextRole !== "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "At least one admin account must remain active.");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { role: nextRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          rollNumber: true,
        },
      },
      teacher: {
        select: {
          id: true,
          employeeId: true,
        },
      },
    },
  });

  res.status(200).json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
    profileType: updatedUser.student
      ? "STUDENT"
      : updatedUser.teacher
        ? "TEACHER"
        : "ADMIN",
    profileId: updatedUser.student?.id || updatedUser.teacher?.id || null,
    profileCode:
      updatedUser.student?.rollNumber ||
      updatedUser.teacher?.employeeId ||
      null,
    allowedRoles: getAllowedRolesForUser(updatedUser),
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      role: true,
      name: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.role === "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "You cannot delete the last admin account.");
    }
  }

  await prisma.user.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({
    message: `${user.name} deleted successfully.`,
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
  readCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  readCourseAllocation,
  createCourseAllocation,
  updateCourseAllocation,
  deleteCourseAllocation,
  readAttendanceReportSessions,
  readAttendanceReportSessionDetail,
  readAttendanceReportDefaulters,
  readClassTimetable,
  addClassPeriod,
  updateClassPeriod,
  deleteClassPeriod,
  createClassScheduleEntry,
  deleteClassScheduleEntry,
  readUser,
  updateUserRole,
  deleteUser,
};
