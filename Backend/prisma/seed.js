const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // ──────────────────────────────────────────────────────────
  // 1. WIPE THE DATABASE CLEAN (order matters for relations)
  // ──────────────────────────────────────────────────────────
  await prisma.studentAttendanceStat.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.courseAllocation.deleteMany();
  await prisma.studentCourse.deleteMany();
  await prisma.teacherSchedule.deleteMany();
  await prisma.libraryResource.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();
  await prisma.departmentInfo.deleteMany();
  console.log("Database cleared!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // ──────────────────────────────────────────────────────────
  // 2. CREATE DEPARTMENTS
  // ──────────────────────────────────────────────────────────
  const departments = [];
  const departmentData = [
    {
      name: "Bachelor of Computer Applications",
      code: "BCA",
      semesterDetails: [
        { semester: 1, sections: ["A", "B", "C"] },
        { semester: 2, sections: ["A", "B"] },
        { semester: 3, sections: ["A", "B"] },
        { semester: 4, sections: ["A"] },
        { semester: 5, sections: ["A"] },
        { semester: 6, sections: ["A"] },
      ],
    },
    {
      name: "Bachelor of Business Administration",
      code: "BBA",
      semesterDetails: [
        { semester: 1, sections: ["A", "B"] },
        { semester: 2, sections: ["A", "B"] },
        { semester: 3, sections: ["A"] },
        { semester: 4, sections: ["A"] },
        { semester: 5, sections: ["A"] },
        { semester: 6, sections: ["A"] },
      ],
    },
    {
      name: "Bachelor of Commerce",
      code: "BCOM",
      semesterDetails: [
        { semester: 1, sections: ["A"] },
        { semester: 2, sections: ["A"] },
        { semester: 3, sections: ["A"] },
        { semester: 4, sections: ["A"] },
      ],
    },
  ];
  for (const d of departmentData) {
    departments.push(await prisma.departmentInfo.create({ data: d }));
  }
  console.log(`✅ ${departments.length} departments created`);

  // ──────────────────────────────────────────────────────────
  // 3. CREATE ADMIN
  // ──────────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@college.edu",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // ──────────────────────────────────────────────────────────
  // 4. CREATE TEACHERS
  // ──────────────────────────────────────────────────────────
  const teacherData = [
    {
      name: "Albus Dumbledore",
      email: "albus@college.edu",
      empId: "EMP-001",
      desig: "Principal",
      dept: "BCA",
      contact: "9876543220",
    },
    {
      name: "Minerva McGonagall",
      email: "minerva@college.edu",
      empId: "EMP-002",
      desig: "Vice Principal",
      dept: "BCA",
      contact: "9876543221",
    },
    {
      name: "Severus Snape",
      email: "severus@college.edu",
      empId: "EMP-003",
      desig: "HOD",
      dept: "BCA",
      contact: "9876543222",
    },
    {
      name: "Filius Flitwick",
      email: "filius@college.edu",
      empId: "EMP-004",
      desig: "Professor",
      dept: "BCA",
      contact: "9876543223",
    },
    {
      name: "Pomona Sprout",
      email: "pomona@college.edu",
      empId: "EMP-005",
      desig: "Professor",
      dept: "BBA",
      contact: "9876543224",
    },
    {
      name: "Horace Slughorn",
      email: "horace@college.edu",
      empId: "EMP-006",
      desig: "HOD",
      dept: "BBA",
      contact: "9876543225",
    },
    {
      name: "Remus Lupin",
      email: "remus@college.edu",
      empId: "EMP-007",
      desig: "Professor",
      dept: "BCOM",
      contact: "9876543226",
    },
  ];

  const teachers = [];
  for (const t of teacherData) {
    const created = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        password: hashedPassword,
        role: "TEACHER",
        teacher: {
          create: {
            employeeId: t.empId,
            designation: t.desig,
            department: t.dept,
            contactNumber : t.contact
          },
        },
      },
      include: { teacher: true },
    });
    teachers.push(created.teacher);
  }
  console.log(`✅ ${teachers.length} teachers created`);

  // ──────────────────────────────────────────────────────────
  // 5. CREATE COURSES (multiple departments & semesters)
  // ──────────────────────────────────────────────────────────
  const courseData = [
    // BCA Semester 1
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
    {
      name: "Digital Electronics",
      code: "BCA-105",
      department: "BCA",
      semester: 1,
      credits: 3,
    },
    // BCA Semester 2
    {
      name: "Object Oriented Programming",
      code: "BCA-201",
      department: "BCA",
      semester: 2,
      credits: 4,
    },
    {
      name: "Computer Networks",
      code: "BCA-202",
      department: "BCA",
      semester: 2,
      credits: 3,
    },
    {
      name: "Operating Systems",
      code: "BCA-203",
      department: "BCA",
      semester: 2,
      credits: 4,
    },
    {
      name: "Software Engineering",
      code: "BCA-204",
      department: "BCA",
      semester: 2,
      credits: 3,
    },
    // BBA Semester 1
    {
      name: "Principles of Management",
      code: "BBA-101",
      department: "BBA",
      semester: 1,
      credits: 3,
    },
    {
      name: "Financial Accounting",
      code: "BBA-102",
      department: "BBA",
      semester: 1,
      credits: 4,
    },
    {
      name: "Business Economics",
      code: "BBA-103",
      department: "BBA",
      semester: 1,
      credits: 3,
    },
    {
      name: "Organizational Behavior",
      code: "BBA-104",
      department: "BBA",
      semester: 1,
      credits: 3,
    },
    // BCOM Semester 1
    {
      name: "Cost Accounting",
      code: "BCOM-101",
      department: "BCOM",
      semester: 1,
      credits: 4,
    },
    {
      name: "Business Law",
      code: "BCOM-102",
      department: "BCOM",
      semester: 1,
      credits: 3,
    },
    {
      name: "Corporate Finance",
      code: "BCOM-103",
      department: "BCOM",
      semester: 1,
      credits: 3,
    },
  ];

  const courses = [];
  for (const c of courseData) {
    courses.push(await prisma.course.create({ data: c }));
  }
  console.log(`✅ ${courses.length} courses created`);

  // Helper: get courses by dept & semester
  const getCourses = (dept, sem) =>
    courses.filter((c) => c.department === dept && c.semester === sem);
  const bcaSem1Courses = getCourses("BCA", 1);

  // ──────────────────────────────────────────────────────────
  // 6. CREATE STUDENTS & ENROLL THEM
  // ──────────────────────────────────────────────────────────
  const studentData = [
    // BCA Sem 1 — Section A
    {
      name: "Harry Potter",
      email: "harry@college.edu",
      roll: "BCA-001",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543210",
    },
    {
      name: "Hermione Granger",
      email: "hermione@college.edu",
      roll: "BCA-002",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543211",
    },
    {
      name: "Ron Weasley",
      email: "ron@college.edu",
      roll: "BCA-003",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543212",
    },
    {
      name: "Draco Malfoy",
      email: "draco@college.edu",
      roll: "BCA-004",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543213",
    },
    {
      name: "Neville Longbottom",
      email: "neville@college.edu",
      roll: "BCA-005",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543214",
    },
    {
      name: "Luna Lovegood",
      email: "luna@college.edu",
      roll: "BCA-006",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543215",
    },
    {
      name: "Ginny Weasley",
      email: "ginny@college.edu",
      roll: "BCA-007",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543216",
    },
    {
      name: "Seamus Finnigan",
      email: "seamus@college.edu",
      roll: "BCA-008",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543217",
    },
    {
      name: "Dean Thomas",
      email: "dean@college.edu",
      roll: "BCA-009",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543218",
    },
    {
      name: "Lavender Brown",
      email: "lavender@college.edu",
      roll: "BCA-010",
      dept: "BCA",
      sem: 1,
      sec: "A",
      batch: "2024-2027",
      contact: "9876543219",
    },
  ];

  const students = [];
  for (const s of studentData) {
    const enrollCourses = getCourses(s.dept, s.sem);
    const created = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: hashedPassword,
        role: "STUDENT",
        student: {
          create: {
            rollNumber: s.roll,
            department: s.dept,
            semester: s.sem,
            section: s.sec,
            batch: s.batch,
            contactNumber: s.contact,
            enrolledCourses: {
              create: enrollCourses.map((course) => ({
                courseId: course.id,
              })),
            },
          },
        },
      },
      include: { student: true },
    });
    students.push(created.student);
  }
  console.log(`✅ ${students.length} students created & enrolled`);

  // ──────────────────────────────────────────────────────────
  // 7. ALLOCATE COURSES TO TEACHERS (BCA Sem 1 only for attendance)
  // ──────────────────────────────────────────────────────────
  const allocationData = [
    { teacherIdx: 0, courseCode: "BCA-101", dept: "BCA", sem: 1, sec: "A" }, // Dumbledore → C
    { teacherIdx: 1, courseCode: "BCA-102", dept: "BCA", sem: 1, sec: "A" }, // McGonagall → Web Dev
    { teacherIdx: 2, courseCode: "BCA-103", dept: "BCA", sem: 1, sec: "A" }, // Snape → DSA
    { teacherIdx: 2, courseCode: "BCA-104", dept: "BCA", sem: 1, sec: "A" }, // Snape → DBMS
    { teacherIdx: 3, courseCode: "BCA-105", dept: "BCA", sem: 1, sec: "A" }, // Flitwick → Digital Electronics
  ];

  const allocations = [];
  for (const a of allocationData) {
    const course = courses.find((c) => c.code === a.courseCode);
    allocations.push(
      await prisma.courseAllocation.create({
        data: {
          teacherId: teachers[a.teacherIdx].id,
          courseId: course.id,
          department: a.dept,
          semester: a.sem,
          section: a.sec,
        },
      }),
    );
  }
  console.log(`✅ ${allocations.length} course allocations created`);

  // ──────────────────────────────────────────────────────────
  // 8. CREATE TEACHER SCHEDULES
  // ──────────────────────────────────────────────────────────
  await prisma.teacherSchedule.createMany({
    data: [
      {
        teacherId: teachers[0].id,
        day: "Monday",
        slots: "1,2",
        courseAllocationId: allocations[0].id,
        room: "Lab 1",
        classType: "lab",
      },
      {
        teacherId: teachers[0].id,
        day: "Wednesday",
        slots: "3",
        courseAllocationId: allocations[0].id,
        room: "Room 101",
        classType: "class",
      },
      {
        teacherId: teachers[1].id,
        day: "Tuesday",
        slots: "3",
        courseAllocationId: allocations[1].id,
        room: "Room 102",
        classType: "class",
      },
      {
        teacherId: teachers[1].id,
        day: "Thursday",
        slots: "4,5",
        courseAllocationId: allocations[1].id,
        room: "Lab 2",
        classType: "lab",
      },
      {
        teacherId: teachers[2].id,
        day: "Wednesday",
        slots: "4,5",
        courseAllocationId: allocations[2].id,
        room: "Room 103",
        classType: "class",
      },
      {
        teacherId: teachers[2].id,
        day: "Thursday",
        slots: "1",
        courseAllocationId: allocations[3].id,
        room: "Room 104",
        classType: "class",
      },
      {
        teacherId: teachers[2].id,
        day: "Friday",
        slots: "2,3",
        courseAllocationId: allocations[3].id,
        room: "Lab 1",
        classType: "lab",
      },
      {
        teacherId: teachers[3].id,
        day: "Monday",
        slots: "4",
        courseAllocationId: allocations[4].id,
        room: "Room 105",
        classType: "class",
      },
      {
        teacherId: teachers[3].id,
        day: "Friday",
        slots: "1",
        courseAllocationId: allocations[4].id,
        room: "Room 105",
        classType: "class",
      },
    ],
  });
  console.log("✅ Teacher schedules created");

  // ──────────────────────────────────────────────────────────
  // 9. GENERATE ATTENDANCE DATA (Past 20 days)
  // ──────────────────────────────────────────────────────────
  console.log("Generating 20 days of attendance records...");
  const today = new Date();

  // Track stats per student per course for the cache table
  const statTracker = {}; // { `${studentId}-${courseId}`: { sessions: 0, attended: 0 } }

  for (let i = 0; i < 20; i++) {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    targetDate.setDate(today.getDate() - i);

    if (targetDate.getDay() === 0) continue; // Skip Sundays

    for (const alloc of allocations) {
      const session = await prisma.attendanceSession.create({
        data: {
          courseAllocationId: alloc.id,
          date: targetDate,
        },
      });

      const recordsToCreate = students.map((student, idx) => {
        let status = "PRESENT";
        const rand = Math.random();

        // Give each student a personality
        if (idx === 2 && rand > 0.5)
          status = "ABSENT"; // Ron — frequently absent (~50%)
        else if (idx === 0 && rand > 0.85)
          status = "LATE"; // Harry — occasionally late
        else if (idx === 5 && rand > 0.7)
          status = "LEAVE"; // Luna — takes leave often
        else if (idx === 7 && rand > 0.65)
          status = "ABSENT"; // Seamus — absent a lot (~35%)
        else if (rand > 0.92)
          status = "ABSENT"; // Random absences
        else if (rand > 0.88) status = "LEAVE"; // Random leaves

        // Track for stat cache
        const key = `${student.id}-${alloc.courseId}`;
        if (!statTracker[key])
          statTracker[key] = {
            studentId: student.id,
            courseId: alloc.courseId,
            sessions: 0,
            attended: 0,
          };
        statTracker[key].sessions++;
        if (status === "PRESENT" || status === "LATE")
          statTracker[key].attended++;

        return {
          sessionId: session.id,
          studentId: student.id,
          status: status,
        };
      });

      await prisma.attendanceRecord.createMany({ data: recordsToCreate });
    }
  }
  console.log("✅ Attendance records generated");

  // ──────────────────────────────────────────────────────────
  // 10. POPULATE StudentAttendanceStat CACHE TABLE
  // ──────────────────────────────────────────────────────────
  const statData = Object.values(statTracker).map((s) => ({
    studentId: s.studentId,
    courseId: s.courseId,
    totalSessions: s.sessions,
    totalAttended: s.attended,
  }));

  await prisma.studentAttendanceStat.createMany({ data: statData });
  console.log(`✅ ${statData.length} attendance stat cache entries created`);

  // ──────────────────────────────────────────────────────────
  // 11. CREATE LIBRARY RESOURCES
  // ──────────────────────────────────────────────────────────
  // Get some user IDs for contributors (teachers + admin + a student)
  const allTeacherUsers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true },
  });
  const allStudentUsers = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true },
  });

  const libraryData = [
    // BCA Resources
    {
      title: "C Programming - Complete Notes",
      subjectName: "Programming in C",
      department: "BCA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/abc123/view",
      description:
        "Comprehensive notes covering pointers, structures, file handling, and dynamic memory allocation.",
      contributorId: allTeacherUsers[0].id,
    },
    {
      title: "HTML & CSS Crash Course",
      subjectName: "Web Development",
      department: "BCA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/def456/view",
      description:
        "Beginner-friendly guide to HTML5 semantic elements and CSS3 flexbox/grid layouts.",
      contributorId: allTeacherUsers[1].id,
    },
    {
      title: "DSA Cheat Sheet (Arrays, Linked Lists, Trees)",
      subjectName: "Data Structures",
      department: "BCA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/ghi789/view",
      description:
        "Quick reference with time complexity analysis and code snippets in C.",
      contributorId: allStudentUsers[1].id,
    },
    {
      title: "SQL Queries Practice Set",
      subjectName: "Database Management",
      department: "BCA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/jkl012/view",
      description:
        "50+ practice problems covering JOINs, subqueries, GROUP BY, and HAVING clauses.",
      contributorId: allTeacherUsers[2].id,
    },
    {
      title: "Digital Electronics Gate-Level Notes",
      subjectName: "Digital Electronics",
      department: "BCA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/mno345/view",
      description:
        "Boolean algebra, K-maps, combinational circuits, and flip-flop designs.",
      contributorId: allTeacherUsers[3].id,
    },
    {
      title: "OOP Concepts with Java Examples",
      subjectName: "Object Oriented Programming",
      department: "BCA",
      semester: 2,
      driveLink: "https://drive.google.com/file/d/pqr678/view",
      description:
        "Covers inheritance, polymorphism, abstraction, and encapsulation with real-world Java examples.",
      contributorId: allTeacherUsers[0].id,
    },
    {
      title: "Computer Networks - OSI Model Explained",
      subjectName: "Computer Networks",
      department: "BCA",
      semester: 2,
      driveLink: "https://drive.google.com/file/d/stu901/view",
      description:
        "Layer-by-layer breakdown of the OSI model with diagrams and protocol comparisons.",
      contributorId: allStudentUsers[0].id,
    },
    {
      title: "OS Process Scheduling Algorithms",
      subjectName: "Operating Systems",
      department: "BCA",
      semester: 2,
      driveLink: "https://drive.google.com/file/d/vwx234/view",
      description:
        "FCFS, SJF, Round Robin, and Priority scheduling with Gantt chart examples.",
      contributorId: allTeacherUsers[3].id,
    },
    // BBA Resources
    {
      title: "Management Theories Summary",
      subjectName: "Principles of Management",
      department: "BBA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/bba101/view",
      description:
        "Classical, behavioral, and modern management theories with case studies.",
      contributorId: allTeacherUsers[4].id,
    },
    {
      title: "Financial Accounting Formulas",
      subjectName: "Financial Accounting",
      department: "BBA",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/bba102/view",
      description:
        "All essential formulas for balance sheets, P&L statements, and ratio analysis.",
      contributorId: allTeacherUsers[5].id,
    },
    // BCOM Resources
    {
      title: "Cost Accounting Problem Sets",
      subjectName: "Cost Accounting",
      department: "BCOM",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/bcom101/view",
      description:
        "Practice problems on process costing, job costing, and variance analysis.",
      contributorId: allTeacherUsers[6].id,
    },
    {
      title: "Indian Business Law Quick Notes",
      subjectName: "Business Law",
      department: "BCOM",
      semester: 1,
      driveLink: "https://drive.google.com/file/d/bcom102/view",
      description:
        "Covers Indian Contract Act, Sale of Goods Act, and Partnership Act essentials.",
      contributorId: allTeacherUsers[6].id,
    },
  ];

  for (const lr of libraryData) {
    await prisma.libraryResource.create({ data: lr });
  }
  console.log(`✅ ${libraryData.length} library resources created`);

  // ──────────────────────────────────────────────────────────
  // DONE
  // ──────────────────────────────────────────────────────────
  console.log("\n🎉 Database seeded successfully!");
  console.log("──────────────────────────────────────────");
  console.log(`   Departments:      ${departments.length}`);
  console.log(
    `   Users:            ${1 + teachers.length + students.length} (1 admin + ${teachers.length} teachers + ${students.length} students)`,
  );
  console.log(`   Courses:          ${courses.length}`);
  console.log(`   Allocations:      ${allocations.length}`);
  console.log(`   Stat Cache:       ${statData.length} entries`);
  console.log(`   Library Resources: ${libraryData.length}`);
  console.log("──────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
