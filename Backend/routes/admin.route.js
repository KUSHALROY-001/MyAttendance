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

module.exports = router;
