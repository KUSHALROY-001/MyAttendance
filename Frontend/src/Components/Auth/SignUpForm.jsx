import React from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

const inputClass =
  "block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const SignUpForm = ({
  handleSubmit,
  showPassword,
  toggleShowPassword,
  academicOptions,
  selectedDept,
  handleDeptChange,
  loadingOptions,
  selectedSem,
  handleSemChange,
  availableSemesters,
  selectedSec,
  setSelectedSec,
  availableSections,
  isSubmitting,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <div className="space-y-1.5">
        <label htmlFor="name" className={labelClass}>
          Full Name
          <Required />
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
          <Required />
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
          <Required />
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
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

      <div className="space-y-1.5">
        <label htmlFor="department" className={labelClass}>
          Department
          <Required />
        </label>
        <select
          id="department"
          name="department"
          value={selectedDept}
          onChange={handleDeptChange}
          required
          disabled={loadingOptions || academicOptions.length === 0}
          className={inputClass}
        >
          {academicOptions.map((dept) => (
            <option key={dept.code} value={dept.code}>
              {dept.code} {dept.name ? `- ${dept.name}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="semester" className={labelClass}>
          Semester
          <Required />
        </label>
        <select
          id="semester"
          name="semester"
          value={selectedSem}
          onChange={handleSemChange}
          required
          disabled={loadingOptions || availableSemesters.length === 0}
          className={inputClass}
        >
          {availableSemesters.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="rollNumber" className={labelClass}>
          Roll Number
          <Required />
        </label>
        <input
          id="rollNumber"
          name="rollNumber"
          type="text"
          required
          className={inputClass}
          placeholder="e.g., BCA-002"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="section" className={labelClass}>
          Section
          <Required />
        </label>
        <select
          id="section"
          name="section"
          value={selectedSec}
          onChange={(e) => setSelectedSec(e.target.value)}
          required
          disabled={loadingOptions || availableSections.length === 0}
          className={inputClass}
        >
          {availableSections.map((sec) => (
            <option key={sec} value={sec}>
              Section {sec}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="batch" className={labelClass}>
          Batch
          <Required />
        </label>
        <input
          id="batch"
          name="batch"
          type="text"
          required
          className={inputClass}
          placeholder="e.g., 2024-2027"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contactNumber" className={labelClass}>
          Contact Number
          <Required />
        </label>
        <input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          required
          className={inputClass}
          placeholder="Enter your mobile number"
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black tracking-wide text-white shadow-lg shadow-indigo-900/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/80"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
