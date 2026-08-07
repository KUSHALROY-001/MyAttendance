import React, { useMemo } from "react";
import AdminToolbar from "../components/admin/AdminToolbar";
import ReportsHeader from "../components/admin/ReportsHeader";
import ReportsTabs from "../components/admin/ReportsTabs";
import SessionsReportTable from "../components/admin/SessionsReportTable";
import DefaultersReportTable from "../components/admin/DefaultersReportTable";
import AttendanceSessionModal, {
  AttendanceStatusBadge,
} from "../components/common/AttendanceSessionModal";
import useAdminReports from "../hooks/useAdminReports";

const AdminReports = () => {
  const {
    activeTab,
    setActiveTab,
    departments,
    dept,
    setDept,
    sem,
    setSem,
    sec,
    setSec,
    sessionSearch,
    setSessionSearch,
    filterSessionCourse,
    setFilterSessionCourse,
    filterSessionTeacher,
    setFilterSessionTeacher,
    filterSessionDate,
    setFilterSessionDate,
    defaulterSearch,
    setDefaulterSearch,
    filterDefaulterCourse,
    setFilterDefaulterCourse,
    filterDefaulterDept,
    setFilterDefaulterDept,
    loading,
    selectedSession,
    sessionDetail,
    sessionDetailLoading,
    semOptions,
    secOptions,
    sessionCourseOptions,
    sessionTeacherOptions,
    defaulterCourseOptions,
    defaulterDeptOptions,
    filteredSessions,
    filteredDefaulters,
    openSessionModal,
    closeSessionModal,
  } = useAdminReports();

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

  return (
    <div className="animate-in space-y-6 fade-in duration-300">
      <ReportsHeader />

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

      <ReportsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        defaultersCount={filteredDefaulters.length}
      />

      <div className="mt-4">
        {activeTab === "sessions" ? (
          <SessionsReportTable
            sessionSearch={sessionSearch}
            setSessionSearch={setSessionSearch}
            filterSessionCourse={filterSessionCourse}
            setFilterSessionCourse={setFilterSessionCourse}
            filterSessionTeacher={filterSessionTeacher}
            setFilterSessionTeacher={setFilterSessionTeacher}
            filterSessionDate={filterSessionDate}
            setFilterSessionDate={setFilterSessionDate}
            sessionCourseOptions={sessionCourseOptions}
            sessionTeacherOptions={sessionTeacherOptions}
            filteredSessions={filteredSessions}
            loading={loading}
            openSessionModal={openSessionModal}
          />
        ) : (
          <DefaultersReportTable
            defaulterSearch={defaulterSearch}
            setDefaulterSearch={setDefaulterSearch}
            filterDefaulterCourse={filterDefaulterCourse}
            setFilterDefaulterCourse={setFilterDefaulterCourse}
            filterDefaulterDept={filterDefaulterDept}
            setFilterDefaulterDept={setFilterDefaulterDept}
            defaulterCourseOptions={defaulterCourseOptions}
            defaulterDeptOptions={defaulterDeptOptions}
            filteredDefaulters={filteredDefaulters}
            loading={loading}
          />
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
