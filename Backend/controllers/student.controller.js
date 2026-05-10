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

const formatClassRoutineEntry = (entry) => ({
  id: entry.id,
  day: entry.day,
  periodNumber: entry.periodNumber,
  room: entry.room,
  classType: entry.classType,
  courseName: entry.courseAllocation?.course?.name || "Unknown Course",
  courseCode: entry.courseAllocation?.course?.code || "",
  teacherName: entry.courseAllocation?.teacher?.user?.name || "Unknown Teacher",
});

const buildAttendanceRecordSummaryMap = (attendanceRecords = []) => {
  const summaryMap = new Map();

  attendanceRecords.forEach((record) => {
    const course = record.session?.courseAllocation?.course;
    if (!course?.code) {
      return;
    }

    const existing = summaryMap.get(course.code) || {
      totalClasses: 0,
      attendedClasses: 0,
    };

    existing.totalClasses += 1;
    if (record.status === "PRESENT" || record.status === "LATE") {
      existing.attendedClasses += 1;
    }

    summaryMap.set(course.code, existing);
  });

  return summaryMap;
};

const buildCourseSummaries = ({
  enrolledCourses,
  attendanceStats,
  allocatedCourses,
  attendanceRecords,
}) => {
  const courseMap = new Map();

  (allocatedCourses || []).forEach((allocation) => {
    if (allocation.course?.id) {
      courseMap.set(allocation.course.id, allocation.course);
    }
  });

  (enrolledCourses || []).forEach((enrollment) => {
    if (enrollment.course?.id) {
      courseMap.set(enrollment.course.id, enrollment.course);
    }
  });

  const statMap = new Map(
    (attendanceStats || []).map((stat) => [stat.course.code, stat]),
  );
  const recordSummaryMap = buildAttendanceRecordSummaryMap(attendanceRecords);

  return Array.from(courseMap.values())
    .map((course) => {
      const stat = statMap.get(course.code);
      const recordSummary = recordSummaryMap.get(course.code);
      const totalClasses = Math.max(
        stat?.totalSessions ?? 0,
        recordSummary?.totalClasses ?? 0,
      );
      const attendedClasses = Math.max(
        stat?.totalAttended ?? 0,
        recordSummary?.attendedClasses ?? 0,
      );

      return {
        courseCode: course.code,
        courseName: course.name,
        totalClasses,
        attendedClasses,
        percentage: totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0,
      };
    })
    .sort((a, b) => a.courseName.localeCompare(b.courseName));
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

  const classTimetable = await prisma.classTimetable.findUnique({
    where: {
      department_semester_section: {
        department: studentData.department,
        semester: studentData.semester,
        section: studentData.section,
      },
    },
    select: {
      periods: true,
      entries: {
        select: {
          id: true,
          day: true,
          periodNumber: true,
          room: true,
          classType: true,
          courseAllocation: {
            select: {
              course: { select: { name: true, code: true } },
              teacher: { select: { user: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });

  const allocatedCourses = await prisma.courseAllocation.findMany({
    where: {
      department: studentData.department,
      semester: studentData.semester,
      section: studentData.section,
    },
    select: {
      course: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });

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
  const summaries = buildCourseSummaries({
    enrolledCourses: studentData.enrolledCourses,
    attendanceStats: studentData.attendanceStats,
    allocatedCourses,
    attendanceRecords: studentData.attendanceRecords,
  });

  // Construct final payload
  const payload = {
    rollNumber: studentData.rollNumber,
    department: studentData.department,
    semester: studentData.semester,
    section: studentData.section,
    batch: studentData.batch,
    contactNumber: studentData.contactNumber,
    user: studentData.user,
    courses: summaries.map((summary) => ({
      code: summary.courseCode,
      name: summary.courseName,
    })),
    attendance: attendanceFormatted,
    summaries,
    classRoutine: {
      department: studentData.department,
      semester: studentData.semester,
      section: studentData.section,
      periods: normalizePeriods(classTimetable?.periods),
      entries: (classTimetable?.entries || []).map(formatClassRoutineEntry),
    },
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
      department: true,
      semester: true,
      section: true,
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
          session: {
            courseAllocation: {
              course: { code: courseCode },
            },
          },
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

  const allocatedCourse = await prisma.courseAllocation.findFirst({
    where: {
      department: studentData.department,
      semester: studentData.semester,
      section: studentData.section,
      course: { code: courseCode },
    },
    select: {
      course: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  });

  const filteredAttendanceRecords = studentData.attendanceRecords.filter(
    (record) =>
      record.session.courseAllocation?.course?.code === courseCode,
  );

  const enrolled = studentData.enrolledCourses[0];
  const courseInfo = allocatedCourse?.course || enrolled?.course;

  if (!courseInfo) {
    return res.status(404).json({ message: "Course not found or not enrolled" });
  }

  const stat = studentData.attendanceStats[0];
  const attendedClassesFromRecords = filteredAttendanceRecords.filter(
    (record) => record.status === "PRESENT" || record.status === "LATE",
  ).length;
  const totalClassesFromRecords = filteredAttendanceRecords.length;
  const totalClasses = Math.max(stat?.totalSessions ?? 0, totalClassesFromRecords);
  const attendedClasses = Math.max(
    stat?.totalAttended ?? 0,
    attendedClassesFromRecords,
  );
  const courseSummary = {
    courseCode: courseInfo.code,
    courseName: courseInfo.name,
    totalClasses,
    attendedClasses,
    percentage:
      totalClasses > 0
        ? (attendedClasses / totalClasses) * 100
        : 0,
  };

  const attendanceFormatted = filteredAttendanceRecords.map((record) => {
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
