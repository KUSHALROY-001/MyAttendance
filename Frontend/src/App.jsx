import "./App.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PremiumErrorState from "./components/common/PremiumErrorState";

import Navbar from "./Components/Layout/Navbar.jsx";
import Footer from "./Components/Layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import Features from "./pages/Features.jsx";
import About from "./pages/About.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./Components/Auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./Components/Auth/PublicOnlyRoute.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import TakeAttendance from "./pages/TakeAttendance.jsx";
import Library from "./pages/Library.jsx";

// Admin Imports
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminStudents from "./pages/AdminStudents.jsx";
import AdminTeachers from "./pages/AdminTeachers.jsx";
import AdminCourses from "./pages/AdminCourses.jsx";
import AdminAllocations from "./pages/AdminAllocations.jsx";
import AdminSchedules from "./pages/AdminSchedules.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

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
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/library" element={<Library />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
              <Route path="/student" element={<StudentDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route
                path="/teacher/attendance/live/:allocationId"
                element={<TakeAttendance />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={["STUDENT", "TEACHER", "ADMIN"]} />
              }
            >
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>

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
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="allocations" element={<AdminAllocations />} />
              <Route path="schedules" element={<AdminSchedules />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="profile/edit" element={<EditProfile />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
