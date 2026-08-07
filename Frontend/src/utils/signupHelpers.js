import { GraduationCap, ShieldCheck } from "lucide-react";

export const accessCards = [
  {
    title: "Student Access",
    description:
      "Create your student account with your academic details so your courses, class routine, and attendance tracking are connected from the start.",
    icon: GraduationCap,
  },
  {
    title: "Admin Access",
    description:
      "Admin access is restricted to institution-authorized staff who manage users, courses, schedules, and reports.",
    icon: ShieldCheck,
  },
];

export const resolveAvailableSemesters = (currentDeptObj) => {
  if (!currentDeptObj || !currentDeptObj.semesterDetails) return [];
  return currentDeptObj.semesterDetails.map((detail) => detail.semester);
};

export const resolveAvailableSections = (currentSemObj) => {
  if (!currentSemObj || !currentSemObj.sections) return [];
  return currentSemObj.sections.map((sec) =>
    typeof sec === "object" && sec !== null ? sec.name || sec.value || String(sec) : String(sec),
  );
};

export const buildSignUpPayload = (formData, selectedDept, selectedSem, selectedSec) => {
  return {
    ...formData,
    department: selectedDept || formData.department,
    semester: Number(selectedSem || formData.semester),
    section: selectedSec || formData.section,
  };
};
