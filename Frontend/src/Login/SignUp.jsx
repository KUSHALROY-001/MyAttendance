import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";
import Footer from "../layout/Footer.jsx";

const inputClass =
  "block w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60";

const labelClass = "block text-xs font-medium text-slate-200";

function SignUp() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
    };

    if (data.role === "student") {
      payload.studentInfo = {
        rollNumber: data.rollNumber,
        branch: data.branch,
        year: parseInt(data.year, 10),
        section: data.section,
      };
    } else if (data.role === "teacher") {
      payload.teacherInfo = {
        department: data.department,
        designation: data.designation,
      };
    }
    // admin has no extra fields

    console.log("Signup payload:", payload);
    // TODO: POST to /api/auth/signup
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900/60 border border-slate-700 shadow-xl shadow-slate-900/40 backdrop-blur-md p-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Get started
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              Create your account
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign up to start managing attendance for your class or team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Enter your full name"
              />
            </div>

            {/* 2. Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            {/* 3. Role */}
            <div className="space-y-1.5">
              <label htmlFor="role" className={labelClass}>
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={inputClass}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* 4. Role-based fields */}
            {role === "student" && (
              <div className="space-y-4 rounded-lg border border-slate-600/60 bg-slate-800/40 p-4">
                <p className="text-xs font-medium text-indigo-300">
                  Student details
                </p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="rollNumber" className={labelClass}>
                      Roll number
                    </label>
                    <input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      required
                      className={inputClass}
                      placeholder="e.g., 21CS001"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="branch" className={labelClass}>
                      Branch
                    </label>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      required
                      className={inputClass}
                      placeholder="e.g., CSE, ECE"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="year" className={labelClass}>
                      Year
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      required
                      min={1}
                      max={6}
                      className={inputClass}
                      placeholder="e.g., 1, 2, 3, 4"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="section" className={labelClass}>
                      Section
                    </label>
                    <input
                      id="section"
                      name="section"
                      type="text"
                      required
                      className={inputClass}
                      placeholder="e.g., A, B"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === "teacher" && (
              <div className="space-y-4 rounded-lg border border-slate-600/60 bg-slate-800/40 p-4">
                <p className="text-xs font-medium text-indigo-300">
                  Teacher details
                </p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="department" className={labelClass}>
                      Department
                    </label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      required
                      className={inputClass}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="designation" className={labelClass}>
                      Designation
                    </label>
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      required
                      className={inputClass}
                      placeholder="e.g., Assistant Professor"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
                placeholder="Create a secure password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/80"
            >
              Sign up
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Login
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SignUp;