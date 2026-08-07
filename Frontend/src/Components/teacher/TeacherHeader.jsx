import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";

const TeacherHeader = ({ teacherName, onStartAttendance }) => {
  return (
    <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Welcome back, {teacherName}
          </h1>
          <Link
            to="/profile/edit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            aria-label="Edit profile"
          >
            <Pencil size={16} />
          </Link>
        </div>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          Manage your classes and track attendance
        </p>
      </div>
      <button
        onClick={onStartAttendance}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Start Attendance
      </button>
    </div>
  );
};

export default TeacherHeader;
