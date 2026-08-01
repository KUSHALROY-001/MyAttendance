/**
 * Pure admin filter and option calculation helpers (no React, no side effects)
 */

export const getDepartmentSemesters = (departments, selectedDeptCode) => {
  if (!selectedDeptCode || !Array.isArray(departments)) return [];
  const currentDept = departments.find((d) => d.code === selectedDeptCode);
  return currentDept?.semesterDetails?.map((s) => s.semester) || [];
};

export const getSemesterSections = (departments, selectedDeptCode, selectedSem) => {
  if (!selectedDeptCode || !selectedSem || !Array.isArray(departments)) return [];
  const currentDept = departments.find((d) => d.code === selectedDeptCode);
  const semDetail = currentDept?.semesterDetails?.find(
    (s) => String(s.semester) === String(selectedSem),
  );
  return semDetail?.sections || [];
};

export const filterSessionsBySearch = (
  sessions,
  searchTerm = "",
  courseFilter = "",
  teacherFilter = "",
) => {
  if (!Array.isArray(sessions)) return [];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return sessions.filter((session) => {
    const matchesSearch =
      !normalizedSearch ||
      session.course?.toLowerCase().includes(normalizedSearch) ||
      session.teacher?.toLowerCase().includes(normalizedSearch) ||
      session.courseCode?.toLowerCase().includes(normalizedSearch);

    const matchesCourse = courseFilter ? session.course === courseFilter : true;
    const matchesTeacher = teacherFilter ? session.teacher === teacherFilter : true;

    return matchesSearch && matchesCourse && matchesTeacher;
  });
};

export const filterDefaultersBySearch = (
  defaulters,
  searchTerm = "",
  courseFilter = "",
  deptFilter = "",
) => {
  if (!Array.isArray(defaulters)) return [];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return defaulters.filter((defaulter) => {
    const matchesSearch =
      !normalizedSearch ||
      defaulter.name?.toLowerCase().includes(normalizedSearch) ||
      defaulter.rollNumber?.toLowerCase().includes(normalizedSearch) ||
      defaulter.course?.toLowerCase().includes(normalizedSearch);

    const matchesCourse = courseFilter ? defaulter.course === courseFilter : true;
    const matchesDept = deptFilter ? defaulter.department === deptFilter : true;

    return matchesSearch && matchesCourse && matchesDept;
  });
};

export const getUniqueOptions = (items, key) => {
  if (!Array.isArray(items) || !key) return [];
  return [...new Set(items.map((item) => item[key]))].filter(Boolean);
};
