const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

// Clean import using your model/index.js file
const {
  User,
  Student,
  Teacher,
  Course,
  CourseAllocation,
  Attendance,
} = require("../model");

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

    // CRITICAL FIX: Clean up old legacy indexes from previous schema versions
    // This removes the old "date_1_subject_1_section_1" constraint causing the E11000 error
    await User.syncIndexes();
    await Student.syncIndexes();
    await Teacher.syncIndexes();
    await Course.syncIndexes();
    await CourseAllocation.syncIndexes();
    await Attendance.syncIndexes();

    console.log("Database Cleared and Legacy Indexes Dropped...");

    // Hash the default password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // ---------------------------------------------------------
    // 2. CREATE USERS & PROFILES (Teachers & Students)
    // ---------------------------------------------------------
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@college.edu",
      password: hashedPassword,
      role: "admin",
    });

    // Create 3 Teachers
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
        schedule: [
          {
            day: "Monday",
            startTime: "10:00 AM",
            endTime: "11:00 AM",
            subject: "Programming in C",
            department: "BCA",
            semester: 1,
            section: "A",
          },
          {
            day: "Wednesday",
            startTime: "02:00 PM",
            endTime: "03:00 PM",
            subject: "Programming in C",
            department: "BCA",
            semester: 1,
            section: "B",
          },
          {
            day: "Friday",
            startTime: "04:30 PM",
            endTime: "05:30 PM",
            subject: "Programming in C",
            department: "BCA",
            semester: 1,
            section: "C",
          },
        ],
      },
      {
        user: teacherUsers[1]._id,
        employeeId: "EMP-002",
        designation: "Vice Principal",
        department: "BCA",
        subjects: ["Web Development"],
        schedule: [
          {
            day: "Tuesday",
            startTime: "11:00 AM",
            endTime: "12:00 PM",
            subject: "Web Development",
            department: "BCA",
            semester: 1,
            section: "A",
          },
          {
            day: "Thursday",
            startTime: "04:30 PM",
            endTime: "05:30 PM",
            subject: "Web Development",
            department: "BCA",
            semester: 1,
            section: "B",
          },
          {
            day: "Friday",
            startTime: "11:00 AM",
            endTime: "12:00 PM",
            subject: "Web Development",
            department: "BCA",
            semester: 1,
            section: "C",
          },
        ],
      },
      {
        user: teacherUsers[2]._id,
        employeeId: "EMP-003",
        designation: "HOD",
        department: "BCA",
        subjects: ["Data Structures", "Database Management"],
        schedule: [
          {
            day: "Monday",
            startTime: "01:00 PM",
            endTime: "02:00 PM",
            subject: "Data Structures",
            department: "BCA",
            semester: 1,
            section: "A",
          },
          {
            day: "Tuesday",
            startTime: "09:00 AM",
            endTime: "10:00 AM",
            subject: "Database Management",
            department: "BCA",
            semester: 1,
            section: "B",
          },
          {
            day: "Thursday",
            startTime: "02:00 PM",
            endTime: "03:00 PM",
            subject: "Data Structures",
            department: "BCA",
            semester: 1,
            section: "C",
          },
          {
            day: "Friday",
            startTime: "02:00 PM",
            endTime: "03:00 PM",
            subject: "Database Management",
            department: "BCA",
            semester: 1,
            section: "A",
          },
        ],
      },
    ]);

    // Create 5 Students
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
      {
        name: "Draco Malfoy",
        email: "draco@college.edu",
        password: hashedPassword,
        role: "student",
      },
      {
        name: "Neville Longbottom",
        email: "neville@college.edu",
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

    // ---------------------------------------------------------
    // 3. CREATE COURSES (Subjects)
    // ---------------------------------------------------------
    const courses = await Course.insertMany([
      {
        name: "Programming in C",
        code: "BCA-101",
        info: { department: "BCA", semester: 1 },
        credits: 4,
      },
      {
        name: "Web Development",
        code: "BCA-102",
        info: { department: "BCA", semester: 1 },
        credits: 3,
      },
      {
        name: "Data Structures",
        code: "BCA-103",
        info: { department: "BCA", semester: 1 },
        credits: 4,
      },
      {
        name: "Database Management",
        code: "BCA-104",
        info: { department: "BCA", semester: 1 },
        credits: 3,
      },
    ]);

    // Enroll students in all 4 courses
    const courseIds = courses.map((c) => c._id);
    for (let student of studentProfiles) {
      student.courses = courseIds;
      await student.save();
    }

    // ---------------------------------------------------------
    // 4. CREATE COURSE ALLOCATIONS
    // ---------------------------------------------------------
    const allocations = await CourseAllocation.insertMany([
      {
        teacher: teacherProfiles[0]._id,
        course: courses[0]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      }, // Dumbledore teaches C
      {
        teacher: teacherProfiles[1]._id,
        course: courses[1]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      }, // McGonagall teaches Web
      {
        teacher: teacherProfiles[2]._id,
        course: courses[2]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      }, // Snape teaches DS
      {
        teacher: teacherProfiles[2]._id,
        course: courses[3]._id,
        department: "BCA",
        semester: 1,
        section: "A",
      }, // Snape teaches DBMS
    ]);

    // ---------------------------------------------------------
    // 5. GENERATE RICH ATTENDANCE DATA (Past 15 days)
    // ---------------------------------------------------------
    const attendanceDocs = [];
    const today = new Date();

    // Loop backwards for the last 15 days
    for (let i = 0; i < 15; i++) {
      const targetDate = new Date();
      targetDate.setHours(0, 0, 0, 0); // Normalize to midnight to prevent minute/second mismatch
      targetDate.setDate(today.getDate() - i);

      // Skip Sundays (0) to make it realistic
      if (targetDate.getDay() === 0) continue;

      // Create an attendance record for EVERY course allocation on this day
      for (const alloc of allocations) {
        // Randomize student presence to make dashboards look realistic
        const records = studentProfiles.map((student) => {
          let status = "Present";
          const randomFactor = Math.random();

          // Give Ron lower attendance, Hermione perfect attendance, etc.
          if (
            studentUsers.find((u) => u._id.equals(student.user)).name ===
              "Ron Weasley" &&
            randomFactor > 0.6
          ) {
            status = "Absent";
          } else if (
            studentUsers.find((u) => u._id.equals(student.user)).name ===
              "Harry Potter" &&
            randomFactor > 0.85
          ) {
            status = "Late";
          } else if (randomFactor > 0.92) {
            status = "Absent"; // Random chance of anyone being absent
          } else if (randomFactor > 0.88) {
            status = "Leave";
          }

          return { student: student._id, status: status };
        });

        attendanceDocs.push({
          courseAllocation: alloc._id,
          date: targetDate,
          records: records,
        });
      }
    }

    await Attendance.insertMany(attendanceDocs);

    console.log(`✅ Successfully seeded:
    - ${await User.countDocuments()} Users
    - ${await Student.countDocuments()} Students
    - ${await Teacher.countDocuments()} Teachers
    - ${await Course.countDocuments()} Courses
    - ${await CourseAllocation.countDocuments()} Allocations
    - ${await Attendance.countDocuments()} Attendance Records!`);

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

importData();
