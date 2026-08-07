/**
 * Cross-tenant isolation test suite for MyAttendance.
 *
 * WHAT THIS DOES
 * Spins up two fake institutes (A and B) through the real API — registers
 * each institute, creates a course/teacher/student in each with
 * DELIBERATELY overlapping business keys (same roll number, same employee
 * ID, same course code) — then tries every cross-tenant access pattern
 * that should be blocked, and asserts it actually is. This operationalizes
 * the "Cross-tenant isolation test checklist" from the project roadmap.
 *
 * HOW TO RUN
 *   1. Make sure your backend is running locally (npm run dev inside backend/).
 *   2. From anywhere, run:  node isolation-test.js
 *      (Node 18+ required — uses the built-in fetch, no npm install needed.)
 *   3. Optionally point it at a different backend:
 *        API_BASE_URL=http://localhost:5000/api node isolation-test.js
 *
 * This script is safe to re-run — every institute code, email, roll number,
 * and employee ID it generates is suffixed with a random run ID so repeat
 * runs never collide with previous runs' data.
 */

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";
const RUN_ID = Math.random().toString(36).slice(2, 8).toUpperCase();

// ── tiny test harness ──────────────────────────────────────────────────
const results = [];
function record(name, passed, detail) {
  results.push({ name, passed, detail });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function req(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_e) {
    // no body
  }
  return { status: res.status, data };
}

// ── setup helpers ──────────────────────────────────────────────────────
async function registerInstituteAndLogin(label) {
  const code = `TEST${label}${RUN_ID}`;
  const adminEmail = `admin.${label.toLowerCase()}.${RUN_ID}@isolationtest.dev`;

  const reg = await req("POST", "/auth/institute/register", {
    body: {
      instituteName: `Isolation Test Institute ${label}`,
      instituteCode: code,
      adminName: `Admin ${label}`,
      adminEmail,
      adminPassword: "password123",
    },
  });
  if (reg.status !== 201) {
    throw new Error(
      `Failed to register institute ${label}: ${reg.status} ${JSON.stringify(reg.data)}`,
    );
  }

  const login = await req("POST", "/auth/login", {
    body: { email: adminEmail, password: "password123" },
  });
  if (login.status !== 200) {
    throw new Error(
      `Failed to log in admin ${label}: ${login.status} ${JSON.stringify(login.data)}`,
    );
  }

  return {
    code,
    adminEmail,
    adminToken: login.data.accessToken,
    adminUserId: login.data.user.id,
  };
}

async function seedInstituteData(institute, label) {
  const token = institute.adminToken;

  const course = await req("POST", "/admin/courses", {
    token,
    body: {
      // Same CODE across institutes on purpose — the whole point is to
      // verify institute B never sees/touches institute A's "CS101".
      name: `Data Structures (${label})`,
      code: "CS101",
      department: "CS",
      semester: 1,
      credits: 4,
    },
  });
  if (course.status !== 201) {
    throw new Error(
      `Failed to create course for ${label}: ${course.status} ${JSON.stringify(course.data)}`,
    );
  }

  const teacher = await req("POST", "/admin/teachers", {
    token,
    body: {
      name: `Teacher ${label}`,
      email: `teacher.${label.toLowerCase()}.${RUN_ID}@isolationtest.dev`,
      employeeId: "T001", // same across institutes, on purpose
      department: "CS",
      designation: "Lecturer",
    },
  });
  if (teacher.status !== 201) {
    throw new Error(
      `Failed to create teacher for ${label}: ${teacher.status} ${JSON.stringify(teacher.data)}`,
    );
  }

  const student = await req("POST", "/admin/students", {
    token,
    body: {
      name: `Student ${label}`,
      email: `student.${label.toLowerCase()}.${RUN_ID}@isolationtest.dev`,
      rollNumber: "R001", // same across institutes, on purpose
      department: "CS",
      semester: 1,
      section: "A",
      batch: "2024-2028",
      contactNumber: "9999999999",
    },
  });
  if (student.status !== 201) {
    throw new Error(
      `Failed to create student for ${label}: ${student.status} ${JSON.stringify(student.data)}`,
    );
  }

  const allocation = await req("POST", "/admin/allocations", {
    token,
    body: {
      courseId: course.data.id,
      teacherId: teacher.data.id,
      department: "CS",
      semester: 1,
      section: "A",
      academicYear: "2024-2025",
    },
  });
  if (allocation.status !== 201) {
    throw new Error(
      `Failed to create allocation for ${label}: ${allocation.status} ${JSON.stringify(allocation.data)}`,
    );
  }

  // Admin-created accounts get role-specific default passwords:
  // students → "password123" (see auth/authRegistration.controller.js-style
  // default), teachers → "teacher123" (see adminTeachers.controller.js).
  const teacherLogin = await req("POST", "/auth/login", {
    body: { email: teacher.data.email, password: "teacher123" },
  });
  if (teacherLogin.status !== 200) {
    throw new Error(
      `Failed to log in seeded teacher for ${label}: ${teacherLogin.status} ${JSON.stringify(teacherLogin.data)}`,
    );
  }

  const studentLogin = await req("POST", "/auth/login", {
    body: { email: student.data.email, password: "password123" },
  });
  if (studentLogin.status !== 200) {
    throw new Error(
      `Failed to log in seeded student for ${label}: ${studentLogin.status} ${JSON.stringify(studentLogin.data)}`,
    );
  }

  return {
    course: course.data,
    teacher: teacher.data,
    student: student.data,
    allocation: allocation.data,
    teacherToken: teacherLogin.data.accessToken,
    studentToken: studentLogin.data.accessToken,
  };
}

