const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// Route imports
const studentRoutes = require("./routes/student.route");
const teacherRoutes = require("./routes/teacher.route");
const adminRoutes = require("./routes/admin.route");
const libraryRoutes = require("./routes/library.route");
const authRoutes = require("./routes/auth.route");
const errorHandler = require("./middlewares/error.middleware");

// Load environment variables from backend/.env (dotenv defaults to the
// current working directory, which is backend/ when you run `npm run dev`
// or `npm start` from inside this folder).
dotenv.config();

const app = express();

// CORS — required because the frontend sends credentials (refresh-token cookie).
// FRONTEND_URL can be a comma-separated list if you need more than one origin
// (e.g. local dev + a deployed preview URL).
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, same-origin) and
      // any origin explicitly listed in FRONTEND_URL.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/auth", authRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Defaults to 5000 to match the Vite dev proxy target in frontend/vite.config.js.
// Override with PORT in your .env if needed.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
