// Mirrors the backend's validation rule in authRegistration.controller.js
export const INSTITUTE_CODE_PATTERN = /^[A-Z0-9-]{3,20}$/;

export const normalizeInstituteCode = (raw) =>
  String(raw || "")
    .trim()
    .toUpperCase();

export const isValidInstituteCodeFormat = (raw) =>
  INSTITUTE_CODE_PATTERN.test(normalizeInstituteCode(raw));
