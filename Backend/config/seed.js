const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

// Importing the new 6-Schema structure from the 'model' folder
const User = require("../model/user");
const Student = require("../model/student");
const Teacher = require("../model/teacher");
const Course = require("../model/subject");
const CourseAllocation = require("../model/courseAllocation");
const Attendance = require("../model/attendance");
const connectDB = require("./db");

// Load env vars
// make sure dotenv looks in the backend folder's parent for the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // 1. Wipe the database clean
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Course.deleteMany();
    await CourseAllocation.deleteMany();
    await Attendance.deleteMany();

    console.log("Database Cleared...");

    // Hash the default password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 2. Create Users & Profiles
    const teacherUser = await User.create({
      name: "Professor Snape",
      email: "teacher@college.edu",
      password: hashedPassword,
      role: "teacher",
    });

    const teacherProfile = await Teacher.create({
      user: teacherUser._id,
      employeeId: "EMP-001",
      designation: "HOD",
      department: "BCA",
    });

    const studentUsers = await User.insertMany([
      {
        name: "Harry Potter",
        email: "student1@college.edu",
        password: hashedPassword,
        role: "student",
      },
      {
        name: "Hermione Granger",
        email: "student2@college.edu",
        password: hashedPassword,
        role: "student",
      },
    ]);

    const studentProfiles = await Promise.all(
      studentUsers.map(async (user, i) => {
        return await Student.create({
          user: user._id,
          rollNumber: `BCA-00${i + 1}`,
          department: "BCA",
          semester: 1,
          section: "A",
          batch: "2024-2027",
        });
      }),
    );

    // 3. Create Courses
    const course1 = await Course.create({
      name: "Programming in C",
      code: "BCA-101",
      department: "BCA",
      credits: 4,
    });

    const course2 = await Course.create({
      name: "Web Development",
      code: "BCA-102",
      department: "BCA",
      credits: 3,
    });

    // 4. Create Allocations (Assign Snape to teach these courses to BCA Sem 1 Sec A)
    const allocation1 = await CourseAllocation.create({
      teacher: teacherProfile._id,
      course: course1._id,
      department: "BCA",
      semester: 1,
      section: "A",
    });

    const allocation2 = await CourseAllocation.create({
      teacher: teacherProfile._id,
      course: course2._id,
      department: "BCA",
      semester: 1,
      section: "A",
    });

    // 5. Create Dummy Attendance using the exact Allocation ID
    const today = new Date();
    await Attendance.create({
      courseAllocation: allocation1._id,
      date: today,
      records: studentProfiles.map((student) => ({
        student: student._id,
        status: "Present",
      })),
    });

    console.log("University Enterprise Data Seeded Successfully! 🎓");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
