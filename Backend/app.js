const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const { Student } = require("./model");

// Load environment variables (looks for .env in project root)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
connectDB();

// Body parser middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api", function (req, res) {
  console.log(req.body);
  res.send("Hello World");
});

app.get("/api/student/dashboard/:roll", async (req, res) => {
  const { roll } = req.params;
  console.log(roll);
  const studentData = await Student.findOne({ rollNumber: roll }).populate(
    "courses",
    "name code",
  ).populate("user", "name email").populate("attendance", "date status");

  if (!studentData) {
    return res.status(404).json({ message: "Student not found" });
  } else {
    return res.status(200).json(studentData);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
