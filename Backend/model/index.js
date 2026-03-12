// Central place to register and export all Mongoose models.
// Requiring this file ensures all models are registered with mongoose.

const User = require("./user");
const Student = require("./student");
const Teacher = require("./teacher");
const Course = require("./subject");
const CourseAllocation = require("./courseAllocation");
const Attendance = require("./attendance");

module.exports = {
  User,
  Student,
  Teacher,
  Course,
  CourseAllocation,
  Attendance,
};
