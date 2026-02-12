const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String, // e.g., 'Assistant Professor'
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    // List of subjects this teacher is allowed to take attendance for
    subjects: [
      {
        type: String, // e.g., ['Data Structures', 'Operating Systems']
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Teacher", teacherSchema);
