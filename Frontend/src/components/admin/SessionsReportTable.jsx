import React from "react";
import AdminToolbar from "./AdminToolbar";
import AdminTable from "./AdminTable";
import { formatDateTimeShort, calculateAttendancePercent } from "../../utils/formatters";

const SESSION_EMPTY_STATE =
  "No attendance sessions found for the current filters.";

const sessionColumns = [
  {
    header: "Date & Time",
    accessor: "date",
    render: (row) => formatDateTimeShort(row.date),
  },
  {
    header: "Course",
    accessor: "course",
    render: (row) => (
      <div>
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {row.course}
        </span>
        <p className="text-xs text-slate-500">{row.courseCode}</p>
      </div>
    ),
  },
  { header: "Teacher", accessor: "teacher" },
  {
    header: "Class",
    accessor: "class",
    render: (row) =>
      `${row.department} Sem-${row.semester} Sec-${row.section}`,
  },
  {
    header: "Attendance",
    accessor: "att",
    render: (row) => {
      const attendancePercent = calculateAttendancePercent(row.present, row.total);

      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-full max-w-[60px] rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${attendancePercent}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">
            {row.present}/{row.total}
          </span>
        </div>
      );
    },
  },
];

const SessionsReportTable = ({
  sessionSearch,
  setSessionSearch,
  filterSessionCourse,
  setFilterSessionCourse,
  filterSessionTeacher,
  setFilterSessionTeacher,
  filterSessionDate,
  setFilterSessionDate,
  sessionCourseOptions,
  sessionTeacherOptions,
  filteredSessions,
  loading,
  openSessionModal,
}) => {
  return (
    <div className="animate-in space-y-4 fade-in slide-in-from-bottom-2">
      <AdminToolbar
        searchProps={{
          value: sessionSearch,
          onChange: setSessionSearch,
          placeholder: "Search by course, code, or teacher...",
        }}
        filters={[
          {
            label: "Course",
            value: filterSessionCourse,
            onChange: setFilterSessionCourse,
            options: sessionCourseOptions,
          },
          {
            label: "Teacher",
            value: filterSessionTeacher,
            onChange: setFilterSessionTeacher,
            options: sessionTeacherOptions,
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-xs font-semibold text-slate-500 dark:text-slate-400">
              Date
            </label>
            <input
              type="date"
              value={filterSessionDate}
              onChange={(e) => setFilterSessionDate(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        }
      />
      <AdminTable
        columns={sessionColumns}
        data={loading ? [] : filteredSessions}
        emptyMessage={
          loading ? "Loading sessions..." : SESSION_EMPTY_STATE
        }
        actions={(row) => (
          <button
            onClick={() => openSessionModal(row)}
            className="rounded bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
          >
            View Detail
          </button>
        )}
      />
    </div>
  );
};

export default SessionsReportTable;
