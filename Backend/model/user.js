const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false, // When querying users, don't return password by default
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    // Specific fields for Students
    studentInfo: {
      rollNumber: { type: String },
      branch: { type: String }, // e.g., CSE, ECE
      year: { type: Number }, // e.g., 1, 2, 3, 4
      section: { type: String }, // e.g., 'A', 'B'
    },
    // Specific fields for Teachers
    teacherInfo: {
      department: { type: String },
      designation: { type: String }, // e.g., Assistant Professor
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

module.exports = mongoose.model("User", userSchema);
