import React from "react";

const ReportsHeader = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Attendance Reports
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Review attendance sessions by day and track attendance defaulters.
      </p>
    </div>
  );
};

export default ReportsHeader;
