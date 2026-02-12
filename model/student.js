const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true, // e.g., 'Computer Science'
    },
    semester: {
      type: Number,
      required: true, // e.g., 1 to 8
    },
    section: {
      type: String,
      default: "A",
    },
    batch: {
      type: String, // e.g., "2024-2028"
      required: true,
    },
    contactNumber: {
      type: String,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
