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
attendanceSchema.index({ courseAllocation: 1, date: -1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
