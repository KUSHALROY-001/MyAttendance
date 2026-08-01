/**
 * Pure calculation and formatting helpers for the Student feature (no React, no side effects)
 */

export const buildAttendanceByDateMap = (attendanceRecords) => {
  const map = {};
  if (!Array.isArray(attendanceRecords)) return map;

  attendanceRecords.forEach((record) => {
    const d = new Date(record.date);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    (map[key] ??= []).push(record);
  });

  return map;
};

export const calculateStudentSummaryStats = (summaries = []) => {
  if (!Array.isArray(summaries)) {
    return {
      lowAttendanceSubjects: [],
      overallAttended: 0,
      overallTotal: 0,
      overallPercentage: 0,
    };
  }

  const lowAttendanceSubjects = summaries.filter(
    (subject) => subject.percentage < 75,
  );
  const overallAttended = summaries.reduce(
    (acc, subject) => acc + (subject.attendedClasses || 0),
    0,
  );
  const overallTotal = summaries.reduce(
    (acc, subject) => acc + (subject.totalClasses || 0),
    0,
  );
  const overallPercentage =
    overallTotal > 0 ? (overallAttended / overallTotal) * 100 : 0;

  return {
    lowAttendanceSubjects,
    overallAttended,
    overallTotal,
    overallPercentage,
  };
};

export const formatStudentHeaderInfo = (stuData) => {
  const safeUserName = stuData?.user?.name?.split(" ")[0] ?? "Student";
  const enrollmentNo = stuData?.rollNumber ?? "-";
  const department = stuData?.department ?? "-";
  const semester = stuData?.batch ?? "-";
  const classRoutineSubtitle = `${stuData?.department || "-"} • Semester ${
    stuData?.semester || "-"
  } • Section ${stuData?.section || "-"}`;

  return {
    safeUserName,
    enrollmentNo,
    department,
    semester,
    classRoutineSubtitle,
  };
};

export const flattenAndSortAttendanceRecords = (recordsMap = {}) => {
  const allRecords = [];
  Object.keys(recordsMap).forEach((dateKey) => {
    const dayRecords = recordsMap[dateKey];
    if (Array.isArray(dayRecords)) {
      dayRecords.forEach((rec) => {
        allRecords.push({ ...rec, displayDate: dateKey });
      });
    }
  });

  allRecords.sort(
    (a, b) =>
      new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime(),
  );

  return allRecords;
};
