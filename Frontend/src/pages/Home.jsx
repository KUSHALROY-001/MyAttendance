import React from "react";
import { Link } from "react-router-dom";
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

function ZigZagSection({ section, index }) {
  const isEven = index % 2 === 0;
  return (
    <div
      className={`grid items-center gap-12 lg:grid-cols-2 ${
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
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
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

        {/* ── Role strip ── */}
        <section className="border-y border-slate-200/80 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
            {[
              [
                "Students",
                "Track personal attendance, subject breakdowns, and section routine.",
              ],
              [
                "Teachers",
                "Take attendance quickly and stay aligned with actual class schedules.",
              ],
              [
                "Admins",
                "Control courses, allocations, routines, users, and reports from one place.",
              ],
            ].map(([title, text]) => (
              <div key={title}>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {text}
                </p>
              </div>
            ))}
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
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
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
