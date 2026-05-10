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

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const normalizePeriods = (periods) =>
  Array.isArray(periods)
    ? periods
        .map((period) => ({
          periodNumber: Number(period?.period),
          startTime: period?.startTime || null,
          endTime: period?.endTime || null,
          type: period?.type || "class",
        }))
        .filter((period) => Number.isInteger(period.periodNumber))
        .sort((a, b) => a.periodNumber - b.periodNumber)
    : [];

const buildTeacherRoutineEntry = (entry) => {
  const periods = normalizePeriods(entry.classTimetable?.periods);
  const period = periods.find((item) => item.periodNumber === entry.periodNumber);

  return {
    id: entry.id,
    day: entry.day,
    periodNumber: entry.periodNumber,
    startTime: period?.startTime || null,
    endTime: period?.endTime || null,
    room: entry.room,
    classType: entry.classType,
    courseName: entry.courseAllocation?.course?.name || "Unknown Course",
    courseCode: entry.courseAllocation?.course?.code || "",
    department: entry.courseAllocation?.department,
    semester: entry.courseAllocation?.semester,
    section: entry.courseAllocation?.section,
  };
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

  const routineEntriesRaw = await prisma.classScheduleEntry.findMany({
    where: {
      courseAllocation: {
        teacher: { employeeId: teacherId },
      },
    },
    select: {
      id: true,
      day: true,
      periodNumber: true,
      room: true,
      classType: true,
      classTimetable: {
        select: {
          periods: true,
        },
      },
      courseAllocation: {
        select: {
          department: true,
          semester: true,
          section: true,
          course: { select: { name: true, code: true } },
        },
      },
    },
  });

  const routineEntries = routineEntriesRaw
    .map(buildTeacherRoutineEntry)
    .sort((a, b) => {
      const dayDifference = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      if (dayDifference !== 0) {
        return dayDifference;
      }

      return a.periodNumber - b.periodNumber;
    });

  const teacherWeeklyRoutine = DAYS.map((day) => ({
    day,
    entries: routineEntries.filter((entry) => entry.day === day),
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
    weeklyRoutine: {
      days: teacherWeeklyRoutine,
      entries: routineEntries,
    },
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
  const { teacherId, allocationId } = req.params;

  const allocation = await prisma.courseAllocation.findFirst({
    where: {
      id: Number(allocationId),
      teacher: { employeeId: teacherId },
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

  if (!allocation) {
    throw new ApiError(404, "Course allocation not found for this teacher");
  }

  let totalPresent = 0;
  let totalStudentsAgg = 0;

  const formattedSessions = allocation.attendanceSessions.map((session) => {
    const totalCount = session.records.length;
    const presentCount = session.records.reduce(
      (sum, record) =>
        sum + (record.status === "PRESENT" || record.status === "LATE" ? 1 : 0),
      0,
    );

    totalPresent += presentCount;
    totalStudentsAgg += totalCount;

    return {
      id: session.id,
      date: session.date,
      name: allocation.course.name,
      department: allocation.department,
      semester: allocation.semester,
      section: allocation.section,
      presentCount,
      totalCount,
    };
  });

  const overallAttendance =
    totalStudentsAgg > 0 ? (totalPresent / totalStudentsAgg) * 100 : 0;

  return res.status(200).json({
    allocationId: allocation.id,
    courseCode: allocation.course.code,
    courseName: allocation.course.name,
    department: allocation.department,
    semester: allocation.semester,
    section: allocation.section,
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
  const normalizedCourseAllocationId = parseInt(courseAllocationId);

  const allocation = await prisma.courseAllocation.findUnique({
    where: { id: normalizedCourseAllocationId },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!allocation) {
    throw new ApiError(404, "Course allocation not found");
  }

  // Step 1: Create the attendance session with all student records in one nested write
  const session = await prisma.attendanceSession.create({
    data: {
      courseAllocationId: normalizedCourseAllocationId,
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

  const allStatRows = allStudentIds.map((studentId) => ({
    studentId,
    courseId: allocation.courseId,
    totalSessions: 0,
    totalAttended: 0,
  }));

  const presentStatRows = presentStudentIds.map((studentId) => ({
    studentId,
    courseId: allocation.courseId,
  }));

  // Ensure stat rows exist, then increment only the exact course stats.
  await prisma.$transaction([
    prisma.studentAttendanceStat.createMany({
      data: allStatRows,
      skipDuplicates: true,
    }),
    prisma.studentAttendanceStat.updateMany({
      where: {
        studentId: { in: allStudentIds },
        courseId: allocation.courseId,
      },
      data: { totalSessions: { increment: 1 } },
    }),
    ...(presentStatRows.length
      ? [
          prisma.studentAttendanceStat.updateMany({
            where: {
              studentId: { in: presentStudentIds },
              courseId: allocation.courseId,
            },
            data: { totalAttended: { increment: 1 } },
          }),
        ]
      : []),
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
