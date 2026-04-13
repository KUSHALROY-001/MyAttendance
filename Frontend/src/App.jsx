import "./App.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./Components/UI/ErrorBoundary";
import PremiumErrorState from "./Components/UI/PremiumErrorState";

import Navbar from "./Components/Layout/Navbar.jsx";
import Footer from "./Components/Layout/Footer.jsx";
import Home from "./Components/Pages/Home.jsx";
import SignUp from "./Components/Pages/SignUp.jsx";
import Login from "./Components/Pages/Login.jsx";
import { Routes, Route, Outlet } from "react-router-dom";
import StudentDashboard from "./Components/Pages/Student/StudentDash.jsx";
import CourseDetail from "./Components/Pages/Student/CourseDetail.jsx";
import TeacherDashboard from "./Components/Pages/Teacher/TeacherDashboard.jsx";
import SessionHistory from "./Components/Pages/Teacher/SessionHistory.jsx";
import TeacherCourseDetail from "./Components/Pages/Teacher/TeacherCourseDetail.jsx";
import TakeAttendance from "./Components/Pages/Teacher/TakeAttendance.jsx";

// Admin Imports
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import AdminLayout from "./Components/Pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./Components/Pages/Admin/AdminDashboard.jsx";
import AdminStudents from "./Components/Pages/Admin/AdminStudents.jsx";
import AdminTeachers from "./Components/Pages/Admin/AdminTeachers.jsx";
import AdminCourses from "./Components/Pages/Admin/AdminCourses.jsx";
import AdminAllocations from "./Components/Pages/Admin/AdminAllocations.jsx";
import AdminSchedules from "./Components/Pages/Admin/AdminSchedules.jsx";
import AdminReports from "./Components/Pages/Admin/AdminReports.jsx";
import AdminUsers from "./Components/Pages/Admin/AdminUsers.jsx";

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Toaster position="top-right" />
        <Routes>
          {/* Public & Main App Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route
              path="/student/course/:courseId"
              element={<CourseDetail />}
            />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route
              path="/teacher/session/:sessionId"
              element={<SessionHistory />}
            />
            <Route
              path="/teacher/course/:courseId"
              element={<TeacherCourseDetail />}
            />
            <Route
              path="/teacher/attendance/live/:allocationId"
              element={<TakeAttendance />}
            />

            {/* Fallback for unmatched routes inside Main */}
            <Route
              path="*"
              element={
                <PremiumErrorState
                  title="Page Not Found"
                  message="The URL you are trying to access does not exist or has been moved."
                  errorCode="404"
                />
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="allocations" element={<AdminAllocations />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
