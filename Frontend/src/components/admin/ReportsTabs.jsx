import React from "react";

const ReportsTabs = ({ activeTab, setActiveTab, defaultersCount = 0 }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
            activeTab === "sessions"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          All Sessions
        </button>
        <button
          onClick={() => setActiveTab("defaulters")}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
            activeTab === "defaulters"
              ? "border-red-500 text-red-600 dark:text-red-400"
              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          Defaulters List
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {defaultersCount}
          </span>
        </button>
      </nav>
    </div>
  );
};

export default ReportsTabs;
