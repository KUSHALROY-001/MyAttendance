const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. WIPE THE DATABASE CLEAN
  // Deleting from the top-level User and Course cascades down to everything else
  // based on the onDelete: Cascade rules in your schema.
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.courseAllocation.deleteMany();
  await prisma.studentCourse.deleteMany();
  await prisma.teacherSchedule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleared!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // 2. CREATE ADMIN
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@college.edu",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // 3. CREATE TEACHERS (Nested Write: Creates User AND Teacher together)
  const teacherData = [
    {
      name: "Albus Dumbledore",
      email: "albus@college.edu",
      empId: "EMP-001",
      desig: "Principal",
    },
    {
      name: "Minerva McGonagall",
      email: "minerva@college.edu",
      empId: "EMP-002",
      desig: "Vice Principal",
    },
    {
      name: "Severus Snape",
      email: "severus@college.edu",
      empId: "EMP-003",
      desig: "HOD",
    },
  ];

  const teachers = [];
  for (const t of teacherData) {
    const createdTeacher = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        password: hashedPassword,
        role: "TEACHER",
        teacher: {
          // Matches the "teacher Teacher?" relation in User model
          create: {
            employeeId: t.empId,
            designation: t.desig,
            department: "BCA",
          },
        },
      },
      include: { teacher: true },
    });
    teachers.push(createdTeacher.teacher);
  }

  // 4. CREATE COURSES
  const courseData = [
    {
      name: "Programming in C",
      code: "BCA-101",
      department: "BCA",
      semester: 1,
      credits: 4,
    },
    {
      name: "Web Development",
      code: "BCA-102",
      department: "BCA",
      semester: 1,
      credits: 3,
    },
    {
      name: "Data Structures",
      code: "BCA-103",
      department: "BCA",
      semester: 1,
      credits: 4,
    },
    {
      name: "Database Management",
      code: "BCA-104",
      department: "BCA",
      semester: 1,
      credits: 3,
    },
  ];

  const courses = [];
  for (const c of courseData) {
    courses.push(await prisma.course.create({ data: c }));
  }

  // 5. CREATE STUDENTS & ENROLL THEM (via StudentCourse explicit join table)
  const studentData = [
    { name: "Harry Potter", email: "harry@college.edu" },
    { name: "Hermione Granger", email: "hermione@college.edu" },
    { name: "Ron Weasley", email: "ron@college.edu" },
    { name: "Draco Malfoy", email: "draco@college.edu" },
    { name: "Neville Longbottom", email: "neville@college.edu" },
  ];

  const students = [];
  for (let i = 0; i < studentData.length; i++) {
    const s = studentData[i];
    const createdStudent = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: hashedPassword,
        role: "STUDENT",
        student: {
          // Matches the "student Student?" relation in User model
          create: {
            rollNumber: `BCA-00${i + 1}`,
            department: "BCA",
            semester: 1,
            batch: "2024-2027",
            contactNumber: `987654321${i}`,
            // Create the explicit join table records
            enrolledCourses: {
              create: courses.map((course) => ({
                courseId: course.id,
              })),
            },
          },
        },
      },
      include: { student: true },
    });
    students.push(createdStudent.student);
  }

  // 6. ALLOCATE COURSES TO TEACHERS
  const allocations = await Promise.all([
    prisma.courseAllocation.create({
      data: {
        teacherId: teachers[0].id,
        courseId: courses[0].id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
    }),
    prisma.courseAllocation.create({
      data: {
        teacherId: teachers[1].id,
        courseId: courses[1].id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
    }),
    prisma.courseAllocation.create({
      data: {
        teacherId: teachers[2].id,
        courseId: courses[2].id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
    }),
    prisma.courseAllocation.create({
      data: {
        teacherId: teachers[2].id,
        courseId: courses[3].id,
        department: "BCA",
        semester: 1,
        section: "A",
      },
    }),
  ]);

  // 7. CREATE TEACHER SCHEDULES (New Model)
  await prisma.teacherSchedule.createMany({
    data: [
      {
        teacherId: teachers[0].id,
        day: "Monday",
        slots: "1,2",
        subject: "Programming in C",
        department: "BCA",
        semester: "1",
        section: "A",
        room: "Lab 1",
        classType: "lab",
      },
      {
        teacherId: teachers[1].id,
        day: "Tuesday",
        slots: "3",
        subject: "Web Development",
        department: "BCA",
        semester: "1",
        section: "A",
        room: "Room 101",
        classType: "class",
      },
      {
        teacherId: teachers[2].id,
        day: "Wednesday",
        slots: "4,5",
        subject: "Data Structures",
        department: "BCA",
        semester: "1",
        section: "A",
        room: "Room 102",
        classType: "class",
      },
      {
        teacherId: teachers[2].id,
        day: "Thursday",
        slots: "1",
        subject: "Database Management",
        department: "BCA",
        semester: "1",
        section: "A",
        room: "Room 103",
        classType: "class",
      },
    ],
  });

  // 8. GENERATE ATTENDANCE DATA (Past 15 days)
  console.log("Generating 15 days of attendance records...");
  const today = new Date();

  for (let i = 0; i < 15; i++) {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0); // Normalize time
    targetDate.setDate(today.getDate() - i);

    if (targetDate.getDay() === 0) continue; // Skip Sundays

    for (const alloc of allocations) {
      // Create the Session first
      const session = await prisma.attendanceSession.create({
        data: {
          courseAllocationId: alloc.id,
          date: targetDate,
        },
      });

      // Prepare records for the students
      const recordsToCreate = students.map((student, idx) => {
        let status = "PRESENT";
        const randomFactor = Math.random();

        if (idx === 2 && randomFactor > 0.6)
          status = "ABSENT"; // Ron (Index 2) absent often
        else if (idx === 0 && randomFactor > 0.85)
          status = "LATE"; // Harry (Index 0) late often
        else if (randomFactor > 0.92) status = "ABSENT";
        else if (randomFactor > 0.88) status = "LEAVE";

        return {
          sessionId: session.id,
          studentId: student.id,
          status: status,
        };
      });

      // Insert all records for this session in bulk
      await prisma.attendanceRecord.createMany({
        data: recordsToCreate,
      });
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
