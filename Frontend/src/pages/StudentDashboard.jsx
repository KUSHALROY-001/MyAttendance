import { useStudentDashboard } from "../hooks/useStudentDashboard.jsx";
import PremiumErrorState from "../components/common/PremiumErrorState";
import StudentDashboardSkeleton from "../components/common/skeletons/StudentDashboardSkeleton";
import ClassRoutineTable from "../components/common/ClassRoutineTable";
import AttendanceSessionModal from "../components/common/AttendanceSessionModal";
import StudentDashHeader from "../components/student/StudentDashHeader";
import LowAttendanceWarning from "../components/student/LowAttendanceWarning";
import StudentStatCards from "../components/student/StudentStatCards";
import CalendarAndStats from "../components/student/CalendarAndStats";
import CourseGrid from "../components/student/CourseGrid";
import RecentAttendanceList from "../components/student/RecentAttendanceList";

const StudentDashboard = () => {
  const {
    stuData,
    fetchError,
    summaries,
    calendarMonth,
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
    lowAttendanceSubjects,
    overallAttended,
    overallTotal,
    overallPercentage,
    safeUserName,
    enrollmentNo,
    department,
    semester,
    classRoutineSubtitle,
    attendanceByDate,
    selectedCourseCode,
    courseDetailLoading,
    courseModalDetail,
    openCourseModal,
    closeCourseModal,
  } = useStudentDashboard();

  if (fetchError) {
    return (
      <PremiumErrorState
        title={fetchError.status === 404 ? "Student Not Found" : "System Error"}
        message={fetchError.message}
        errorCode={
          fetchError.status === 404 ? "404" : fetchError.status.toString()
        }
      />
    );
  }

  if (!stuData) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="mx-4 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-6xl animate-fadeIn space-y-6 pb-12">
        <StudentDashHeader
          safeUserName={safeUserName}
          enrollmentNo={enrollmentNo}
          department={department}
          semester={semester}
        />

        <LowAttendanceWarning lowAttendanceSubjects={lowAttendanceSubjects} />

        <StudentStatCards
          overallPercentage={overallPercentage}
          enrolledCoursesCount={stuData.courses?.length}
          overallAttended={overallAttended}
          overallTotal={overallTotal}
          lowAttendanceCount={lowAttendanceSubjects.length}
        />

        <CalendarAndStats
          calendarMonth={calendarMonth}
          calendarDays={calendarDays}
          goToPreviousMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
          summaries={summaries}
        />

        <ClassRoutineTable
          title="Class Routine"
          subtitle={classRoutineSubtitle}
          periods={stuData?.classRoutine?.periods || []}
          entries={stuData?.classRoutine?.entries || []}
          emptyMessage="No class routine has been published for your section yet."
        />

        <CourseGrid summaries={summaries} openCourseModal={openCourseModal} />

        <RecentAttendanceList records={attendanceByDate} />
      </div>

      <AttendanceSessionModal
        isOpen={!!selectedCourseCode}
        onClose={closeCourseModal}
        title="Course Attendance"
        loading={courseDetailLoading}
        errorMessage="Unable to load this course detail."
        detail={courseModalDetail}
      />
    </div>
  );
};

export default StudentDashboard;
