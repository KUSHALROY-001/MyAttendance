const { prisma } = require("../../utils/prisma.js");

const getWhereClause = (query, instituteId) => {
  const department = query.department || query.dept || "BCA";
  const semester = query.semester || query.sem;
  const section = query.section || query.sec;

  const whereClause = { instituteId, department: department };

  if (semester) {
    whereClause.semester = Number(semester);
  }
  if (section) {
    whereClause.section = section;
  }
  return whereClause;
};

const syncStudentsForCourseAllocation = async (
  tx,
  { instituteId, courseId, department, semester, section },
) => {
  const normalizedSemester = Number(semester);
  const students = await tx.student.findMany({
    where: {
      instituteId,
      department,
      semester: normalizedSemester,
      section,
    },
    select: {
      id: true,
    },
  });

  if (!students.length) {
    return;
  }

  const enrollmentRows = students.map((student) => ({
    studentId: student.id,
    courseId: Number(courseId),
  }));

  await tx.studentCourse.createMany({
    data: enrollmentRows,
    skipDuplicates: true,
  });

  await tx.studentAttendanceStat.createMany({
    data: enrollmentRows.map((row) => ({
      ...row,
      totalSessions: 0,
      totalAttended: 0,
    })),
    skipDuplicates: true,
  });
};

const syncExistingStudentsForCourse = async (
  tx,
  { instituteId, courseId, department, semester },
) => {
  const normalizedSemester = Number(semester);
  const students = await tx.student.findMany({
    where: {
      instituteId,
      department,
      semester: normalizedSemester,
    },
    select: {
      id: true,
    },
  });

  if (!students.length) {
    return;
  }

  const enrollmentRows = students.map((student) => ({
    studentId: student.id,
    courseId: Number(courseId),
  }));

  await tx.studentCourse.createMany({
    data: enrollmentRows,
    skipDuplicates: true,
  });

  await tx.studentAttendanceStat.createMany({
    data: enrollmentRows.map((row) => ({
      ...row,
      totalSessions: 0,
      totalAttended: 0,
    })),
    skipDuplicates: true,
  });
};

module.exports = {
  getWhereClause,
  syncStudentsForCourseAllocation,
  syncExistingStudentsForCourse,
};
