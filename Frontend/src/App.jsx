import "./App.css";

import Home from "./landingPage/Home.jsx";
import SignUp from "./Login/SignUp.jsx";
import Login from "./Login/Login.jsx";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./Components/Pages/Student/StudentDash.jsx";
import CourseDetail from "./Components/Pages/CourseDetail.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/course/:courseId" element={<CourseDetail />} />
    </Routes>
  );
}

export default App;
