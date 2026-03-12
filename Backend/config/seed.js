const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

// Importing the 6-Schema structure from the 'model' folder
const User = require("../model/user");
const Student = require("../model/student");
const Teacher = require("../model/teacher");
const Course = require("../model/subject");
const CourseAllocation = require("../model/courseAllocation");
const Attendance = require("../model/attendance");
const connectDB = require("./db");

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const importData = async () => {
  try {
    await connectDB();

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

    // Admins
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@college.edu",
      password: hashedPassword,
      role: "admin",
    });

    // Teachers
    const teacherUsers = await User.insertMany([
      {
        name: "Albus Dumbledore",
        email: "albus@college.edu",
        password: hashedPassword,
        role: "teacher",
      },
      {
        name: "Minerva McGonagall",
        email: "minerva@college.edu",
        password: hashedPassword,
        role: "teacher",
      },
      {
        name: "Severus Snape",
        email: "severus@college.edu",
        password: hashedPassword,
        role: "teacher",
      },
    ]);

    const teacherProfiles = await Teacher.insertMany([
      {
        user: teacherUsers[0]._id,
        employeeId: "EMP-001",
        designation: "Principal",
        department: "BCA",
        subjects: ["Programming in C"],
      },
      {
        user: teacherUsers[1]._id,
        employeeId: "EMP-002",
        designation: "Vice Principal",
        department: "BCA",
        subjects: ["Web Development"],
      },
      {
        user: teacherUsers[2]._id,
        employeeId: "EMP-003",
        designation: "HOD",
        department: "BCA",
        subjects: ["Data Structures"],
      },
    ]);

    // Students
    const studentUsers = await User.insertMany([
      {
        name: "Harry Potter",
        email: "harry@college.edu",
        password: hashedPassword,
        role: "student",
      },
      {
        name: "Hermione Granger",
        email: "hermione@college.edu",
        password: hashedPassword,
        role: "student",
      },
      {
        name: "Ron Weasley",
        email: "ron@college.edu",
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
          contactNumber: `987654321${i}`,
        });
      }),
    );

    // 3. Create Courses
    const courses = await Course.insertMany([
      {
        name: "Programming in C",
        code: "BCA-101",
        department: "BCA",
        credits: 4,
      },
      {
        name: "Web Development",
        code: "BCA-102",
        department: "BCA",
        credits: 3,
      },
      {
        name: "Data Structures",
        code: "BCA-103",
        department: "BCA",
        credits: 4,
      },
    ]);

    // Update students with these courses
    for (let student of studentProfiles) {
      student.courses = [courses[0]._id, courses[1]._id, courses[2]._id];
      await student.save();
    }

    // 4. Create Allocations
    const allocations = await CourseAllocation.insertMany([
      {
        teacher: teacherProfiles[0]._id,
        course: courses[0]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
      {
        teacher: teacherProfiles[1]._id,
        course: courses[1]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
      {
        teacher: teacherProfiles[2]._id,
        course: courses[2]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
    ]);

    // 5. Create Attendance Records
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    await Attendance.insertMany([
      {
        courseAllocation: allocations[0]._id,
        date: today,
        records: studentProfiles.map((student, i) => ({
          student: student._id,
          status: i === 0 ? "Absent" : "Present",
        })),
      },
      {
        courseAllocation: allocations[1]._id,
        date: yesterday,
        records: studentProfiles.map((student, i) => ({
          student: student._id,
          status: i === 1 ? "Absent" : "Present",
        })),
      },
      {
        courseAllocation: allocations[2]._id,
        date: dayBeforeYesterday,
        records: studentProfiles.map((student, i) => ({
          student: student._id,
          status: i === 2 ? "Leave" : "Present",
        })),
      },
    ]);

    console.log(
      "University Enterprise Data Seeded Successfully with >= 3 records per collection! 🎓",
    );
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
