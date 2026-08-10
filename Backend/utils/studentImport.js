const XLSX = require("xlsx");

const REQUIRED_COLUMNS = [
  "name",
  "email",
  "rollNumber",
  "enrollmentNumber",
  "department",
  "semester",
  "batch",
];

const MAX_ROWS_PER_IMPORT = 500;

/**
 * Parses an uploaded .xlsx or .csv buffer into an array of plain row objects
 * keyed by header name. Works for both formats via the same SheetJS API.
 */
function parseSpreadsheet(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = workbook.Sheets[firstSheetName];
  // defval: "" so a blank cell comes through as "" rather than being
  // omitted from the row object entirely — the validator below needs to
  // tell "column present but empty" apart from "row just happens to be
  // missing that key", and sheet_to_json would otherwise drop empty cells.
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

/**
 * Validates a single row's shape (required fields present, semester is a
 * valid integer, email looks like an email). Does NOT check for duplicates
 * against other rows or against the database — that needs the full row set
 * and a database round trip, so it happens one level up (see
 * adminStudents.controller.js's previewStudentImport).
 */
function validateRowShape(row, rowNumber) {
  const errors = [];

  for (const col of REQUIRED_COLUMNS) {
    if (!String(row[col] ?? "").trim()) {
      errors.push(`Missing ${col}`);
    }
  }

  if (String(row.semester ?? "").trim()) {
    const semester = Number(row.semester);
    if (!Number.isInteger(semester) || semester < 1) {
      errors.push("semester must be a positive whole number");
    }
  }

  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email).trim())) {
    errors.push("email doesn't look valid");
  }

  return { rowNumber, errors, isValid: errors.length === 0 };
}

/**
 * Builds a downloadable template workbook with the expected headers and one
 * example row, so admins know exactly which column names to use.
 */
function buildTemplateWorkbook() {
  const exampleRow = {
    name: "Harry Potter",
    email: "harry.potter@example.edu",
    rollNumber: "BCA-101",
    enrollmentNumber: "ENR-2024-101",
    department: "BCA",
    semester: 1,
    section: "A",
    batch: "2024-2028",
    contactNumber: "9999999999",
  };
  const worksheet = XLSX.utils.json_to_sheet([exampleRow], {
    header: [...REQUIRED_COLUMNS.slice(0, 5), "semester", "section", "batch", "contactNumber"],
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

module.exports = {
  REQUIRED_COLUMNS,
  MAX_ROWS_PER_IMPORT,
  parseSpreadsheet,
  validateRowShape,
  buildTemplateWorkbook,
};
