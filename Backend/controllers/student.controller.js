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

      // Fetch attendance stats for summary
      attendanceStats: {
        select: {
          totalSessions: true,
          totalAttended: true,
          course: { select: { code: true, name: true } },
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

  // Map attendance records for history
  const attendanceFormatted = studentData.attendanceRecords.map((record) => {
    const { status } = record;
    const { course, teacher } = record.session.courseAllocation;

    return {
      date: record.session.date,
      teacher: { name: teacher.user?.name || "Unknown Teacher" },
      course: { name: course.name || "Unknown Course", code: course.code },
      status: STATUS_MAP[status] || "Leave",
    };
  });

  // Calculate percentages using dedicated stats table
  const summaries = studentData.attendanceStats.map((stat) => ({
    courseCode: stat.course.code,
    courseName: stat.course.name,
    totalClasses: stat.totalSessions,
    attendedClasses: stat.totalAttended,
    percentage:
      stat.totalSessions > 0
        ? (stat.totalAttended / stat.totalSessions) * 100
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

const getCourseDetails = asyncHandler(async (req, res) => {
  const courseCode = req.params.code;
  const rollNumber = req.query.rollNumber;

  if (!rollNumber) {
    throw new ApiError(400, "Roll number is required");
  }

  const studentData = await prisma.student.findUnique({
    where: { rollNumber },
    select: {
      id: true,
      enrolledCourses: {
        where: { course: { code: courseCode } },
        select: {
          course: { select: { code: true, name: true } },
        },
      },
      attendanceStats: {
        where: { course: { code: courseCode } },
        select: {
          totalSessions: true,
          totalAttended: true,
        },
      },
      attendanceRecords: {
        where: {
          session: { courseAllocation: { course: { code: courseCode } } },
        },
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

  const enrolled = studentData.enrolledCourses[0];
  if (!enrolled) {
    return res.status(404).json({ message: "Course not found or not enrolled" });
  }

  const stat = studentData.attendanceStats[0];
  const courseSummary = {
    courseCode: enrolled.course.code,
    courseName: enrolled.course.name,
    totalClasses: stat ? stat.totalSessions : 0,
    attendedClasses: stat ? stat.totalAttended : 0,
    percentage:
      stat && stat.totalSessions > 0
        ? (stat.totalAttended / stat.totalSessions) * 100
        : 0,
  };

  const attendanceFormatted = studentData.attendanceRecords.map((record) => {
    const { status } = record;
    const { course, teacher } = record.session.courseAllocation;

    return {
      date: record.session.date,
      teacher: { name: teacher?.user?.name || "Unknown Teacher" },
      course: { name: course.name || "Unknown Course", code: course.code },
      status: STATUS_MAP[status] || "Leave",
    };
  });

  return res.status(200).json({
    courseSummary,
    attendance: attendanceFormatted,
  });
});

module.exports = {
  getStudentDashboard,
  getCourseDetails,
};
