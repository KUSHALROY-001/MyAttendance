const express = require("express");
const router = express.Router();
const {
  getTeacherDashboard,
  getAttendanceSession,
  getCourseAttendance,
  getLiveAttendance,
  submitAttendance,
} = require("../controllers/teacher.controller");

router.get("/dashboard/:teacherId", getTeacherDashboard);
router.get("/attendance/:sessionId", getAttendanceSession);
router.get("/:teacherId/course/:courseCode", getCourseAttendance);
router.get("/attendance/live/:allocationId", getLiveAttendance);
router.post("/attendance/submit", submitAttendance);

module.exports = router;
