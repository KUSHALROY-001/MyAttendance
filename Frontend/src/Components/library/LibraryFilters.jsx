import React from "react";

export default function LibraryFilters({
  filters,
  handleFilterChange,
  clearFilters,
  departments,
  semesters,
  subjects,
  inputClass,
  labelClass,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#222228] dark:bg-[#151518] sm:grid-cols-2 md:grid-cols-4">
      <div>
        <label className={`${labelClass} mb-1`}>Department</label>
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className={inputClass}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={`${labelClass} mb-1`}>Semester</label>
        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className={inputClass}
        >
          <option value="">All Semesters</option>
          {semesters.map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={`${labelClass} mb-1`}>Subject</label>
        <select
          name="subjectName"
          value={filters.subjectName}
          onChange={handleFilterChange}
          className={inputClass}
          disabled={subjects.length === 0 && !filters.subjectName}
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          onClick={clearFilters}
          className="h-[38px] w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-[#1C1C20] dark:text-slate-200 dark:hover:bg-[#26262B]"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
