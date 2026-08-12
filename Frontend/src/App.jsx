import "./App.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PremiumErrorState from "./components/common/PremiumErrorState";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import Features from "./pages/Features.jsx";
import About from "./pages/About.jsx";
import SignUp from "./pages/SignUp.jsx";
import RegisterInstitute from "./pages/RegisterInstitute.jsx";
import Login from "./pages/Login.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";
import RequirePasswordChange from "./components/auth/RequirePasswordChange.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import TakeAttendance from "./pages/TakeAttendance.jsx";
import Library from "./pages/Library.jsx";
import ChangePasswordRequired from "./pages/ChangePasswordRequired.jsx";

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
import AdminInstituteSettings from "./pages/AdminInstituteSettings.jsx";
import AdminPendingApprovals from "./pages/AdminPendingApprovals.jsx";
import AdminAcademicOptions from "./pages/AdminAcademicOptions.jsx";
import AdminPromotions from "./pages/AdminPromotions.jsx";

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
              <Route
                path="/register-institute"
                element={<RegisterInstitute />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
              <Route element={<RequirePasswordChange />}>
                <Route path="/student" element={<StudentDashboard />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
              <Route element={<RequirePasswordChange />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route
                  path="/teacher/attendance/live/:allocationId"
                  element={<TakeAttendance />}
                />
              </Route>
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"]}
                />
              }
            >
              {/* Not wrapped in RequirePasswordChange — this is the escape
                  hatch a locked-out user is redirected to, so it can't also
                  redirect away from itself. */}
              <Route
                path="/change-password"
                element={<ChangePasswordRequired />}
              />

              <Route element={<RequirePasswordChange />}>
                <Route path="/profile/edit" element={<EditProfile />} />
              </Route>
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
          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}
          >
            <Route element={<RequirePasswordChange />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="teachers" element={<AdminTeachers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="allocations" element={<AdminAllocations />} />
                <Route path="schedules" element={<AdminSchedules />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="users" element={<AdminUsers />} />
                <Route
                  path="academic-options"
                  element={<AdminAcademicOptions />}
                />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="institute" element={<AdminInstituteSettings />} />
                <Route
                  path="pending-approvals"
                  element={<AdminPendingApprovals />}
                />
                <Route path="profile/edit" element={<EditProfile />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
