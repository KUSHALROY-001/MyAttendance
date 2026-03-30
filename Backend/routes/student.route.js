const express = require("express");
const router = express.Router();
const { getStudentDashboard } = require("../controllers/student.controller");

router.get("/dashboard/:roll", getStudentDashboard);

module.exports = router;
