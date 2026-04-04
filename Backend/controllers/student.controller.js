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

const getStudentDashboard = asyncHandler(async (req, res) => {
  const { roll } = req.params;

  // OPTIMIZATION 1 & 2: A single, highly-filtered query
  const studentData = await prisma.student.findUnique({
    where: { rollNumber: roll },
    select: {
      id: true,
      rollNumber: true,
      department: true,
      semester: true,
      section: true,
      batch: true,
      contactNumber: true,
      user: { select: { name: true, email: true } },

      // Fetch courses with exact fields
      enrolledCourses: {
        select: {
          course: { select: { id: true, code: true, name: true } },
        },
      },

      // Fetch attendance embedded directly in the student query
      attendanceRecords: {
        select: {
          status: true,
          session: {
            select: {
              date: true,
              courseAllocation: {
                select: {
                  course: { select: { name: true, code: true } },
                  teacher: { select: { user: { select: { name: true } } } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!studentData) {
    throw new ApiError(404, "Student not found");
  }

  // Initialize stats map
  const courseStatsMap = {};
  studentData.enrolledCourses.forEach(({ course }) => {
    courseStatsMap[course.code] = {
      courseCode: course.code,
      courseName: course.name,
      totalClasses: 0,
      attendedClasses: 0,
    };
  });

  // Map attendance and calculate totals in one pass
  const attendanceFormatted = studentData.attendanceRecords.map((record) => {
    const { status } = record;
    const { course, teacher } = record.session.courseAllocation;

    if (course.code) {
      if (!courseStatsMap[course.code]) {
        courseStatsMap[course.code] = {
          courseCode: course.code,
          courseName: course.name || "Unknown",
          totalClasses: 0,
          attendedClasses: 0,
        };
      }

      courseStatsMap[course.code].totalClasses += 1;
      if (status === "PRESENT" || status === "LATE") {
        courseStatsMap[course.code].attendedClasses += 1;
      }
    }

    return {
      date: record.session.date,
      teacher: { name: teacher.user?.name || "Unknown Teacher" },
      course: { name: course.name || "Unknown Course", code: course.code },
      status: STATUS_MAP[status] || "Leave",
    };
  });

  // Calculate percentages
  const summaries = Object.values(courseStatsMap).map((stat) => ({
    ...stat,
    percentage:
      stat.totalClasses > 0
        ? (stat.attendedClasses / stat.totalClasses) * 100
        : 0,
  }));

  // Construct final payload
  const payload = {
    rollNumber: studentData.rollNumber,
    department: studentData.department,
    semester: studentData.semester,
    section: studentData.section,
    batch: studentData.batch,
    contactNumber: studentData.contactNumber,
    user: studentData.user,
    courses: studentData.enrolledCourses.map((ec) => ec.course),
    attendance: attendanceFormatted,
    summaries,
  };

  return res.status(200).json(payload);
});

module.exports = {
  getStudentDashboard,
};
