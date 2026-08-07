/**
 * Pure calculation and formatting helpers for the Teacher feature (no React, no side effects)
 */

export const cleanTeacherName = (rawName) => {
  if (!rawName) return "Teacher";
  return String(rawName).replace(/^Dr\.\s*/i, "").trim() || "Teacher";
};

export const transformTeacherAllocations = (allocations = []) => {
  if (!Array.isArray(allocations)) return [];

  return allocations.map((alloc) => ({
    id: alloc.id,
    allocationId: alloc.id,
    name: alloc.course?.name || "Unknown Course",
    code: alloc.course?.code,
    department: alloc.department,
    semester: `Sem ${alloc.semester}`,
    section: alloc.section,
  }));
};

export const formatTimeLabel = (timeValue) => {
  if (!timeValue) return "Time TBA";

  const [hoursText, minutesText] = String(timeValue).split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return String(timeValue);
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;

  return `${normalizedHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

export const calculateLiveAttendanceStats = (attendanceMap = {}, totalStudentsCount = 0) => {
  const values = Object.values(attendanceMap);
  const present = values.filter((val) => val === "Present").length;
  const absent = values.filter((val) => val === "Absent").length;
  const late = values.filter((val) => val === "Late").length;

  return {
    total: totalStudentsCount,
    present,
    absent,
    late,
  };
};
