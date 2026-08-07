import React from "react";
import { useNavigate } from "react-router-dom";

const SignUpFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            Already have credentials?
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Login with your student account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="inline-flex items-center justify-center rounded-xl border border-indigo-600 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
        >
          Go to Login
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't see your institute in the system yet?{" "}
        <button
          type="button"
          onClick={() => navigate("/register-institute")}
          className="font-semibold text-indigo-500 hover:text-indigo-400 dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          Register it here
        </button>
      </p>
    </div>
  );
};

export default SignUpFooter;
