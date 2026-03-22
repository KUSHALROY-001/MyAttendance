const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const { Student, Attendance, Teacher, CourseAllocation } = require("./model");
const { log } = require("console");

// Load environment variables (looks for .env in project root)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
connectDB();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api", function (req, res) {
  console.log(req.body);
  res.send("Hello World");
});

app.get("/api/student/dashboard/:roll", async (req, res) => {
  const { roll } = req.params;
  console.log(roll);
  let studentData = await Student.findOne(
    { rollNumber: roll },
    { createdAt: 0, updatedAt: 0, __v: 0 },
  )
    .populate("courses", "-_id name code") //In Mongoose, when you are selecting fields or populating, you can put a minus sign (-) in front of a field name to forcefully exclude it
    .populate("user", "-_id name email");

  if (!studentData) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Find all attendance documents for this specific student
  const attendances = await Attendance.find({
    "records.student": studentData._id,
  }).populate({
    path: "courseAllocation",
    select: "-_id course teacher",
    populate: [
      { path: "course", select: "-_id name code" },
      {
        path: "teacher",
        select: "-_id user",
        populate: { path: "user", select: "-_id name" },
      },
    ],
  });

  studentData = studentData.toObject();

  // Create an object to track totals for each course
  const courseStatsMap = {};

  // Initialize stats for every course the student is officially enrolled in
  if (studentData.courses) {
    studentData.courses.forEach((c) => {
      courseStatsMap[c.code] = {
        courseId: c.code, // Frontend uses course code or DB id, we'll use code for easier mapping
        courseCode: c.code,
        courseName: c.name,
        totalClasses: 0,
        attendedClasses: 0,
      };
    });
  }

  // Create a clean attendance array for the frontend with only this student's status
  studentData.attendance = attendances.map((att) => {
    const myRecord = att.records.find(
      (r) => r.student.toString() === studentData._id.toString(),
    ); //Find the specific student's record in the attendance document

    const status = myRecord ? myRecord.status : "Absent";
    const courseCode = att.courseAllocation?.course?.code;

    // Build the course statistics
    if (courseCode) {
      if (!courseStatsMap[courseCode]) {
        // If they attended a class they aren't fully enrolled in, track it anyway
        courseStatsMap[courseCode] = {
          courseId: courseCode,
          courseCode: courseCode,
          courseName: att.courseAllocation?.course?.name || "Unknown",
          totalClasses: 0,
          attendedClasses: 0,
        };
      }

      courseStatsMap[courseCode].totalClasses += 1;

      if (status === "Present" || status === "Late") {
        courseStatsMap[courseCode].attendedClasses += 1;
      }
    }

    return {
      date: att.date,
      teacher: {
        name: att.courseAllocation?.teacher?.user?.name || "Unknown Teacher",
      },
      course: {
        name: att.courseAllocation?.course?.name || "Unknown Course",
        code: courseCode || "Unknown Code",
      },
      status: status, // Only send this student's status
    };
  });

  // Calculate the final percentage exactly as the frontend expects
  studentData.summaries = Object.values(courseStatsMap).map((stat) => {
    //Object.values() is a built-in Javascript tool that takes an object, rips off all the outer keys (like "BCA-101" and "BCA-102"), and turns everything inside into a clean Array.
    return {
      ...stat,
      percentage:
        stat.totalClasses > 0
          ? (stat.attendedClasses / stat.totalClasses) * 100
          : 0,
    };
  });

  // Final cleanup: remove internal DB IDs before sending to frontend
  delete studentData._id;

  return res.status(200).json(studentData);
});

