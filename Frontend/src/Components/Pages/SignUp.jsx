import { useState } from "react";
import { useNavigate } from "react-router-dom";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500";

const labelClass = "block text-xs font-medium text-slate-700 dark:text-slate-200";

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

    console.log("Signup payload:", payload);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-white to-indigo-50 transition-colors dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md min-[950px]:max-w-4xl rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-slate-900/40 min-[950px]:p-10">
          <div className="mb-8 text-center min-[950px]:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Get started
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 min-[950px]:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-[950px]:text-sm">
              Sign up to start managing attendance for your class or team.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 min-[950px]:grid-cols-2 min-[950px]:gap-6"
          >
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

            {role === "student" && (
              <div className="col-span-1 mt-2 space-y-4 rounded-lg border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-600/60 dark:bg-slate-800/40 min-[950px]:col-span-2">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  Student details
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[950px]:grid-cols-2">
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
              <div className="col-span-1 mt-2 space-y-4 rounded-lg border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-600/60 dark:bg-slate-800/40 min-[950px]:col-span-2">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  Teacher details
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="col-span-1 mt-4 min-[950px]:col-span-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/80"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-500 hover:text-indigo-400 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignUp;
