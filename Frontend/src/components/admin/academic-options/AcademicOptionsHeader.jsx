import React from "react";
import { Layers, Plus } from "lucide-react";

const AcademicOptionsHeader = ({ isSuperAdmin, onAddDepartment }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Academic Options
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage departments, semesters, and section allocations across the institute.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddDepartment}
        disabled={!isSuperAdmin}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="w-5 h-5 mr-1.5" />
        Add Department
      </button>
    </div>
  );
};

export default AcademicOptionsHeader;
