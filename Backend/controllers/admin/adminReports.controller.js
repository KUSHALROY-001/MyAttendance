const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");

const ATTENDED_STATUSES = new Set(["PRESENT", "LATE"]);

const parseNumberFilter = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

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

const getAllocationFilterClause = (query = {}, instituteId) => {
  const department = query.department || query.dept;
  const semester = parseNumberFilter(query.semester || query.sem);
  const section = query.section || query.sec;
  const courseId = parseNumberFilter(query.courseId);
  const teacherId = parseNumberFilter(query.teacherId);

  return {
    instituteId,
    ...(department && { department }),
    ...(semester !== undefined && { semester }),
    ...(section && { section }),
    ...(courseId !== undefined && { courseId }),
    ...(teacherId !== undefined && { teacherId }),
  };
};

const buildAdminSessionDetails = async (sessionId, instituteId) => {
  const session = await prisma.attendanceSession.findFirst({
    where: { id: Number(sessionId), courseAllocation: { instituteId } },
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

const readAttendanceReportSessions = asyncHandler(async (req, res) => {
  const allocationWhere = getAllocationFilterClause(
    req.query,
    req.user.instituteId,
  );
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
  const sessionDetail = await buildAdminSessionDetails(
    req.params.id,
    req.user.instituteId,
  );
  res.status(200).json(sessionDetail);
});

const readAttendanceReportDefaulters = asyncHandler(async (req, res) => {
  const allocationWhere = getAllocationFilterClause(
    req.query,
    req.user.instituteId,
  );
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

module.exports = {
  readAttendanceReportSessions,
  readAttendanceReportSessionDetail,
  readAttendanceReportDefaulters,
  buildAdminSessionDetails,
  getDateRangeFilter,
  getLastTwoDaysFilter,
  getAllocationFilterClause,
  parseNumberFilter,
};
