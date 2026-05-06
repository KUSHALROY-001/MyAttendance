const RecentAttendanceList = ({ records }) => {
  const allRecords = [];
  Object.keys(records).forEach((date) => {
    records[date].forEach((rec) => {
      allRecords.push({ ...rec, displayDate: date });
    });
  });

  allRecords.sort(
    (a, b) =>
      new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime(),
  );

  return (
    <div className="lg:col-span-1 flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-2 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        Recent Attendance
      </h2>
      <div className="max-h-[400px] flex-1 space-y-3 overflow-y-auto md:pr-2">
        {allRecords.map((rec, index) => {
          const status = (rec.status || "NO CLASS").toUpperCase();
          const course = rec.course || null;

          return (
            <div
              key={`${rec.displayDate}-${index}`}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors ${
                status === "PRESENT"
                  ? "border-green-100 bg-green-50/50 dark:border-green-500/20 dark:bg-green-500/10"
                  : status === "LATE"
                    ? "border-orange-100 bg-orange-50/50 dark:border-orange-500/20 dark:bg-orange-500/10"
                    : status === "ABSENT"
                      ? "border-red-100 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/10"
                      : status === "LEAVE"
                        ? "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === "PRESENT"
                      ? "bg-green-500"
                      : status === "LATE"
                        ? "bg-orange-500"
                        : status === "ABSENT"
                          ? "bg-red-500"
                          : status === "LEAVE"
                            ? "bg-gray-500"
                            : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="text-[1rem] font-bold leading-tight text-slate-900 dark:text-slate-100">
                    {course?.name || "-"}
                  </p>
                  <p className="mt-0.5 text-[13px] uppercase tracking-tighter text-slate-400 dark:text-slate-500">
                    {course?.code || ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-[12px] font-black uppercase tracking-widest ${
                    status === "PRESENT"
                      ? "text-green-600"
                      : status === "LATE"
                        ? "text-orange-600"
                        : status === "ABSENT"
                          ? "text-red-600"
                          : "text-gray-500"
                  }`}
                >
                  {status}
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-slate-400 dark:text-slate-500">
                  {new Date(rec.displayDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        {allRecords.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
            No recent records.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentAttendanceList;