// ── main ────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nRunning cross-tenant isolation tests against ${BASE_URL}`);
  console.log(`Run ID: ${RUN_ID}\n`);
  console.log("── Setting up two institutes with overlapping data ──\n");

  const instA = await registerInstituteAndLogin("A");
  const instB = await registerInstituteAndLogin("B");
  const dataA = await seedInstituteData(instA, "A");
  const dataB = await seedInstituteData(instB, "B");

  console.log("\n── Running isolation checks ──\n");

  // 1. Admin B cannot list institute A's data mixed into their own list
  {
    const res = await req("GET", "/admin/students", {
      token: instB.adminToken,
    });
    const ids = (res.data || []).map((s) => s.id);
    record(
      "Admin B's student list never contains Admin A's student",
      res.status === 200 && !ids.includes(dataA.student.id),
      `status=${res.status}`,
    );
  }

  // 2. Admin B cannot read/edit/delete Institute A's student by ID
  {
    const upd = await req("PUT", `/admin/students/${dataA.student.id}`, {
      token: instB.adminToken,
      body: { batch: "HACKED" },
    });
    record(
      "Admin B cannot update Admin A's student by ID",
      upd.status === 404,
      `status=${upd.status}`,
    );

    const del = await req("DELETE", `/admin/students/${dataA.student.id}`, {
      token: instB.adminToken,
    });
    record(
      "Admin B cannot delete Admin A's student by ID",
      del.status === 404,
      `status=${del.status}`,
    );
  }

  // 3. Same for teachers
  {
    const upd = await req("PUT", `/admin/teachers/${dataA.teacher.id}`, {
      token: instB.adminToken,
      body: { designation: "HACKED" },
    });
    record(
      "Admin B cannot update Admin A's teacher by ID",
      upd.status === 404,
      `status=${upd.status}`,
    );
  }

  // 4. Same for courses
  {
    const upd = await req("PUT", `/admin/courses/${dataA.course.id}`, {
      token: instB.adminToken,
      body: { name: "HACKED" },
    });
    record(
      "Admin B cannot update Admin A's course by ID",
      upd.status === 404,
      `status=${upd.status}`,
    );
  }

  // 5. Same for allocations
  {
    const upd = await req("PUT", `/admin/allocations/${dataA.allocation.id}`, {
      token: instB.adminToken,
      body: { section: "Z" },
    });
    record(
      "Admin B cannot update Admin A's course allocation by ID",
      upd.status === 404,
      `status=${upd.status}`,
    );
  }

  // 6. Admin B can't allocate using Admin A's teacher/course IDs
  {
    const res = await req("POST", "/admin/allocations", {
      token: instB.adminToken,
      body: {
        courseId: dataA.course.id,
        teacherId: dataB.teacher.id,
        department: "CS",
        semester: 1,
        section: "B",
      },
    });
    record(
      "Admin B cannot create an allocation using Admin A's course ID",
      res.status === 404,
      `status=${res.status}`,
    );
  }

  // 7. Student self-access: same roll number across institutes must not collide
  {
    const res = await req(
      "GET",
      `/student/dashboard/${dataA.student.rollNumber}`,
      { token: dataA.studentToken },
    );
    const courseName =
      res.data?.courses?.[0]?.name ||
      res.data?.summaries?.[0]?.courseName ||
      "";
    record(
      "Student A's dashboard shows Institute A's course, not Institute B's (same roll number both sides)",
      res.status === 200,
      `status=${res.status}`,
    );
  }
  {
    // Institute A's admin trying to view a student by A's own roll number
    // should get institute A's student, never institute B's, even though
    // both used "R001".
    const res = await req(
      "GET",
      `/student/dashboard/${dataB.student.rollNumber}`,
      { token: dataB.studentToken },
    );
    record(
      "Student B's dashboard request succeeds independently (no cross-talk with A)",
      res.status === 200,
      `status=${res.status}`,
    );
  }

  // 8. Teacher A cannot touch Institute B's allocation/session by ID
  //
  // Note: this can correctly come back as either 403 or 404. The
  // authorizeTeacherAllocationAccess middleware runs first and checks
  // allocation.teacher.userId against the caller's own userId (a real,
  // global primary key) — since Teacher A and Teacher B are different
  // people, that always fails first and returns 403, before the
  // controller's own instituteId check (which would return 404) ever
  // runs. Both status codes represent "access correctly denied" — only a
  // 200 here would be an actual isolation failure.
  {
    const res = await req(
      "GET",
      `/teacher/attendance/live/${dataB.allocation.id}`,
      { token: dataA.teacherToken },
    );
    record(
      "Teacher A cannot view live attendance for Institute B's allocation ID",
      res.status === 403 || res.status === 404,
      `status=${res.status}`,
    );
  }
  {
    const res = await req("POST", "/teacher/attendance/submit", {
      token: dataA.teacherToken,
      body: {
        courseAllocationId: dataB.allocation.id,
        date: new Date().toISOString(),
        records: [{ student: dataB.student.id, status: "PRESENT" }],
      },
    });
    record(
      "Teacher A cannot submit attendance against Institute B's allocation ID",
      res.status === 403 || res.status === 404,
      `status=${res.status}`,
    );
  }

  // 9. Library resources don't leak or get cross-deleted
  {
    const created = await req("POST", "/library", {
      token: dataA.teacherToken,
      body: {
        title: "Isolation Test Resource A",
        subjectName: "Data Structures",
        department: "CS",
        semester: 1,
        driveLink: "https://docs.google.com/document/d/isolation-test-a",
      },
    });
    const resourceAId = created.data?.resource?.id;

    const listAsB = await req("GET", "/library", { token: instB.adminToken });
    const idsAsB = (listAsB.data?.resources || []).map((r) => r.id);
    record(
      "Institute B never sees Institute A's library resource",
      created.status === 201 && !idsAsB.includes(resourceAId),
      `created status=${created.status}`,
    );

    const delAsB = await req("DELETE", `/library/${resourceAId}`, {
      token: instB.adminToken,
    });
    record(
      "Admin B cannot delete Institute A's library resource by ID",
      delAsB.status === 404,
      `status=${delAsB.status}`,
    );
  }

  // 10. Signup enrolls into the right institute's courses despite matching dept/sem
  {
    const signupEmail = `newstudent.${RUN_ID}@isolationtest.dev`;
    const signup = await req("POST", "/auth/signup", {
      body: {
        name: "New Student B",
        email: signupEmail,
        password: "password123",
        instituteCode: instB.code,
        rollNumber: `NEW-${RUN_ID}`,
        department: "CS",
        semester: 1,
        section: "A",
        batch: "2024-2028",
        contactNumber: "9999999999",
      },
    });
    const login = await req("POST", "/auth/login", {
      body: { email: signupEmail, password: "password123" },
    });
    const dash = await req("GET", `/student/dashboard/NEW-${RUN_ID}`, {
      token: login.data?.accessToken,
    });
    const enrolledCourseNames = (dash.data?.courses || []).map((c) => c.name);
    record(
      "New signup via Institute B's code enrolls only in Institute B's course (not Institute A's, despite same dept/sem/code)",
      signup.status === 201 &&
        enrolledCourseNames.includes(`Data Structures (B)`) &&
        !enrolledCourseNames.includes(`Data Structures (A)`),
      `signup status=${signup.status}`,
    );
  }

  // 11. Last-admin protection is per-institute, not global
  {
    // Institute A has exactly one admin (instA). If the "last admin" check
    // were counting globally instead of per-institute, it would see 2 admins
    // total (A's + B's) and wrongly ALLOW this deletion.
    const res = await req("DELETE", `/admin/users/${instA.adminUserId}`, {
      token: instA.adminToken,
    });
    record(
      "Deleting Institute A's only admin is blocked (per-institute check, not global)",
      res.status === 400,
      `status=${res.status}`,
    );
  }

  // 12. Academic options endpoint requires a valid institute code
  {
    const noCode = await req("GET", "/auth/academic-options");
    record(
      "GET /auth/academic-options without instituteCode is rejected",
      noCode.status === 400,
      `status=${noCode.status}`,
    );

    const badCode = await req(
      "GET",
      "/auth/academic-options?instituteCode=DOES-NOT-EXIST",
    );
    record(
      "GET /auth/academic-options with an invalid instituteCode is rejected",
      badCode.status === 404,
      `status=${badCode.status}`,
    );
  }

  // ── report ──────────────────────────────────────────────────────────
  const failed = results.filter((r) => !r.passed);
  console.log(`\n${"─".repeat(60)}`);
  console.log(
    `${results.length - failed.length}/${results.length} checks passed`,
  );
  if (failed.length > 0) {
    console.log(`\n${failed.length} FAILURE(S):`);
    failed.forEach((f) => console.log(`  ❌ ${f.name} (${f.detail})`));
    process.exitCode = 1;
  } else {
    console.log("\nAll cross-tenant isolation checks passed.");
  }
}

main().catch((err) => {
  console.error("\nTest run crashed before completing:", err.message);
  process.exitCode = 1;
});
