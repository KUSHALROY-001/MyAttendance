const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
// Route imports
const studentRoutes = require("./routes/student.route");
const teacherRoutes = require("./routes/teacher.route");
const errorHandler = require("./middlewares/error.middleware");

// Load environment variables (looks for .env in project root)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
