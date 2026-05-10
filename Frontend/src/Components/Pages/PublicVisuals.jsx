const toneStyles = {
  indigo: {
    shell:
      "border-indigo-200/70 bg-white/85 dark:border-indigo-500/20 dark:bg-slate-950/75",
    glow: "from-indigo-500/20 via-cyan-400/10 to-transparent",
    accent: "bg-indigo-500",
    soft: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  amber: {
    shell:
      "border-amber-200/70 bg-white/85 dark:border-amber-500/20 dark:bg-slate-950/75",
    glow: "from-amber-400/25 via-rose-300/10 to-transparent",
    accent: "bg-amber-500",
    soft: "bg-amber-50 dark:bg-amber-500/10",
  },
  emerald: {
    shell:
      "border-emerald-200/70 bg-white/85 dark:border-emerald-500/20 dark:bg-slate-950/75",
    glow: "from-emerald-400/25 via-teal-300/10 to-transparent",
    accent: "bg-emerald-500",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
  },
};

const studentBars = [92, 76, 88];
const teacherRows = [
  ["8:30 - 9:20", "BCA Sem 3 Sec A"],
  ["11:30 - 12:20", "BCA Sem 1 Sec B"],
  ["1:20 - 2:10", "Lab Session"],
];
const adminRows = [
  ["Departments", "04"],
  ["Allocations", "18"],
  ["Active Timetables", "09"],
  ["Reports Ready", "24"],
];

const PublicVisuals = ({ visual = "student", tone = "indigo" }) => {
  const styles = toneStyles[tone] || toneStyles.indigo;

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        className={`absolute inset-x-10 top-8 h-56 rounded-full bg-gradient-to-br blur-3xl ${styles.glow}`}
      />
      <div
        className={`relative overflow-hidden rounded-[2rem] border pt-9 p-2 md:pt-9 md:p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur ${styles.shell}`}
      >
        <div className="absolute right-4 top-4 md:pr-3 flex gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${styles.accent}`} />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {visual === "student" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {studentBars.map((value, index) => (
                <div
                  key={value}
                  className={`rounded-2xl p-3 ${styles.soft} transition-transform duration-500`}
                  style={{
                    transform: `translateY(${index % 2 === 0 ? "0px" : "10px"})`,
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Subject {index + 1}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {value}%
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Weekly routine
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monday to Saturday
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Synced
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Lab", "Break"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`rounded-xl px-2 py-3 text-center text-xs font-semibold ${
                        index === 6
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                          : index === 7
                            ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            : "bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200"
                      }`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : null}

        {visual === "teacher" ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Today&apos;s planner
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Teacher-first schedule view
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {teacherRows.map(([time, label], index) => (
                  <div
                    key={time}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      index === 2
                        ? "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {index === 2 ? "Practical session" : "Attendance ready"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 ${styles.soft}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Sessions this month
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  34
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Records updated
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  1.2k
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {visual === "admin" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {adminRows.map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-2xl border p-4 ${styles.soft} dark:border-transparent`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Control surface
                </p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Stable
                </span>
              </div>
              <div className="space-y-2">
                {[
                  "Departments",
                  "Courses",
                  "Allocations",
                  "Schedules",
                  "Reports",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item}
                    </span>
                    <span
                      className={`h-2.5 w-16 rounded-full ${
                        index % 2 === 0 ? "bg-emerald-400" : "bg-indigo-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PublicVisuals;
