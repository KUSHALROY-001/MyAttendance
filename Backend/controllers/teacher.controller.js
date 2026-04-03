const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const STATUS_MAP = {
  PRESENT: "Present",
  LATE: "Late",
  ABSENT: "Absent",
  LEAVE: "Leave",
};

const getTeacherDashboard = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // OPTIMIZATION: Fetch Teacher, Allocations, and Recent Sessions in ONE single trip
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
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Format Allocations (clean up nested course object)
    const formattedAllocations = teacher.courseAllocations.map((alloc) => ({
      id: alloc.id,
      department: alloc.department,
      semester: alloc.semester,
      section: alloc.section,
      course: alloc.course,
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
      allocations: formattedAllocations,
      recentAttendance,
      totalSessions,
      thisMonthSessions,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAttendanceSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // OPTIMIZATION: Precise selection to minimize memory footprint
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
      return res.status(404).json({ message: "Session not found" });
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
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCourseAttendance = async (req, res) => {
  try {
    const { teacherId, courseCode } = req.params;

    // OPTIMIZATION: 2 Queries merged into 1. Fetch Allocations AND their Sessions.
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
      return res.status(404).json({ message: "Course or Teacher not found" });
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
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getLiveAttendance = async (req, res) => {
  try {
    const { allocationId } = req.params;

    // OPTIMIZATION: Select specific fields
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

    if (!alloc)
      return res.status(404).json({ message: "Course Allocation not found" });

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
  } catch (error) {
    console.error("Error fetching live attendance roster:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const submitAttendance = async (req, res) => {
  try {
    const { courseAllocationId, date, records } = req.body;

    // ALREADY OPTIMIZED: Nested Writes (create) is the fastest way to insert relational data
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

    return res
      .status(201)
      .json({ message: "Attendance properly saved", id: session.id });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTeacherDashboard,
  getAttendanceSession,
  getCourseAttendance,
  getLiveAttendance,
  submitAttendance,
};
