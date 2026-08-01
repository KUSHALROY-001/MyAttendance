const adminDashboardController = require("./admin/adminDashboard.controller");
const adminStudentsController = require("./admin/adminStudents.controller");
const adminTeachersController = require("./admin/adminTeachers.controller");
const adminCoursesController = require("./admin/adminCourses.controller");
const adminAllocationsController = require("./admin/adminAllocations.controller");
const adminSchedulesController = require("./admin/adminSchedules.controller");
const adminReportsController = require("./admin/adminReports.controller");
const adminUsersController = require("./admin/adminUsers.controller");

module.exports = {
  ...adminDashboardController,
  ...adminStudentsController,
  ...adminTeachersController,
  ...adminCoursesController,
  ...adminAllocationsController,
  ...adminSchedulesController,
  ...adminReportsController,
  ...adminUsersController,
};
