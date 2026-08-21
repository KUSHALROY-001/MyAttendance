const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  requirePasswordChange,
} = require("../middlewares/requirePasswordChange.middleware");
const { authorizeRoles } = require("../middlewares/authorize.middleware");
const {
  getAdminDashboard,
  getDepartment,
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  downloadImportTemplate,
  previewStudentImport,
  confirmStudentImport,
  readTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  readCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  readCourseAllocation,
  createCourseAllocation,
  updateCourseAllocation,
  deleteCourseAllocation,
  readAttendanceReportSessions,
  readAttendanceReportSessionDetail,
  readAttendanceReportDefaulters,
  readClassTimetable,
  addClassPeriod,
  updateClassPeriod,
  deleteClassPeriod,
  createClassScheduleEntry,
  deleteClassScheduleEntry,
  readUser,
  updateUserRole,
  deleteUser,
  getInstituteSettings,
  updateInstituteSettings,
  readAcademicOptions,
  createAcademicOption,
  updateAcademicOption,
  deleteAcademicOption,
  readPendingStudents,
  approvePendingStudent,
  rejectPendingStudent,
  // Record-detail endpoints (audit trail + click-to-view-details feature)
  getStudentDetail,
  getTeacherDetail,
  getCourseDetail,
  getAllocationDetail,
  getScheduleEntryDetail,
  getUserDetailFull,
  getDepartmentDetail,
  // Semester promotion
  previewPromotion,
  runPromotion,
  listPromotionBatches,
  getPromotionBatchDetail,
} = require("../controllers/admin.controller");

router.use(
  authenticate,
  requirePasswordChange,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
);

const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — well above what 500 rows of plain data needs
});

router.get("/dashboard", getAdminDashboard);
router.get("/departments", getDepartment);

// Academic options (Departments, Semesters, Sections)
router.get("/academic-options", readAcademicOptions);
router.post("/academic-options", createAcademicOption);
router.put("/academic-options/:id", updateAcademicOption);
router.delete("/academic-options/:id", deleteAcademicOption);
// Detail view (audit trail + granular semester/section audit) — placed
// under this namespace (not /departments/:id/detail) because /departments
// is a separate, pre-existing lightweight lookup endpoint (see
// adminDashboard.controller.js's getDepartment) backing filter dropdowns
// elsewhere — this is the actual CRUD resource for DepartmentInfo.
router.get("/academic-options/:id/detail", getDepartmentDetail);

// Institute settings
router.get("/institute", getInstituteSettings);
router.patch("/institute", updateInstituteSettings);

// Student CRUD
router.get("/students", readStudent);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
router.get("/students/:id/detail", getStudentDetail);

// Student bulk import (Excel/CSV)
router.get("/students/import/template", downloadImportTemplate);
router.post(
  "/students/import/preview",
  importUpload.single("file"),
  previewStudentImport,
);
router.post("/students/import/confirm", confirmStudentImport);

// Teacher CRUD
router.get("/teachers", readTeacher);
router.post("/teachers", createTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);
router.get("/teachers/:id/detail", getTeacherDetail);

// Course CRUD
router.get("/courses", readCourse);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses/:id/detail", getCourseDetail);

// Course Allocation CRUD
router.get("/allocations", readCourseAllocation);
router.post("/allocations", createCourseAllocation);
router.put("/allocations/:id", updateCourseAllocation);
router.delete("/allocations/:id", deleteCourseAllocation);
router.get("/allocations/:id/detail", getAllocationDetail);

// Attendance Reports
router.get("/reports/sessions", readAttendanceReportSessions);
router.get("/reports/sessions/:id", readAttendanceReportSessionDetail);
router.get("/reports/defaulters", readAttendanceReportDefaulters);

// Class Timetable — period columns
router.get("/class-timetable", readClassTimetable);
router.post("/class-timetable/period", addClassPeriod);
router.put("/class-timetable/period", updateClassPeriod);
router.delete("/class-timetable/period", deleteClassPeriod);

// Class Schedule Entries — cell assignments
router.post("/class-schedule", createClassScheduleEntry);
router.delete("/class-schedule/:id", deleteClassScheduleEntry);
router.get("/schedule-entries/:id/detail", getScheduleEntryDetail);

// Pending student signup approvals
router.get("/pending-students", readPendingStudents);
router.post("/pending-students/:id/approve", approvePendingStudent);
router.post("/pending-students/:id/reject", rejectPendingStudent);

// Semester promotion — SUPER_ADMIN only (authenticate + requirePasswordChange
// already applied above; this narrows past the router-wide ADMIN|SUPER_ADMIN).
router.get(
  "/promotions/preview",
  authorizeRoles("SUPER_ADMIN"),
  previewPromotion,
);
router.post("/promotions/run", authorizeRoles("SUPER_ADMIN"), runPromotion);
router.get("/promotions", authorizeRoles("SUPER_ADMIN"), listPromotionBatches);
router.get(
  "/promotions/:batchId",
  authorizeRoles("SUPER_ADMIN"),
  getPromotionBatchDetail,
);

// User RUD
router.get("/users", readUser);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/users/:id/detail", getUserDetailFull);

module.exports = router;
