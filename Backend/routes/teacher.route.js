const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  authorizeRoles,
  authorizeTeacherSelf,
  authorizeTeacherAllocationAccess,
  authorizeTeacherSessionAccess,
} = require("../middlewares/authorize.middleware");
const {
  getTeacherDashboard,
  getAttendanceSession,
  getCourseAttendance,
  getLiveAttendance,
  submitAttendance,
} = require("../controllers/teacher.controller");

router.use(authenticate, authorizeRoles("TEACHER", "ADMIN", "SUPER_ADMIN"));

router.get(
  "/dashboard/:teacherId",
  authorizeTeacherSelf(),
  getTeacherDashboard,
);
router.get(
  "/attendance/:sessionId",
  authorizeTeacherSessionAccess(),
  getAttendanceSession,
);
router.get(
  "/:teacherId/allocation/:allocationId/course",
  authorizeTeacherSelf(),
  authorizeTeacherAllocationAccess(),
  getCourseAttendance,
);
router.get(
  "/attendance/live/:allocationId",
  authorizeTeacherAllocationAccess(),
  getLiveAttendance,
);
router.post(
  "/attendance/submit",
  authorizeTeacherAllocationAccess({
    source: "body",
    key: "courseAllocationId",
  }),
  submitAttendance,
);

module.exports = router;
