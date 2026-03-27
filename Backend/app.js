const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

// Load environment variables (looks for .env in project root)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const prisma = new PrismaClient();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api/student/dashboard/:roll", async (req, res) => {
  const { roll } = req.params;
  console.log(roll);
  
  const studentData = await prisma.student.findUnique({
    where: { rollNumber: roll },
    include: {
      user: { select: { name: true, email: true } },
      enrolledCourses: {
        include: {
          course: true
        }
      }
    }
  });

  if (!studentData) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Find all attendance records for this specific student
  const attendances = await prisma.attendanceRecord.findMany({
    where: { studentId: studentData.id },
    include: {
      session: {
        include: {
          courseAllocation: {
            include: {
              course: true,
              teacher: {
                include: { user: { select: { name: true } } }
              }
            }
          }
        }
      }
    }
  });

  // Create an object to track totals for each course
  const courseStatsMap = {};

  // Initialize stats for every course the student is officially enrolled in
  if (studentData.enrolledCourses) {
    studentData.enrolledCourses.forEach((c) => {
      courseStatsMap[c.course.code] = {
        courseId: c.course.code, // Frontend uses course code or DB id, we'll use code for easier mapping
        courseCode: c.course.code,
        courseName: c.course.name,
        totalClasses: 0,
        attendedClasses: 0,
      };
    });
  }

  // Create a clean attendance array for the frontend with only this student's status
  const attendanceFormatted = attendances.map((record) => {
    const status = record.status;
    const courseCode = record.session.courseAllocation.course.code;

    // Build the course statistics
    if (courseCode) {
      if (!courseStatsMap[courseCode]) {
        // If they attended a class they aren't fully enrolled in, track it anyway
        courseStatsMap[courseCode] = {
          courseId: courseCode,
          courseCode: courseCode,
          courseName: record.session.courseAllocation.course.name || "Unknown",
          totalClasses: 0,
          attendedClasses: 0,
        };
      }

      courseStatsMap[courseCode].totalClasses += 1;

      if (status === "PRESENT" || status === "LATE") {
        courseStatsMap[courseCode].attendedClasses += 1;
      }
    }

    return {
      date: record.session.date,
      teacher: {
        name: record.session.courseAllocation.teacher.user?.name || "Unknown Teacher",
      },
      course: {
        name: record.session.courseAllocation.course.name || "Unknown Course",
        code: courseCode || "Unknown Code",
      },
      status: status === "PRESENT" ? "Present" : status === "LATE" ? "Late" : status === "ABSENT" ? "Absent" : "Leave", 
    };
  });

  // Calculate the final percentage exactly as the frontend expects
  const summaries = Object.values(courseStatsMap).map((stat) => {
    return {
      ...stat,
      percentage:
        stat.totalClasses > 0
          ? (stat.attendedClasses / stat.totalClasses) * 100
          : 0,
    };
  });

  const payload = {
    rollNumber: studentData.rollNumber,
    department: studentData.department,
    semester: studentData.semester,
    section: studentData.section,
    batch: studentData.batch,
    contactNumber: studentData.contactNumber,
    user: studentData.user,
    courses: studentData.enrolledCourses.map(ec => ec.course),
    attendance: attendanceFormatted,
    summaries: summaries
  };

  return res.status(200).json(payload);
});

app.get("/api/teacher/dashboard/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  const teacher = await prisma.teacher.findUnique({
    where: { employeeId: teacherId },
    include: {
      user: { select: { name: true, email: true } },
    }
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  console.log(teacher);
  // 1. Find all courses this specific teacher is assigned to teach
  const teacherAllocations = await prisma.courseAllocation.findMany({
    where: { teacherId: teacher.id },
    include: { course: true }
  });
  const allocationIds = teacherAllocations.map(alloc => alloc.id);
  console.log(allocationIds);

  // 2. Find all attendance sheets that belong to any of those courses
  const attendances = await prisma.attendanceSession.findMany({
    where: { courseAllocationId: { in: allocationIds } },
    include: {
      courseAllocation: {
        include: { course: true }
      },
      records: {
        include: { student: true }
      }
    }
  });

  // Attach the attendance history to the teacher's data payload, flattened for the frontend
  const recentAttendance = attendances.map((session) => {
    return {
      id: session.id,
      name: session.courseAllocation.course.name,
      code: session.courseAllocation.course.code,
      department: session.courseAllocation.department,
      semester: session.courseAllocation.semester,
      section: session.courseAllocation.section,
      date: session.date,
      records: session.records.map(r => ({
        student: r.studentId, // keeping student id to match mongo format expectations
        status: r.status === "PRESENT" ? "Present" : r.status === "ABSENT" ? "Absent" : r.status === "LATE" ? "Late" : "Leave"
      })),
    };
  });

  const payload = {
    employeeId: teacher.employeeId,
    designation: teacher.designation,
    department: teacher.department,
    user: teacher.user,
    allocations: teacherAllocations,
    recentAttendance: recentAttendance
  };

  return res.status(200).json(payload);
});