app.get("/api/teacher/dashboard/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  let teacher = await Teacher.findOne(
    { employeeId: teacherId },
    { createdAt: 0, updatedAt: 0, __v: 0 },
  ).populate({
    path: "user",
    select: "-_id name email",
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  console.log(teacher);
  // 1. Find all courses this specific teacher is assigned to teach
  const teacherAllocations = await CourseAllocation.find({
    teacher: teacher._id,
  }).populate({ path: "course", select: "-_id name code" });
  const allocationIds = teacherAllocations.map((alloc) => alloc._id);
  console.log(allocationIds);

  // 2. Find all attendance sheets that belong to any of those courses, dropping internal DB fields
  const attendances = await Attendance.find(
    { courseAllocation: { $in: allocationIds } },
    { createdAt: 0, updatedAt: 0, __v: 0 },
  ).populate({
    path: "courseAllocation",
    select: "-_id course department semester section",
    populate: { path: "course", select: "-_id name code" },
  });

  // Attach the attendance history to the teacher's data payload, flattened for the frontend
  teacher = teacher.toObject();

  teacher.recentAttendance = attendances.map((att) => {
    return {
      id: att._id,
      name: att.courseAllocation?.course?.name,
      code: att.courseAllocation?.course?.code,
      department: att.courseAllocation?.department,
      semester: att.courseAllocation?.semester,
      section: att.courseAllocation?.section,
      date: att.date,
      records: att.records,
    };
  });

  // Attach all assigned subjects directly to the teacher payload for the new Modal logic
  teacher.allocations = teacherAllocations;

  // Final cleanup: remove the teacher's internal DB ID before sending
  delete teacher._id;

  return res.status(200).json(teacher);
});

app.get("/api/teacher/attendance/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const attendance = await Attendance.findById(sessionId)
      .populate({
        path: "courseAllocation",
        populate: { path: "course", select: "-_id name code" },
      })
      .populate({
        path: "records.student",
        select: "rollNumber user",
        populate: { path: "user", select: "name avatar" },
      });

    if (!attendance) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Format for frontend
    const payload = {
      id: attendance._id,
      date: attendance.date,
      courseName: attendance.courseAllocation?.course?.name || "Unknown Course",
      courseCode: attendance.courseAllocation?.course?.code || "Unknown Code",
      department: attendance.courseAllocation?.department,
      semester: attendance.courseAllocation?.semester,
      section: attendance.courseAllocation?.section,
      students: attendance.records.map((record) => ({
        id: record.student._id,
        name: record.student.user?.name || "Unknown Student",
        rollNumber: record.student.rollNumber,
        status: record.status,
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

    const teacher = await Teacher.findOne({ employeeId: teacherId });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Find Allocations for this Teacher, then filter by courseCode
    const allocations = await CourseAllocation.find({
      teacher: teacher._id,
    }).populate("course");

    // Find the allocation matching the courseCode
    const courseAllocations = allocations.filter(
      (a) => a.course && a.course.code === courseCode,
    );

    if (courseAllocations.length === 0) {
      return res
        .status(404)
        .json({ message: "Course not found for this teacher" });
    }

    const allocationIds = courseAllocations.map((a) => a._id);
    const courseDetail = courseAllocations[0].course; // Metadata from populated field

    // Find Attendances for these allocations
    const attendances = await Attendance.find({
      courseAllocation: { $in: allocationIds },
    })
      .populate({
        path: "courseAllocation",
        select: "department semester section",
      })
      .sort({ date: -1 });

    // Calculate Stats
    const totalSessions = attendances.length;
    let totalPresent = 0;
    let totalStudentsAgg = 0;

    const formattedSessions = attendances.map((att) => {
      const presentCount = att.records.filter(
        (r) => r.status === "Present" || r.status === "Late",
      ).length;
      const totalCount = att.records.length;

      totalPresent += presentCount;
      totalStudentsAgg += totalCount;

      return {
        id: att._id,
        date: att.date,
        name: courseDetail.name,
        department: att.courseAllocation?.department,
        semester: att.courseAllocation?.semester,
        section: att.courseAllocation?.section,
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
    const alloc = await CourseAllocation.findById(allocationId).populate("course");
    if (!alloc) return res.status(404).json({ message: "Course Allocation not found" });

    // Find all students exactly matching this allocation's demographics
    const students = await Student.find({
      department: alloc.department,
      semester: alloc.semester,
      section: alloc.section,
    }).populate("user", "name avatar");

    return res.status(200).json({
      allocation: alloc,
      students: students.map(s => ({
        id: s._id,
        name: s.user?.name || "Unknown",
        rollNumber: s.rollNumber,
        avatar: s.user?.avatar
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
    
    const attendance = new Attendance({
      courseAllocation: courseAllocationId,
      date: date || new Date(),
      records: records,
    });
    
    await attendance.save();
    return res.status(201).json({ message: "Attendance properly saved", id: attendance._id });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
