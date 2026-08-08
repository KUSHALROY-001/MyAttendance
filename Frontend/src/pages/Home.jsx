import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import ScreenSlider from "../components/public/ScreenSlider";
import { featureSections } from "../utils/publicContent";

const heroStats = [
  [
    "Attendance Clarity",
    "Students see overall and per-subject status instantly.",
  ],
  ["Teacher Workflow", "Schedules and sessions stay in one focused flow."],
  ["Admin Control", "Curriculum, reports, and routine stay aligned."],
];

function DemoAccountCard({ account }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${account.email}\n${account.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-bold tracking-wider ${account.badge}`}
          >
            {account.role}
          </span>
          <button
            onClick={handleCopy}
            title="Copy Credentials"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
          {account.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-400 dark:text-slate-500 font-sans text-[11px] shrink-0">
            Email:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 select-all truncate">
            {account.email}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-400 dark:text-slate-500 font-sans text-[11px] shrink-0">
            Pass:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 select-all truncate">
            {account.password}
          </span>
        </div>
      </div>
    </div>
  );
}

function ZigZagSection({ section, index }) {
  const isEven = index % 2 === 0;
  return (
    <div
      className={`grid items-start gap-12 lg:grid-cols-2 ${
        isEven ? "" : "lg:[&>*:first-child]:order-2"
      }`}
    >
      {/* Text side */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300">
          {section.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {section.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          {section.body}
        </p>
        <div className="mt-6 space-y-3">
          {section.points.map((point) => (
            <div
              key={point}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Slider side */}
      <ScreenSlider startAt={section.startAt} />
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(to_bottom,_#020617,_#0f172a)] dark:text-slate-100">
      <main>
        {/* ── Hero ── */}
        <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 lg:pt-16">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="inline-flex rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 shadow-sm backdrop-blur dark:border-indigo-500/30 dark:bg-slate-900/70 dark:text-indigo-300">
                Academic Attendance Platform
              </p>
              <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                One system for attendance, routine, and academic control.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                MyAttendance connects student visibility, teacher workflow, and
                admin-level control into a single product so the academic day
                feels coordinated instead of fragmented.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Explore Features
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Why This Product
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map(([title, body]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero slider */}
            <ScreenSlider startAt={0} />
          </div>
        </section>

        {/* ── Demo Credentials & Role strip ── */}
        <section className="border-y border-slate-200/80 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
                  Try It Live
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                  Demo Test Credentials
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Use any of the accounts below to explore the platform for
                  different roles.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition shrink-0"
              >
                Go to Login →
              </Link>
            </div>

            {/* Credentials Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  role: "STUDENT",
                  email: "harry@college.edu",
                  password: "password123",
                  description:
                    "Track attendance, subject breakdowns & routine.",
                  badge:
                    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
                },
                {
                  role: "TEACHER",
                  email: "albus@college.edu",
                  password: "password123",
                  description: "Take attendance & manage class schedules.",
                  badge:
                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
                },
                {
                  role: "ADMIN",
                  email: "remus@college.edu",
                  password: "password123",
                  description: "Control courses, routines, users & reports.",
                  badge:
                    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
                },
                {
                  role: "SUPER ADMIN",
                  email: "admin@college.edu",
                  password: "Password123",
                  description: "Full institute control & academic options.",
                  badge:
                    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
                },
              ].map((acc) => (
                <DemoAccountCard key={acc.role} account={acc} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Zig-zag feature sections ── */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300">
              Built Around Roles
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Every role gets exactly what it needs.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              See the actual screens your students, teachers, and admins will
              work with — purpose-built for each workflow.
            </p>
          </div>

          <div className="space-y-24">
            {featureSections.map((section, index) => (
              <ZigZagSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-900 px-6 py-10 text-white shadow-sm dark:border-slate-700 sm:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Next Step
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Home attracts. Features explains. About builds trust.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Explore the full feature breakdown or read the product story
                  behind MyAttendance.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Open Login
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Read About
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
