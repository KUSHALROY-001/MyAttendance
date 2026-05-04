const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const STATUS_MAP = {
  PRESENT: "Present",
  LATE: "Late",
  ABSENT: "Absent",
  LEAVE: "Leave",
};

const getTeacherDashboard = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const teacher = await prisma.teacher.findUnique({
    where: { employeeId: teacherId },
    select: {
      id: true,
      employeeId: true,
      designation: true,
      department: true,
      user: { select: { name: true, email: true } },
      schedules: {
        select: {
          id: true,
          day: true,
          slots: true,
          room: true,
          classType: true,
          courseAllocation: {
            select: {
              department: true,
              semester: true,
              section: true,
              course: { select: { name: true, code: true } },
            },
          },
        },
      },
      courseAllocations: {
        select: {
          id: true,
          department: true,
          semester: true,
          section: true,
          course: { select: { id: true, name: true, code: true } },
          // Fetch only recent attendance sessions for these allocations
          attendanceSessions: {
            select: {
              id: true,
              date: true,
              records: {
                select: { studentId: true, status: true },
              },
            },
            orderBy: { date: "desc" },
            take: 10, // Prevent fetching years of history for the dashboard
          },
        },
      },
    },
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  // Format Allocations (clean up nested course object)
  const formattedAllocations = teacher.courseAllocations.map((alloc) => ({
    id: alloc.id,
    department: alloc.department,
    semester: alloc.semester,
    section: alloc.section,
    course: alloc.course,
  }));

  const formattedSchedules = teacher.schedules.map((sch) => ({
    id: sch.id,
    day: sch.day,
    slots: sch.slots,
    room: sch.room,
    classType: sch.classType,
    department: sch.courseAllocation.department,
    semester: sch.courseAllocation.semester,
    section: sch.courseAllocation.section,
    course: sch.courseAllocation.course,
  }));

  // Flatten and format recent attendance history from all allocations
  const recentAttendance = [];
  teacher.courseAllocations.forEach((alloc) => {
    alloc.attendanceSessions.forEach((session) => {
      recentAttendance.push({
        id: session.id,
        name: alloc.course.name,
        code: alloc.course.code,
        department: alloc.department,
        semester: alloc.semester,
        section: alloc.section,
        date: session.date,
        records: session.records.map((r) => ({
          student: r.studentId,
          status: STATUS_MAP[r.status] || "Leave",
        })),
      });
    });
  });

  // Sort flattened attendance by date descending
  recentAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate true historical counts on database
  const allocationIds = teacher.courseAllocations.map((a) => a.id);

  let totalSessions = 0;
  let thisMonthSessions = 0;

  if (allocationIds.length > 0) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    [totalSessions, thisMonthSessions] = await Promise.all([
      prisma.attendanceSession.count({
        where: { courseAllocationId: { in: allocationIds } },
      }),
      prisma.attendanceSession.count({
        where: {
          courseAllocationId: { in: allocationIds },
          date: { gte: startOfMonth },
        },
      }),
    ]);
  }

  return res.status(200).json({
    employeeId: teacher.employeeId,
    designation: teacher.designation,
    department: teacher.department,
    user: teacher.user,
    schedules: formattedSchedules,
    allocations: formattedAllocations,
    recentAttendance,
    totalSessions,
    thisMonthSessions,
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getAttendanceSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await prisma.attendanceSession.findUnique({
    where: { id: parseInt(sessionId) },
    select: {
      id: true,
      date: true,
      courseAllocation: {
        select: {
          department: true,
          semester: true,
          section: true,
          course: { select: { name: true, code: true } },
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
    throw new ApiError(404, "Session not found");
  }

  const { course, department, semester, section } = session.courseAllocation;

  return res.status(200).json({
    id: session.id,
    date: session.date,
    courseName: course.name || "Unknown Course",
    courseCode: course.code || "Unknown Code",
    department,
    semester,
    section,
    students: session.records.map(({ student, status }) => ({
      id: student.id,
      name: student.user?.name || "Unknown Student",
      rollNumber: student.rollNumber,
      status: STATUS_MAP[status] || "Leave",
    })),
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getCourseAttendance = asyncHandler(async (req, res) => {
  const { teacherId, courseCode } = req.params;

  const courseAllocations = await prisma.courseAllocation.findMany({
    where: {
      teacher: { employeeId: teacherId },
      course: { code: courseCode },
    },
    select: {
      id: true,
      department: true,
      semester: true,
      section: true,
      course: { select: { name: true, code: true } },
      attendanceSessions: {
        select: {
          id: true,
          date: true,
          records: { select: { status: true } },
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (courseAllocations.length === 0) {
    throw new ApiError(404, "Course or Teacher not found");
  }

  const courseDetail = courseAllocations[0].course;
  let totalPresent = 0;
  let totalStudentsAgg = 0;
  const formattedSessions = [];

  // Map through allocations and their embedded sessions to calculate stats in memory
  courseAllocations.forEach((alloc) => {
    alloc.attendanceSessions.forEach((session) => {
      const totalCount = session.records.length;
      const presentCount = session.records.reduce(
        (sum, r) =>
          sum + (r.status === "PRESENT" || r.status === "LATE" ? 1 : 0),
        0,
      );

      totalPresent += presentCount;
      totalStudentsAgg += totalCount;

      formattedSessions.push({
        id: session.id,
        date: session.date,
        name: courseDetail.name,
        department: alloc.department,
        semester: alloc.semester,
        section: alloc.section,
        presentCount,
        totalCount,
      });
    });
  });

  // Sort by date descending
  formattedSessions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const overallAttendance =
    totalStudentsAgg > 0 ? (totalPresent / totalStudentsAgg) * 100 : 0;

  return res.status(200).json({
    courseCode: courseDetail.code,
    courseName: courseDetail.name,
    totalSessions: formattedSessions.length,
    overallAttendance: Math.round(overallAttendance),
    sessions: formattedSessions,
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const getLiveAttendance = asyncHandler(async (req, res) => {
  const { allocationId } = req.params;

  const alloc = await prisma.courseAllocation.findUnique({
    where: { id: parseInt(allocationId) },
    select: {
      id: true,
      department: true,
      semester: true,
      section: true,
      course: { select: { name: true, code: true } },
    },
  });

  if (!alloc) throw new ApiError(404, "Course Allocation not found");

  // Find all students in this demographic
  const students = await prisma.student.findMany({
    where: {
      department: alloc.department,
      semester: alloc.semester,
      section: alloc.section,
    },
    select: {
      id: true,
      rollNumber: true,
      user: { select: { name: true } },
    },
  });

  return res.status(200).json({
    allocation: alloc,
    students: students.map(({ id, user, rollNumber }) => ({
      id,
      name: user?.name || "Unknown",
      rollNumber,
    })),
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const submitAttendance = asyncHandler(async (req, res) => {
  const { courseAllocationId, date, records } = req.body;

  // Step 1: Create the attendance session with all student records in one nested write
  const session = await prisma.attendanceSession.create({
    data: {
      courseAllocationId: parseInt(courseAllocationId),
      date: date ? new Date(date) : new Date(),
      records: {
        create: records.map(({ student, status }) => ({
          studentId: parseInt(student),
          status: status.toUpperCase(),
        })),
      },
    },
  });

  // Step 2: Update the StudentAttendanceStat cache using two fast batch queries
  // Get ALL student IDs in this class (everyone's totalSessions goes up by 1)
  const allStudentIds = records.map((r) => parseInt(r.student));

  // Get ONLY the IDs of students who were present or late (their totalAttended goes up by 1)
  const presentStudentIds = records
    .filter(
      (r) =>
        r.status.toUpperCase() === "PRESENT" ||
        r.status.toUpperCase() === "LATE",
    )
    .map((r) => parseInt(r.student));

  // Run both updates simultaneously inside a transaction for safety
  await prisma.$transaction([
    // Increment totalSessions for every student in the class
    prisma.studentAttendanceStat.updateMany({
      where: { studentId: { in: allStudentIds } },
      data: { totalSessions: { increment: 1 } },
    }),
    // Increment totalAttended only for students who were present/late
    prisma.studentAttendanceStat.updateMany({
      where: { studentId: { in: presentStudentIds } },
      data: { totalAttended: { increment: 1 } },
    }),
  ]);

  return res
    .status(201)
    .json({ message: "Attendance properly saved", id: session.id });
});

module.exports = {
  getTeacherDashboard,
  getAttendanceSession,
  getCourseAttendance,
  getLiveAttendance,
  submitAttendance,
};
