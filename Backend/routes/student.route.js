const express = require("express");
const router = express.Router();
const {
  getStudentDashboard,
  getCourseDetails,
} = require("../controllers/student.controller");

router.get("/dashboard/:roll", getStudentDashboard);

router.get("/course/:code", getCourseDetails);

module.exports = router;
