const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    subject: {
      type: String,
      required: true, // e.g., 'Data Structures'
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // The teacher who took this class
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    // This is the "Register" - a list of all students in that class and their status
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        status: {
          type: Number,
          enum: [0, 1],
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

// Prevent duplicate attendance for the same subject/section on the same day
attendanceSchema.index({ date: 1, subject: 1, section: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
