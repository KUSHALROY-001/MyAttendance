export const getInitialForm = (profile) => ({
  name: profile?.name || "",
  email: profile?.email || "",
  rollNumber: profile?.student?.rollNumber || "",
  department:
    profile?.student?.department || profile?.teacher?.department || "",
  semester: profile?.student?.semester?.toString() || "",
  section: profile?.student?.section || "",
  batch: profile?.student?.batch || "",
  contactNumber:
    profile?.student?.contactNumber || profile?.teacher?.contactNumber || "",
  employeeId: profile?.teacher?.employeeId || "",
  designation: profile?.teacher?.designation || "",
});

export const resolveAvailableSemesters = (currentDeptObj) => {
  if (!currentDeptObj || !currentDeptObj.semesterDetails) return [];
  return currentDeptObj.semesterDetails.map((detail) => detail.semester);
};

export const resolveAvailableSections = (currentSemObj) => {
  if (!currentSemObj || !currentSemObj.sections) return [];
  return currentSemObj.sections;
};

export const formatProfileUpdatePayload = (formData, role) => {
  return {
    ...formData,
    semester: role === "STUDENT" ? Number(formData.semester || 0) : undefined,
  };
};
