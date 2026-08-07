const { prisma } = require("../../utils/prisma.js");
const asyncHandler = require("../../utils/asyncHandler");

// Reusable helper function for Dashboard
const fetchRecentSessions = async (limit, instituteId) => {
  const queryOptions = {
    where: { courseAllocation: { instituteId } },
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
            select: { user: { select: { name: true } } },
          },
        },
      },
      records: { select: { status: true, studentId: true } },
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

const getAdminDashboard = asyncHandler(async (req, res) => {
  const instituteId = req.user.instituteId;

  const [studentCount, teacherCount, departmentCount] =
    await prisma.$transaction([
      prisma.student.count({ where: { instituteId } }),
      prisma.teacher.count({ where: { instituteId } }),
      prisma.departmentInfo.count({ where: { instituteId } }),
    ]);

  const recentSessionsFormatted = await fetchRecentSessions(10, instituteId);

  res.status(200).json({
    student: studentCount,
    teacher: teacherCount,
    department: departmentCount,
    recentSessions: recentSessionsFormatted,
  });
});

const getDepartment = asyncHandler(async (req, res) => {
  const instituteId = req.user.instituteId;
  const deptOnly = req.query.deptOnly;
  if (deptOnly === "true") {
    const departments = await prisma.departmentInfo.findMany({
      where: { instituteId },
      select: { code: true },
    });
    res.status(200).json(departments);
  } else {
    const departments = await prisma.departmentInfo.findMany({
      where: { instituteId },
      select: { code: true, semesterDetails: true },
    });
    res.status(200).json(departments);
  }
});

module.exports = {
  getAdminDashboard,
  getDepartment,
  fetchRecentSessions,
};
