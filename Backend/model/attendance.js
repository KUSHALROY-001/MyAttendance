const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    courseAllocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseAllocation",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave", "Late"],
          default: "Present",
        },
      },
    ],
  },
  { timestamps: true },
);

// Prevent taking attendance twice for the exact same class on the exact same day
// .index() is used to create an index on the specified fields which helps to query the data faster
// { courseAllocation: 1, date: -1 } means that the index will be created on the courseAllocation field in ascending order and on the date field in descending order
// { unique: true } means that the index will be unique
attendanceSchema.index({ courseAllocation: 1, date: -1 });

// Make searching for a specific student's attendance history lightning fast
attendanceSchema.index({ "records.student": 1 });
// Search - Attendance.find({ "records.student": studentId })

module.exports = mongoose.model("Attendance", attendanceSchema);
