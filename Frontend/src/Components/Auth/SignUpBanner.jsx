import React from "react";
import { BadgeCheck } from "lucide-react";
import { accessCards } from "../../utils/signupHelpers";

const SignUpBanner = () => {
  return (
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
  );
};

export default SignUpBanner;
