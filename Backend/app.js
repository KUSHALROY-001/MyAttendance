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
  });
  const allocationIds = teacherAllocations.map((alloc) => alloc._id);
  console.log(allocationIds);

  // 2. Find all attendance sheets that belong to any of those courses, dropping internal DB fields
  const attendances = await Attendance.find(
    { courseAllocation: { $in: allocationIds } },
    { createdAt: 0, updatedAt: 0, __v: 0, _id: 0 },
  ).populate({
    path: "courseAllocation",
    select: "-_id course department semester section",
    populate: { path: "course", select: "-_id name code" },
  });

  // Attach the attendance history to the teacher's data payload, flattened for the frontend
  teacher = teacher.toObject();
  
  teacher.recentAttendance = attendances.map(att => {
    return {
      name: att.courseAllocation?.course?.name,
      code: att.courseAllocation?.course?.code,
      department: att.courseAllocation?.department,
      semester: att.courseAllocation?.semester,
      section: att.courseAllocation?.section,
      date: att.date,
      records: att.records
    };
  });

  // Final cleanup: remove the teacher's internal DB ID before sending
  delete teacher._id;

  return res.status(200).json(teacher);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
