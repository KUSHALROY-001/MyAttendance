import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";
import Footer from "../layout/Footer.jsx";

function Login() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Login payload:", data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900/60 border border-slate-700 shadow-xl shadow-slate-900/40 backdrop-blur-md p-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Welcome back
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              Login to your account
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Access your attendance dashboard with your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/80"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
