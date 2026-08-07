import TeacherHeader from "../components/teacher/TeacherHeader";
import TeacherStats from "../components/teacher/TeacherStats";
import TodaysClasses from "../components/teacher/TodaysClasses";
import WeeklySchedule from "../components/teacher/WeeklySchedule";
import AttendanceSessions from "../components/teacher/AttendanceSessions";
import TeacherCourses from "../components/teacher/TeacherCourses";
import StartAttendanceModal from "../components/teacher/StartAttendanceModal";
import AttendanceSessionModal from "../components/common/AttendanceSessionModal";
import useTeacherDashboard from "../hooks/useTeacherDashboard.jsx";

const TeacherDashboard = () => {
  const {
    teacherData,
    loading,
    teacherName,
    coursesList,
    totalSessions,
    thisMonthSessions,
    isModalOpen,
    setIsModalOpen,
    openSessionModal,
    closeSessionModal,
    selectedSessionId,
    sessionDetailLoading,
    sessionModalDetail,
    openCourseModal,
    closeCourseModal,
    selectedCourseAllocationId,
    courseDetailLoading,
    courseModalDetail,
  } = useTeacherDashboard();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-4 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12 mt-6">
        <TeacherHeader
          teacherName={teacherName}
          onStartAttendance={() => setIsModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-6">
          <TodaysClasses routine={teacherData?.weeklyRoutine} />
          <WeeklySchedule routine={teacherData?.weeklyRoutine} />
          <TeacherStats
            totalCourses={coursesList.length}
            totalSessions={totalSessions}
            thisMonthSessions={thisMonthSessions}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col">
              <TeacherCourses
                courses={coursesList}
                onCourseClick={openCourseModal}
              />
            </div>
            <div className="lg:col-span-2 flex flex-col">
              <AttendanceSessions
                sessions={teacherData?.recentAttendance || []}
                onSessionClick={openSessionModal}
              />
            </div>
          </div>
        </div>
      </div>

      <StartAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allocations={teacherData?.allocations || []}
      />

      <AttendanceSessionModal
        isOpen={!!selectedCourseAllocationId}
        onClose={closeCourseModal}
        title="Course Attendance History"
        loading={courseDetailLoading}
        errorMessage="Unable to load this course history."
        detail={courseModalDetail}
      />

      <AttendanceSessionModal
        isOpen={!!selectedSessionId}
        onClose={closeSessionModal}
        title="Session Details"
        loading={sessionDetailLoading}
        errorMessage="Unable to load this attendance session."
        detail={sessionModalDetail}
      />
    </div>
  );
};

export default TeacherDashboard;
