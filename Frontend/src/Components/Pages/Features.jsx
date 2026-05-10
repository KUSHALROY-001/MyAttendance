import { Link } from "react-router-dom";
import PublicVisuals from "./PublicVisuals";
import { featureSections } from "./publicContent";

function Features() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_30%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(to_bottom,_#020617,_#0f172a)] dark:text-slate-100">
      <main className="mx-auto max-w-6xl p-4 sm:px-6 lg:py-12">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300">
            Product Features
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            A modern attendance platform for students, teachers, and admins.
          </h1>
          <p className="mt-5 text-base text-slate-600 dark:text-slate-300">
            Every feature is built around one idea: the right person should see
            the right information at the right moment, without extra steps.
          </p>
        </section>

        <section className="mt-16 space-y-16">
          {featureSections.map((section, index) => (
            <div
              key={section.id}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <PublicVisuals visual={section.visual} tone={section.theme} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  {section.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
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
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-10 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Want to explore the product flow next?
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                We can keep refining the public marketing pages or move into
                deeper product polish.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View About
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Open Product
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Features;
