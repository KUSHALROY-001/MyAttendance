import React, { useState } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import AdminToolbar from "./Component/AdminToolbar";
import { mockSessions, mockDefaulters } from "../../../data/adminMockData";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [sessionSearch, setSessionSearch] = useState("");
  const [filterSessionCourse, setFilterSessionCourse] = useState("");
  const [filterSessionTeacher, setFilterSessionTeacher] = useState("");

  const [defaulterSearch, setDefaulterSearch] = useState("");
  const [filterDefaulterCourse, setFilterDefaulterCourse] = useState("");
  const [filterDefaulterDept, setFilterDefaulterDept] = useState("");

  const [selectedSession, setSelectedSession] = useState(null);

  // Tab 1: Sessions
  const filteredSessions = mockSessions.filter((s) => {
    const matchesSearch =
      s.course.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      s.teacher.toLowerCase().includes(sessionSearch.toLowerCase());
    const matchesCourse = filterSessionCourse
      ? s.course === filterSessionCourse
      : true;
    const matchesTeacher = filterSessionTeacher
      ? s.teacher === filterSessionTeacher
      : true;
    return matchesSearch && matchesCourse && matchesTeacher;
  });

  const sessionColumns = [
    {
      header: "Date & Time",
      accessor: "date",
      render: (r) =>
        new Date(r.date).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      header: "Course",
      accessor: "course",
      render: (r) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {r.course}
        </span>
      ),
    },
    { header: "Teacher", accessor: "teacher" },
    {
      header: "Class",
      accessor: "class",
      render: (r) => `${r.department} ${r.section || r.semester}`,
    },
    {
      header: "Attendance",
      accessor: "att",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[60px]">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${(r.present / r.total) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">
            {r.present}/{r.total}
          </span>
        </div>
      ),
    },
  ];

  // Tab 2: Defaulters
  const filteredDefaulters = mockDefaulters.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(defaulterSearch.toLowerCase()) ||
      d.rollNumber.toLowerCase().includes(defaulterSearch.toLowerCase());
    const matchesCourse = filterDefaulterCourse
      ? d.course === filterDefaulterCourse
      : true;
    const matchesDept = filterDefaulterDept
      ? d.department === filterDefaulterDept
      : true;
    return matchesSearch && matchesCourse && matchesDept;
  });

  const defaulterColumns = [
    {
      header: "Roll Num",
      accessor: "rollNumber",
      render: (r) => (
        <span className="font-mono text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
          {r.rollNumber}
        </span>
      ),
    },
    {
      header: "Student",
      accessor: "name",
      render: (r) => <span className="font-semibold">{r.name}</span>,
    },
    { header: "Department", accessor: "department" },
    { header: "Course", accessor: "course" },
    {
      header: "Attendance",
      accessor: "percentage",
      render: (r) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ring-1 ring-inset ${
            r.percentage >= 75
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20"
              : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-red-600/20"
          }`}
        >
          {r.percentage}% ({r.attended}/{r.total})
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Attendance Reports
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review historical sessions and track attendance defaulters.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === "sessions"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setActiveTab("defaulters")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
              ${
                activeTab === "defaulters"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
          >
            Defaulters List
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-0.5 px-2 rounded-full text-[10px] font-bold">
              {mockDefaulters.filter((d) => d.percentage < 75).length}
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "sessions" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <AdminToolbar
              searchProps={{
                value: sessionSearch,
                onChange: setSessionSearch,
                placeholder: "Filter by course or teacher...",
              }}
              filters={[
                {
                  label: "Course",
                  value: filterSessionCourse,
                  onChange: setFilterSessionCourse,
                  options: [...new Set(mockSessions.map((s) => s.course))],
                },
                {
                  label: "Teacher",
                  value: filterSessionTeacher,
                  onChange: setFilterSessionTeacher,
                  options: [...new Set(mockSessions.map((s) => s.teacher))],
                },
              ]}
            />
            <AdminTable
              columns={sessionColumns}
              data={filteredSessions}
              actions={(row) => (
                <button
                  onClick={() => setSelectedSession(row)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded transition"
                >
                  View Detail
                </button>
              )}
            />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
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
                  options: [...new Set(mockDefaulters.map((d) => d.course))],
                },
                {
                  label: "Dept",
                  value: filterDefaulterDept,
                  onChange: setFilterDefaulterDept,
                  options: [
                    ...new Set(mockDefaulters.map((d) => d.department)),
                  ],
                },
              ]}
            />
            <AdminTable columns={defaulterColumns} data={filteredDefaulters} />
          </div>
        )}
      </div>

      <AdminModal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title="Session Roster"
      >
        {selectedSession && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedSession.course}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(selectedSession.date).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedSession.present} Present
                </p>
                <p className="text-xs text-slate-500">
                  {selectedSession.total - selectedSession.present} Absent
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center py-8">
              Detailed student list for this session would appear here...
            </p>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminReports;
