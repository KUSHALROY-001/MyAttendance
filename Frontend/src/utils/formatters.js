/**
 * Pure formatting helper functions (no React, no side effects)
 */

export const formatDateMedium = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTimeShort = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const calculateAttendancePercent = (attended, total) => {
  const totalNum = Number(total) || 0;
  const attendedNum = Number(attended) || 0;
  if (totalNum <= 0) return 0;
  return Math.round((attendedNum / totalNum) * 100);
};

export const formatRoleLabel = (role) => {
  if (!role) return "N/A";
  return String(role).toUpperCase();
};

export const formatStatusTone = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "PRESENT" || normalized === "ACTIVE") return "success";
  if (normalized === "ABSENT" || normalized === "INACTIVE" || normalized === "DEFAULTER")
    return "danger";
  if (normalized === "LATE") return "warning";
  return "neutral";
};
