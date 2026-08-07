/**
 * Pure academic options helpers and utility functions (no React, no side effects)
 */

export const INPUT_CLASS =
  "block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800/60 dark:disabled:text-slate-400";

export const LABEL_CLASS =
  "block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300";

export const INITIAL_ACADEMIC_FORM = {
  name: "",
  code: "",
  semesterDetails: [
    { semester: 1, sections: ["A", "B", "C"] },
    { semester: 2, sections: ["A", "B", "C"] },
  ],
};

export const normalizeSectionName = (sec) => {
  if (!sec) return "";
  if (typeof sec === "string") return sec.trim().toUpperCase();
  if (typeof sec === "object" && sec !== null)
    return String(sec.name || "").trim().toUpperCase();
  return String(sec).trim().toUpperCase();
};

export const generateNextSectionLetter = (currentSections = []) => {
  if (!Array.isArray(currentSections) || currentSections.length === 0) {
    return "A";
  }
  const normalized = currentSections.map(normalizeSectionName).filter(Boolean);
  const lastSec = normalized[normalized.length - 1];
  if (lastSec && lastSec.length === 1 && lastSec >= "A" && lastSec < "Z") {
    return String.fromCharCode(lastSec.charCodeAt(0) + 1);
  }
  return String.fromCharCode(65 + normalized.length); // 65 is 'A'
};

export const reindexSemesters = (semesterDetails = []) => {
  if (!Array.isArray(semesterDetails)) return [];
  return semesterDetails.map((s, i) => ({
    ...s,
    semester: i + 1,
  }));
};

export const validateDepartmentForm = (formData) => {
  if (!formData?.name?.trim() || !formData?.code?.trim()) {
    return {
      isValid: false,
      message: "Department name and code are required.",
    };
  }
  return { isValid: true, message: "" };
};

export const sanitizeDepartmentPayload = (formData) => {
  return {
    name: formData.name.trim(),
    code: formData.code.trim().toUpperCase(),
    semesterDetails: Array.isArray(formData.semesterDetails)
      ? formData.semesterDetails.map((sem) => ({
          ...sem,
          sections: (sem.sections || []).map(normalizeSectionName).filter(Boolean),
        }))
      : [],
  };
};

