import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDefaultRouteForRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      setIsSubmitting(true);
      const user = await login({
        email: data.email,
        password: data.password,
      });
      navigate(location.state?.from?.pathname || getDefaultRouteForRole(user?.role), {
        replace: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-white to-indigo-50 transition-colors dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-slate-900/40">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Welcome back
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Login to your account
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Access your attendance dashboard with your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/80"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            Need an institution-approved account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-indigo-500 hover:text-indigo-400 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Request Access
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
