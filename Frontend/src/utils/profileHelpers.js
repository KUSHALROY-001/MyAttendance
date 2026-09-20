export const getInitialForm = (profile) => ({
  name: profile?.name || "",
  email: profile?.email || "",
  rollNumber: profile?.student?.rollNumber || "",
  enrollmentNumber: profile?.student?.enrollmentNumber || "",
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
  return currentSemObj.sections.map((sec) =>
    typeof sec === "object" && sec !== null
      ? sec.name || sec.value || String(sec)
      : String(sec),
  );
};

export const formatProfileUpdatePayload = (formData, role) => {
  // Students and teachers may only change their name and contact number.
  if (role === "STUDENT" || role === "TEACHER") {
    return {
      name: formData.name,
      contactNumber: formData.contactNumber,
    };
  }

  return {
    ...formData,
    semester: role === "STUDENT" ? Number(formData.semester || 0) : undefined,
  };
};
