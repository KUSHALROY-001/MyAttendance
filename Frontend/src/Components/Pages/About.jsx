import { Link } from "react-router-dom";
import PublicVisuals from "./PublicVisuals";
import { aboutHighlights, timelineItems } from "./publicContent";

function About() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f8fafc,_#eef2ff_34%,_#ffffff)] text-slate-900 dark:bg-[linear-gradient(to_bottom,_#020617,_#0f172a_40%,_#111827)] dark:text-slate-100">
      <main className="mx-auto max-w-6xl p-4 sm:px-6 lg:py-12">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300">
              About MyAttendance
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Built to make academic operations feel clear, calm, and connected.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              A good attendance system should do more than store records. It
              should connect schedules, classroom activity, reporting, and
              visibility across the people who depend on it every day.
            </p>
          </div>
          <PublicVisuals visual="admin" tone="emerald" />
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {aboutHighlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
            >
              <h2 className="text-lg font-bold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-18 grid gap-10 pt-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              What Usually Belongs Here
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              An about page should answer trust questions.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              People visit an about page to understand the product’s purpose,
              who it is for, how it thinks, and whether it feels credible. So
              instead of filler text, this page explains the product mindset and
              how the different roles connect.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Operating Flow
            </p>
            <div className="mt-6 space-y-5">
              {timelineItems.map((item, index) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    {index < timelineItems.length - 1 ? (
                      <div className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />
                    ) : null}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-10 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                This gives the public side a stronger story.
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Home attracts attention, Features explains capability, and About
                builds confidence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Back to Features
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Go Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
