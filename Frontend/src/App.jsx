import "./App.css";

import Home from "./landingPage/Home.jsx";
import SignUp from "./Login/SignUp.jsx";
import Login from "./Login/Login.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
