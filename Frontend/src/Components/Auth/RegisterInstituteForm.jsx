import React from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

const inputClass =
  "block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const RegisterInstituteForm = ({
  handleSubmit,
  instituteCode,
  handleInstituteCodeChange,
  isInstituteCodeFormatValid,
  showPassword,
  toggleShowPassword,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
      <div className="space-y-1.5">
        <label htmlFor="instituteName" className={labelClass}>
          Institute Name
          <Required />
        </label>
        <input
          id="instituteName"
          name="instituteName"
          type="text"
          required
          className={inputClass}
          placeholder="e.g., Hogwarts College of Technology"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="instituteCode" className={labelClass}>
          Institute Code
          <Required />
        </label>
        <input
          id="instituteCode"
          name="instituteCode"
          type="text"
          required
          value={instituteCode}
          onChange={handleInstituteCodeChange}
          autoComplete="off"
          className={`${inputClass} uppercase tracking-widest`}
          placeholder="e.g., HOGWARTS"
        />
        <p
          className={`mt-1.5 text-xs ${
            isInstituteCodeFormatValid
              ? "text-slate-400 dark:text-slate-500"
              : "font-semibold text-rose-500"
          }`}
        >
          {isInstituteCodeFormatValid
            ? "This is what your students and staff will use to join — 3-20 characters, letters/numbers/hyphens only."
            : "3-20 characters: letters, numbers, or hyphens only."}
        </p>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      <div className="space-y-1.5">
        <label htmlFor="adminName" className={labelClass}>
          Your Full Name
          <Required />
        </label>
        <input
          id="adminName"
          name="adminName"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="adminEmail" className={labelClass}>
          Your Email
          <Required />
        </label>
        <input
          id="adminEmail"
          name="adminEmail"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="adminPassword" className={labelClass}>
          Password
          <Required />
        </label>
        <div className="relative">
          <input
            id="adminPassword"
            name="adminPassword"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            className={`${inputClass} pr-11`}
            placeholder="Create a password (min 6 characters)"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
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
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black tracking-wide text-white shadow-lg shadow-indigo-900/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Registering Institute..." : "Register Institute"}
        <ArrowRight size={16} />
      </button>
    </form>
  );
};

export default RegisterInstituteForm;
