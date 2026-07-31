import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const inputClass =
  "block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const accessCards = [
  {
    title: "Student Access",
    description:
      "Create your student account with your academic details so your courses, class routine, and attendance tracking are connected from the start.",
    icon: GraduationCap,
  },
  {
    title: "Admin Access",
    description:
      "Admin access is restricted to institution-authorized staff who manage users, courses, schedules, and reports.",
    icon: ShieldCheck,
  },
];

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [academicOptions, setAcademicOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSec, setSelectedSec] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchAcademicOptions = async () => {
      try {
        setLoadingOptions(true);
        const res = await api.get("/api/auth/academic-options", {
          hideAuthRedirect: true,
          skipAuthRefresh: true,
        });
        const depts = res.data?.departments || [];
        setAcademicOptions(depts);
        if (depts.length > 0) {
          const firstDept = depts[0];
          setSelectedDept(firstDept.code);
          const sems = firstDept.semesterDetails || [];
          if (sems.length > 0) {
            setSelectedSem(String(sems[0].semester));
            const secs = sems[0].sections || [];
            if (secs.length > 0) {
              setSelectedSec(secs[0]);
            }
          }
        }
      } catch (_err) {
        toast.error("Failed to load department options.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchAcademicOptions();
  }, []);

  const currentDeptObj = useMemo(() => {
    return academicOptions.find((d) => d.code === selectedDept);
  }, [academicOptions, selectedDept]);

  const availableSemesters = useMemo(() => {
    if (!currentDeptObj || !currentDeptObj.semesterDetails) return [];
    return currentDeptObj.semesterDetails.map((detail) => detail.semester);
  }, [currentDeptObj]);

  const currentSemObj = useMemo(() => {
    if (!currentDeptObj || !currentDeptObj.semesterDetails) return null;
    return currentDeptObj.semesterDetails.find(
      (detail) => String(detail.semester) === String(selectedSem),
    );
  }, [currentDeptObj, selectedSem]);

  const availableSections = useMemo(() => {
    if (!currentSemObj || !currentSemObj.sections) return [];
    return currentSemObj.sections;
  }, [currentSemObj]);

  const handleDeptChange = (e) => {
    const nextDeptCode = e.target.value;
    setSelectedDept(nextDeptCode);

    const deptObj = academicOptions.find((d) => d.code === nextDeptCode);
    const sems = deptObj?.semesterDetails || [];
    if (sems.length > 0) {
      const nextSem = String(sems[0].semester);
      setSelectedSem(nextSem);
      const secs = sems[0].sections || [];
      if (secs.length > 0) {
        setSelectedSec(secs[0]);
      } else {
        setSelectedSec("");
      }
    } else {
      setSelectedSem("");
      setSelectedSec("");
    }
  };

  const handleSemChange = (e) => {
    const nextSemStr = e.target.value;
    setSelectedSem(nextSemStr);

    const semObj = currentDeptObj?.semesterDetails?.find(
      (d) => String(d.semester) === String(nextSemStr),
    );
    const secs = semObj?.sections || [];
    if (secs.length > 0) {
      setSelectedSec(secs[0]);
    } else {
      setSelectedSec("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      setIsSubmitting(true);

      await api.post(
        "/api/auth/signup",
        {
          ...data,
          department: selectedDept || data.department,
          semester: Number(selectedSem || data.semester),
          section: selectedSec || data.section,
        },
        {
          hideAuthRedirect: true,
          skipAuthRefresh: true,
        },
      );

      toast.success(
        `${data.name || "Your"} account has been created successfully. Please log in.`,
        { duration: 4000 },
      );
      navigate("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_30%),linear-gradient(to_bottom_right,_#e2e8f0,_#ffffff,_#eef2ff)] px-4 py-10 transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_28%),linear-gradient(to_bottom_right,_#0f172a,_#111827,_#020617)]">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/85 p-3 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70 md:p-8 lg:w-[42%] lg:p-10">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-500">
              Institution Access
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 lg:text-4xl">
              Create your student account
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Sign up with your academic details to instantly create a student
              account that can connect your enrolled subjects, routine, and
              attendance records.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {accessCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-950/50 md:p-4"
                >
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                      <Icon size={20} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {card.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
              <div>
                <p className="text-sm font-black">What happens next?</p>
                <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-200">
                  After successful signup, you&apos;ll be redirected to login so
                  you can access your dashboard with your new credentials.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white/90 p-3 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/75 md:p-8 lg:flex-1 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              Student Registration
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
              Fill in your academic profile
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              These details are saved directly to your student profile so your
              courses and attendance setup can start immediately.
            </p>
          </div>

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
                  onClick={() => setShowPassword((value) => !value)}
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

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
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
        </section>
      </main>
    </div>
  );
}

export default SignUp;
