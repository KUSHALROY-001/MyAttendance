import { useState } from "react";
import "./App.css";
import Home from "./landingPage/Home.jsx"
import SignUp from "./Login/SignUp.jsx";
import Login from "./Login/Login.jsx";

function App() {
  const [view, setView] = useState("signup");

  return view === "signup" ? (
    <SignUp onSwitchToLogin={() => setView("login")} />
  ) : (
    <Login onSwitchToSignUp={() => setView("signup")} />
  );
}

export default App;
