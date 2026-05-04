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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-800/40 border border-slate-600/60 p-4 rounded-xl">
      <div>
        <label className={labelClass + " mb-1"}>Department</label>
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
        <label className={labelClass + " mb-1"}>Semester</label>
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
        <label className={labelClass + " mb-1"}>Subject</label>
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
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition h-[38px]"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
