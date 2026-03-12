import "./App.css";

import Home from "./Components/Pages/Home.jsx";
import SignUp from "./Components/Pages/SignUp.jsx";
import Login from "./Components/Pages/Login.jsx";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./Components/Pages/Student/StudentDash.jsx";
import CourseDetail from "./Components/Pages/Student/CourseDetail.jsx";

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
