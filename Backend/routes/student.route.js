const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  authorizeRoles,
  authorizeStudentSelf,
} = require("../middlewares/authorize.middleware");
const {
  getStudentDashboard,
  getCourseDetails,
} = require("../controllers/student.controller");

router.use(authenticate, authorizeRoles("STUDENT", "ADMIN"));

router.get("/dashboard/:roll", authorizeStudentSelf(), getStudentDashboard);
router.get("/course/:code", getCourseDetails);

module.exports = router;
