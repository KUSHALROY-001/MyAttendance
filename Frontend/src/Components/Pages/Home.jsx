import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <main className="flex-1">
        <section
          id="hero"
          className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:py-20">
            <div className="flex-1 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 sm:text-sm">
                Attendance made effortless
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
                Streamline your class and employee attendance.
              </h1>
              <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Record, manage, and analyze attendance in one place. Reduce
                paperwork, avoid manual errors, and get real-time insights into
                who is present.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/student"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  View Features
                </a>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400 sm:max-w-sm">
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">
                    Real-time overview
                  </dt>
                  <dd>See who is present across classes or departments.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">
                    Exportable reports
                  </dt>
                  <dd>Generate monthly or custom attendance reports.</dd>
                </div>
              </dl>
            </div>

            <div className="flex-1">
              <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Today&apos;s snapshot
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Overview of attendance across your organization.
                </p>
                <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Overall presence
                    </span>
                    <span className="text-emerald-600">92%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Late check-ins
                    </span>
                    <span className="text-amber-600">8</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Absentees
                    </span>
                    <span className="text-rose-600">15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Everything you need to track attendance.
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Built for schools, colleges, and workplaces that want a clear,
                reliable view of presence and participation.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Fast tracking", "Mark attendance for an entire class or team in seconds with a clean, focused interface."],
                ["Detailed reports", "Quickly see trends, frequent absences, and summary statistics for any group or time range."],
                ["Role-based access", "Give teachers, managers, and admins the right level of access while keeping data secure."],
                ["Alerts & reminders", "Highlight repeated absences and send reminders before small issues become big problems."],
                ["Export & integration", "Export attendance data for payroll, grading, or external analytics tools."],
                ["Works anywhere", "Responsive design that works on desktops, tablets, and mobile devices."],
              ].map(([title, body]) => (
                <article
                  key={title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                  Built for real classrooms and teams.
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                  This attendance system is designed to feel simple on day one
                  and powerful as your needs grow. Whether you&apos;re tracking
                  a single class or an entire organization, you get clarity in a
                  few clicks.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                  Use it to cut down on paperwork, reduce manual errors, and
                  keep everyone aligned on who is present, on time, and engaged.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                {[
                  ["For institutions", "Schools, colleges, and training centers get a single attendance source of truth."],
                  ["For workplaces", "Track employee presence, remote days, and shifts from one dashboard."],
                  ["For admins", "Quickly respond to issues with clear records and downloadable reports."],
                  ["For staff", "Simple workflows that make marking attendance a quick part of the day, not a burden."],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {title}
                    </p>
                    <p className="mt-2 text-sm">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="border-t border-slate-200 bg-gradient-to-r from-indigo-600 to-violet-600 dark:border-slate-800"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="flex flex-col items-start gap-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Ready to start tracking attendance?
                </h2>
                <p className="mt-2 text-sm text-indigo-100 sm:text-base">
                  Log in to your dashboard or get in touch with the
                  administrator to request access.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
                >
                  Go to login
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-indigo-100 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500/40"
                >
                  Contact admin
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
