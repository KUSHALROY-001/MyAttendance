import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, BadgeCheck } from "lucide-react";
import { useRegisterInstitute } from "../hooks/useRegisterInstitute";
import RegisterInstituteForm from "../components/auth/RegisterInstituteForm";

function RegisterInstitute() {
  const navigate = useNavigate();
  const registerProps = useRegisterInstitute();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 transition-colors duration-300 dark:bg-[#0D0D0F]">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 dark:border-[#222228] dark:bg-[#151518] md:p-8 lg:w-[42%] lg:p-10">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-500">
              For Institutes
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 lg:text-4xl">
              Bring your institute onboard
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Register your college or institute to get your own private
              attendance system — separate from every other institute on the
              platform. You'll become the first admin, and you'll get a join
              code to share with your students.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 dark:border-[#222228] dark:bg-[#19191D]">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Building2 size={20} />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Your own isolated workspace
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Students, teachers, courses, and attendance records for your
                  institute are never mixed with any other institute's data.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
              <div>
                <p className="text-sm font-black">What happens next?</p>
                <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-200">
                  After registering, log in with your new admin account to
                  start adding departments, courses, teachers, and sharing
                  your institute code with students.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 dark:border-[#222228] dark:bg-[#151518] md:p-8 lg:flex-1 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              Institute Registration
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
              Set up your institute
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This creates your institute and your own admin account in one
              step.
            </p>
          </div>

          <RegisterInstituteForm {...registerProps} />

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                Already have an institute account?
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Login with your admin credentials.
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

export default RegisterInstitute;
