import React, { useEffect, useMemo, useState } from "react";
import AdminTable from "./Component/AdminTable";
import AdminToolbar from "./Component/AdminToolbar";
import api from "../../../api/axios";
import AttendanceSessionModal, {
  AttendanceStatusBadge,
} from "../../UI/AttendanceSessionModal";

const SESSION_EMPTY_STATE =
  "No attendance sessions found for the current filters.";
const DEFAULTER_EMPTY_STATE = "No defaulters found for the current filters.";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [departments, setDepartments] = useState([]);
  const [dept, setDept] = useState("BCA");
  const [sem, setSem] = useState(1);
  const [sec, setSec] = useState("");
  const [sessionSearch, setSessionSearch] = useState("");
  const [filterSessionCourse, setFilterSessionCourse] = useState("");
  const [filterSessionTeacher, setFilterSessionTeacher] = useState("");
  const [filterSessionDate, setFilterSessionDate] = useState("");
  const [defaulterSearch, setDefaulterSearch] = useState("");
  const [filterDefaulterCourse, setFilterDefaulterCourse] = useState("");
  const [filterDefaulterDept, setFilterDefaulterDept] = useState("");
  const [sessions, setSessions] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [sessionDetailLoading, setSessionDetailLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/admin/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to load departments for admin reports.", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      const params = {};
      const sessionParams = {};
      if (dept) params.department = dept;
      if (sem) params.semester = sem;
      if (sec) params.section = sec;
      if (dept) sessionParams.department = dept;
      if (sem) sessionParams.semester = sem;
      if (sec) sessionParams.section = sec;
      if (filterSessionDate) sessionParams.date = filterSessionDate;

      try {
        const [sessionsRes, defaultersRes] = await Promise.all([
          api.get("/api/admin/reports/sessions", { params: sessionParams }),
          api.get("/api/admin/reports/defaulters", { params }),
        ]);

        setSessions(sessionsRes.data);
        setDefaulters(defaultersRes.data);
      } catch (error) {
        console.error("Failed to load admin report data.", error);
        setSessions([]);
        setDefaulters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dept, sem, sec, filterSessionDate]);

  const openSessionModal = async (session) => {
    setSelectedSession(session);
    setSessionDetail(null);
    setSessionDetailLoading(true);

    try {
      const res = await api.get(`/api/admin/reports/sessions/${session.id}`);
      setSessionDetail(res.data);
    } catch (error) {
      console.error("Failed to load session detail.", error);
      setSelectedSession(null);
    } finally {
      setSessionDetailLoading(false);
    }
  };

  const closeSessionModal = () => {
    setSelectedSession(null);
    setSessionDetail(null);
    setSessionDetailLoading(false);
  };

  const currentDept = departments.find((department) => department.code === dept);
  const semOptions =
    currentDept?.semesterDetails.map((semesterItem) => semesterItem.semester) ||
    [];
  const secOptions =
    currentDept?.semesterDetails.find(
      (semesterItem) => semesterItem.semester.toString() === sem.toString(),
    )?.sections || [];

  const sessionCourseOptions = useMemo(
    () => [...new Set(sessions.map((session) => session.course))],
    [sessions],
  );
  const sessionTeacherOptions = useMemo(
    () => [...new Set(sessions.map((session) => session.teacher))],
    [sessions],
  );
  const defaulterCourseOptions = useMemo(
    () => [...new Set(defaulters.map((defaulter) => defaulter.course))],
    [defaulters],
  );
  const defaulterDeptOptions = useMemo(
    () => [...new Set(defaulters.map((defaulter) => defaulter.department))],
    [defaulters],
  );

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const normalizedSearch = sessionSearch.toLowerCase();
        const matchesSearch =
          session.course.toLowerCase().includes(normalizedSearch) ||
          session.teacher.toLowerCase().includes(normalizedSearch) ||
          session.courseCode.toLowerCase().includes(normalizedSearch);
        const matchesCourse = filterSessionCourse
          ? session.course === filterSessionCourse
          : true;
        const matchesTeacher = filterSessionTeacher
          ? session.teacher === filterSessionTeacher
          : true;

        return matchesSearch && matchesCourse && matchesTeacher;
      }),
    [sessions, sessionSearch, filterSessionCourse, filterSessionTeacher],
  );

  const filteredDefaulters = useMemo(
    () =>
      defaulters.filter((defaulter) => {
        const normalizedSearch = defaulterSearch.toLowerCase();
        const matchesSearch =
          defaulter.name.toLowerCase().includes(normalizedSearch) ||
          defaulter.rollNumber.toLowerCase().includes(normalizedSearch) ||
          defaulter.course.toLowerCase().includes(normalizedSearch);
        const matchesCourse = filterDefaulterCourse
          ? defaulter.course === filterDefaulterCourse
          : true;
        const matchesDept = filterDefaulterDept
          ? defaulter.department === filterDefaulterDept
          : true;

        return matchesSearch && matchesCourse && matchesDept;
      }),
    [defaulters, defaulterSearch, filterDefaulterCourse, filterDefaulterDept],
  );

  const sessionModalDetail = useMemo(() => {
    if (!sessionDetail) return null;

    const absentCount = sessionDetail.total - sessionDetail.present;
    const lateCount =
      sessionDetail.students?.filter((student) => student.status === "LATE")
        .length || 0;

    return {
      summary: {
        title: sessionDetail.courseName,
        subtitle: `${sessionDetail.courseCode} • ${sessionDetail.teacherName}`,
        meta: `${new Date(sessionDetail.date).toLocaleString()} • ${sessionDetail.department} Sem-${sessionDetail.semester} Sec-${sessionDetail.section}`,
        metrics: [
          { label: "Present", value: sessionDetail.present, tone: "success" },
          { label: "Absent", value: absentCount, tone: "danger" },
          { label: "Late", value: lateCount, tone: "warning" },
        ],
      },
      listTitle: "Student Attendance List",
      rows: sessionDetail.students,
      emptyMessage: "No student records found for this session.",
      renderRow: (student) => (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {student.name}
            </p>
            <p className="text-xs font-mono text-slate-500">
              {student.rollNumber}
            </p>
          </div>
          <AttendanceStatusBadge status={student.status} />
        </div>
      ),
    };
  }, [sessionDetail]);

  const sessionColumns = [
    {
      header: "Date & Time",
      accessor: "date",
      render: (row) =>
        new Date(row.date).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        }),
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
        const attendancePercent =
          row.total > 0 ? Math.round((row.present / row.total) * 100) : 0;

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

  return (
    <div className="animate-in space-y-6 fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Attendance Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review attendance sessions by day and track attendance defaulters.
        </p>
      </div>

      <AdminToolbar
        filters={[
          {
            label: "Dept",
            value: dept,
            onChange: (value) => {
              setDept(value);
              setSem("");
              setSec("");
              setFilterDefaulterDept("");
            },
            options: departments.map((department) => department.code),
          },
          {
            label: "Sem",
            value: sem,
            onChange: (value) => {
              setSem(value);
              setSec("");
            },
            field: "Sem",
            options: semOptions,
          },
          {
            label: "Sec",
            value: sec,
            onChange: setSec,
            field: "Sec",
            options: secOptions,
          },
        ]}
      />

      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === "sessions"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setActiveTab("defaulters")}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === "defaulters"
                ? "border-red-500 text-red-600 dark:text-red-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Defaulters List
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {filteredDefaulters.length}
            </span>
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "sessions" ? (
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
        ) : (
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
        )}
      </div>

      <AttendanceSessionModal
        isOpen={!!selectedSession}
        onClose={closeSessionModal}
        title="Session Roster"
        loading={sessionDetailLoading}
        errorMessage="Unable to load this session detail."
        detail={sessionModalDetail}
      />
    </div>
  );
};

export default AdminReports;
