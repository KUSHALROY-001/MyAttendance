const QuickStats = ({ summaries }) => {
  return (
    <div className="lg:col-span-1 flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-slate-100">
        Quick Stats
      </h2>
      <div className="flex-grow space-y-6">
        {summaries.map((subject, idx) => {
          const isLow = subject.percentage < 75;
          return (
            <div
              key={idx}
              className="mx-[-0.5rem] flex items-center justify-between rounded-lg px-2 py-1 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div>
                <p className="mb-1 text-[15px] font-bold leading-tight text-slate-900 dark:text-slate-100">
                  {subject.courseCode}
                </p>
                <p className="text-[13px] leading-tight text-slate-500 dark:text-slate-400">
                  {subject.courseName}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-[17px] font-bold tracking-tight ${
                    isLow ? "text-[#e63946]" : "text-emerald-600"
                  }`}
                >
                  {subject.percentage.toFixed(0)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