app.get("/api/teacher/attendance/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await prisma.attendanceSession.findUnique({
      where: { id: parseInt(sessionId) }, // MySQL Prisma IDs are ints
      include: {
        courseAllocation: {
          include: { course: true }
        },
        records: {
          include: {
            student: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Format for frontend
    const payload = {
      id: session.id,
      date: session.date,
      courseName: session.courseAllocation.course.name || "Unknown Course",
      courseCode: session.courseAllocation.course.code || "Unknown Code",
      department: session.courseAllocation.department,
      semester: session.courseAllocation.semester,
      section: session.courseAllocation.section,
      students: session.records.map((record) => ({
        id: record.student.id,
        name: record.student.user?.name || "Unknown Student",
        rollNumber: record.student.rollNumber,
        status: record.status === "PRESENT" ? "Present" : record.status === "ABSENT" ? "Absent" : record.status === "LATE" ? "Late" : "Leave",
      })),
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/teacher/:teacherId/course/:courseCode", async (req, res) => {
  try {
    const { teacherId, courseCode } = req.params;

    const teacher = await prisma.teacher.findUnique({ where: { employeeId: teacherId } });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Find Allocations for this Teacher, then filter by courseCode
    const courseAllocations = await prisma.courseAllocation.findMany({
      where: {
        teacherId: teacher.id,
        course: { code: courseCode }
      },
      include: { course: true }
    });

    if (courseAllocations.length === 0) {
      return res.status(404).json({ message: "Course not found for this teacher" });
    }

    const allocationIds = courseAllocations.map((a) => a.id);
    const courseDetail = courseAllocations[0].course; // Metadata from populated field

    // Find Attendances for these allocations
    const attendances = await prisma.attendanceSession.findMany({
      where: { courseAllocationId: { in: allocationIds } },
      include: {
        courseAllocation: true,
        records: true
      },
      orderBy: { date: 'desc' }
    });

    // Calculate Stats
    const totalSessions = attendances.length;
    let totalPresent = 0;
    let totalStudentsAgg = 0;

    const formattedSessions = attendances.map((session) => {
      const presentCount = session.records.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE",
      ).length;
      const totalCount = session.records.length;

      totalPresent += presentCount;
      totalStudentsAgg += totalCount;

      return {
        id: session.id,
        date: session.date,
        name: courseDetail.name,
        department: session.courseAllocation.department,
        semester: session.courseAllocation.semester,
        section: session.courseAllocation.section,
        presentCount,
        totalCount,
      };
    });

    const overallAttendance =
      totalStudentsAgg > 0 ? (totalPresent / totalStudentsAgg) * 100 : 0;

    return res.status(200).json({
      courseCode: courseDetail.code,
      courseName: courseDetail.name,
      totalSessions,
      overallAttendance: Math.round(overallAttendance),
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/teacher/attendance/live/:allocationId", async (req, res) => {
  try {
    const { allocationId } = req.params;
    const alloc = await prisma.courseAllocation.findUnique({
      where: { id: parseInt(allocationId) },
      include: { course: true }
    });
    
    if (!alloc) return res.status(404).json({ message: "Course Allocation not found" });

    // Find all students exactly matching this allocation's demographics
    const students = await prisma.student.findMany({
      where: {
        department: alloc.department,
        semester: alloc.semester,
        section: alloc.section,
      },
      include: { user: { select: { name: true } } }
    });

    return res.status(200).json({
      allocation: alloc,
      students: students.map(s => ({
        id: s.id,
        name: s.user?.name || "Unknown",
        rollNumber: s.rollNumber,
      }))
    });
  } catch (error) {
    console.error("Error fetching live attendance roster:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/teacher/attendance/submit", async (req, res) => {
  try {
    const { courseAllocationId, date, records } = req.body;
    
    // We expect records to be array of objects with `student` (student id) and `status` ("Present", etc)
    const session = await prisma.attendanceSession.create({
      data: {
        courseAllocationId: parseInt(courseAllocationId),
        date: date ? new Date(date) : new Date(),
        records: {
          create: records.map(r => ({
            studentId: parseInt(r.student), // MongoDB objectIds might have been passed, but now they are ints
            status: r.status.toUpperCase() // Enum: PRESENT, ABSENT, LATE, LEAVE
          }))
        }
      }
    });
    
    return res.status(201).json({ message: "Attendance properly saved", id: session.id });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
