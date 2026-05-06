import React from "react";
import { PlusSVG } from "../../../UI/SVG";

const TeacherHeader = ({ teacherName, onStartAttendance }) => {
  return (
    <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Welcome back, {teacherName}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          Manage your classes and track attendance
        </p>
      </div>
      <button
        onClick={onStartAttendance}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <PlusSVG className="mr-2 h-4 w-4" />
        Start Attendance
      </button>
    </div>
  );
};

export default TeacherHeader;
