const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // e.g., "Data Structures and Algorithms"
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // e.g., "BCA-101"
    },
    info: {
      department: {
        type: String,
        required: true, // e.g., "BCA"
      },
      semester: {
        type: Number,
        required: true, // e.g., 1 to 8
      },
    },
    credits: {
      type: Number,
      required: true,
      default: 3,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
