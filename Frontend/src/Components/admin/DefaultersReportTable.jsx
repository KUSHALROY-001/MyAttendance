import React from "react";
import AdminToolbar from "./AdminToolbar";
import AdminTable from "./AdminTable";

const DEFAULTER_EMPTY_STATE = "No defaulters found for the current filters.";

const defaulterColumns = [
  {
    header: "Roll Num",
    accessor: "rollNumber",
    render: (row) => (
      <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs font-semibold dark:bg-slate-800">
        {row.rollNumber}
      </span>
    ),
  },
  {
    header: "Student",
    accessor: "name",
    render: (row) => (
      <div>
        <span className="font-semibold">{row.name}</span>
        <p className="text-xs text-slate-500">{row.email}</p>
      </div>
    ),
  },
  {
    header: "Department",
    accessor: "department",
    render: (row) =>
      `${row.department} Sem-${row.semester} Sec-${row.section}`,
  },
  {
    header: "Course",
    accessor: "course",
    render: (row) => (
      <div>
        <span>{row.course}</span>
        <p className="text-xs text-slate-500">{row.courseCode}</p>
      </div>
    ),
  },
  {
    header: "Attendance",
    accessor: "percentage",
    render: (row) => (
      <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400">
        {row.percentage}% ({row.attended}/{row.total})
      </span>
    ),
  },
];

const DefaultersReportTable = ({
  defaulterSearch,
  setDefaulterSearch,
  filterDefaulterCourse,
  setFilterDefaulterCourse,
  filterDefaulterDept,
  setFilterDefaulterDept,
  defaulterCourseOptions,
  defaulterDeptOptions,
  filteredDefaulters,
  loading,
}) => {
  return (
    <div className="animate-in space-y-4 fade-in slide-in-from-bottom-2">
      <AdminToolbar
        searchProps={{
          value: defaulterSearch,
          onChange: setDefaulterSearch,
          placeholder: "Filter defaulters...",
        }}
        filters={[
          {
            label: "Course",
            value: filterDefaulterCourse,
            onChange: setFilterDefaulterCourse,
            options: defaulterCourseOptions,
          },
          {
            label: "Dept",
            value: filterDefaulterDept,
            onChange: setFilterDefaulterDept,
            options: defaulterDeptOptions,
          },
        ]}
      />
      <AdminTable
        columns={defaulterColumns}
        data={loading ? [] : filteredDefaulters}
        emptyMessage={
          loading ? "Loading defaulters..." : DEFAULTER_EMPTY_STATE
        }
      />
    </div>
  );
};

export default DefaultersReportTable;
