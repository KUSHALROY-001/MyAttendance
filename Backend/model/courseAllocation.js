const mongoose = require("mongoose");

// This answers: "Who teaches what, to whom, and where?"
const courseAllocationSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    department: {
      type: String,
      required: true, // e.g., 'BCA'
    },
    semester: {
      type: Number,
      required: true, // e.g., 1
    },
    section: {
      type: String,
      required: true, // e.g., 'A'
    },
    academicYear: {
      type: String,
      default: "2025-2026",
    },
  },
  { timestamps: true },
);

// A teacher cannot be assigned the exact same subject for the exact same section twice
courseAllocationSchema.index(
  { teacher: 1, course: 1, department: 1, semester: 1, section: 1 },
  { unique: true },
);

module.exports = mongoose.model("CourseAllocation", courseAllocationSchema);
