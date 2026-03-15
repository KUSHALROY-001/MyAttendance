import React from "react";

const QuickStats = ({ summaries }) => {
  return (
    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h2>
      <div className="space-y-6 flex-grow">
        {summaries.map((subject, idx) => {
          const isLow = subject.percentage < 75;
          return (
            <div key={idx} className="flex justify-between items-center transition-all hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg">
              <div>
                <p className="text-[15px] font-bold text-gray-900 leading-tight mb-1">
                  {subject.courseCode}
                </p>
                <p className="text-[13px] text-slate-500 leading-tight">
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
