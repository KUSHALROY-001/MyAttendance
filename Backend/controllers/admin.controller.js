const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getAdminDashboard = asyncHandler(async (req, res) => {
  // Fetch counts of all entities in ONE single trip to the database using Prisma's $transaction
  const [studentCount, teacherCount, courseCount] = await prisma.$transaction([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.course.count(),
  ]);
  // To check if a date is "today", we need the start and end of the current day
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

  const todaysSessionCount = await prisma.attendanceSession.count({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // Step 4: Fetch 4 most recent sessions with all related data
  const lastSessions = await prisma.attendanceSession.findMany({
    take: 5,
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
  });

  // Now, map the complex Prisma database object to the nice flat object your frontend table needs
  const recentSessionsFormatted = lastSessions.map((session) => {
    // Calculate how many students were present
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

  const totalAttArray = await prisma.attendanceRecord.groupBy({
    by: ["status"],
    _count: true,
  });

  const absent = totalAttArray.filter((att) => att.status === "ABSENT");
  const totalAttCount = totalAttArray.reduce((sum, att) => sum + att._count, 0);
  const overallPCT =
    100 - (absent.length > 0 ? totalAttCount / absent[0]._count : 0);

  res.status(200).json({
    student: studentCount,
    teacher: teacherCount,
    course: courseCount,
    todaySessionCount: todaysSessionCount,
    recentSessions: recentSessionsFormatted,
    overallPCT: overallPCT.toFixed(2), // Round to 2 decimal places
  });
});
/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/

module.exports = {
  getAdminDashboard,
};
