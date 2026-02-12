const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../model/user");
const Student = require("../model/student");
const Teacher = require("../model/teacher");
const Attendance = require("../model/attendance");
const connectDB = require("./db");

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Attendance.deleteMany();

    console.log("Data Destroyed...");

    // 2. Create Users (The Login Credentials)
    // Teacher User
    const teacherUser = await User.create({
      name: "Professor Snape",
      email: "teacher@college.edu",
      password: "password123", // In a real app, hash this!
      role: "teacher",
    });

    // Student Users
    const studentUsers = await User.insertMany([
      {
        name: "Harry Potter",
        email: "student1@college.edu",
        password: "password123",
        role: "student",
      },
      {
        name: "Hermione Granger",
        email: "student2@college.edu",
        password: "password123",
        role: "student",
      },
      {
        name: "Ron Weasley",
        email: "student3@college.edu",
        password: "password123",
        role: "student",
      },
      {
        name: "Draco Malfoy",
        email: "student4@college.edu",
        password: "password123",
        role: "student",
      },
      {
        name: "Neville Longbottom",
        email: "student5@college.edu",
        password: "password123",
        role: "student",
      },
    ]);

    // 3. Create Profiles (The Detailed Data)
    // Teacher Profile
    const teacherProfile = await Teacher.create({
      user: teacherUser._id,
      employeeId: "EMP-001",
      designation: "Senior Professor",
      department: "Magic",
      subjects: ["Potions", "Defense Against the Dark Arts"],
    });

    // Student Profiles
    const studentProfiles = await Promise.all(
      studentUsers.map(async (user, index) => {
        return await Student.create({
          user: user._id,
          rollNumber: `BCA-00${index + 1}`,
          department: "BCA",
          semester: 1,
          section: "A",
          batch: "2024-2027",
          contactNumber: "1234567890",
        });
      }),
    );

    console.log("Users & Profiles Created...");

    // 4. Create Dummy Attendance (Past 3 Days)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    const dates = [yesterday, dayBefore];

    for (const date of dates) {
      // Create records for the BCA Section A class
      const records = studentProfiles.map((student) => ({
        student: student._id,
        status: Math.random() > 0.2 ? 1 : 0, // 80% chance of being present
      }));

      await Attendance.create({
        date: date,
        subject: "Potions",
        teacher: teacherProfile._id,
        semester: 1,
        section: "A",
        records: records,
      });
    }

    console.log("Dummy Attendance Added!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
