import React from "react";
import { useSignUp } from "../hooks/useSignUp";
import SignUpBanner from "../components/auth/SignUpBanner";
import SignUpForm from "../components/auth/SignUpForm";
import SignUpFooter from "../components/auth/SignUpFooter";

function SignUp() {
  const signupProps = useSignUp();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 transition-colors duration-300 dark:bg-[#0D0D0F]">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <SignUpBanner />

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 dark:border-[#222228] dark:bg-[#151518] md:p-8 lg:flex-1 lg:p-10">
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

          <SignUpForm {...signupProps} />
          <SignUpFooter />
        </section>
      </main>
    </div>
  );
}

export default SignUp;
