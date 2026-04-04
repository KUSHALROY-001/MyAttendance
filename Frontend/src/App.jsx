import "./App.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./Components/UI/ErrorBoundary";
import PremiumErrorState from "./Components/UI/PremiumErrorState";

import Navbar from "./Components/Layout/Navbar.jsx";
import Footer from "./Components/Layout/Footer.jsx";
import Home from "./Components/Pages/Home.jsx";
import SignUp from "./Components/Pages/SignUp.jsx";
import Login from "./Components/Pages/Login.jsx";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./Components/Pages/Student/StudentDash.jsx";
import CourseDetail from "./Components/Pages/Student/CourseDetail.jsx";
import TeacherDashboard from "./Components/Pages/Teacher/TeacherDashboard.jsx";
import SessionHistory from "./Components/Pages/Teacher/SessionHistory.jsx";
import TeacherCourseDetail from "./Components/Pages/Teacher/TeacherCourseDetail.jsx";
import TakeAttendance from "./Components/Pages/Teacher/TakeAttendance.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/course/:courseId" element={<CourseDetail />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/session/:sessionId" element={<SessionHistory />} />
        <Route path="/teacher/course/:courseId" element={<TeacherCourseDetail />} />
        <Route path="/teacher/attendance/live/:allocationId" element={<TakeAttendance />} />
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={
          <PremiumErrorState 
            title="Page Not Found" 
            message="The URL you are trying to access does not exist or has been moved." 
            errorCode="404" 
          />
        } />
      </Routes>
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
