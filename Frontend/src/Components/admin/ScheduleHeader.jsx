import React from "react";

const ScheduleHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Class Timetable
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Build weekly schedules for each class section.
        </p>
      </div>
    </div>
  );
};

export default ScheduleHeader;
