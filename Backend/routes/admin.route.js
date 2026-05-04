const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  getDepartment,
  readStudent,
  createStudent,
  updateStudent,
  deleteStudent,
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
} = require("../controllers/admin.controller");

router.get("/dashboard", getAdminDashboard);
router.get("/departments", getDepartment);

// Student CRUD
router.get("/students", readStudent);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// Teacher CRUD
router.get("/teachers", readTeacher);
router.post("/teachers", createTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);

// Course CRUD
router.get("/courses", readCourse);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Course Allocation CRUD
router.get("/allocations", readCourseAllocation);
router.post("/allocations", createCourseAllocation);
router.put("/allocations/:id", updateCourseAllocation);
router.delete("/allocations/:id", deleteCourseAllocation);

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

// User RUD
router.get("/users", readUser);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
