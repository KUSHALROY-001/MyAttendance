import { useState, useMemo, useEffect } from "react";
import TeacherHeader from "./components/TeacherHeader";
import TeacherStats from "./components/TeacherStats";
import TodaysClasses from "./components/TodaysClasses";
import WeeklySchedule from "./components/WeeklySchedule";
import AttendanceSessions from "./components/AttendanceSessions";
import TeacherCourses from "./components/TeacherCourses";
import StartAttendanceModal from "./components/StartAttendanceModal";
import axios from "../../../api/axios";
import AttendanceSessionModal, {
  AttendanceStatusBadge,
} from "../../UI/AttendanceSessionModal";

const TeacherDashboard = () => {
  const teacherId = "EMP-001";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [sessionDetailLoading, setSessionDetailLoading] = useState(false);
  const [selectedCourseAllocationId, setSelectedCourseAllocationId] =
    useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/teacher/dashboard/${teacherId}`);
        setTeacherData(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  const teacherName = useMemo(() => {
    return teacherData?.user?.name
      ? teacherData.user.name.replace("Dr. ", "")
      : "Teacher";
  }, [teacherData]);

  // Derived state from real API
  const { coursesList, totalSessions, thisMonthSessions } = useMemo(() => {
    if (!teacherData?.allocations)
      return { coursesList: [], totalSessions: 0, thisMonthSessions: 0 };

    // Base courses list securely off of the teacher's formal allocations
    // rather than what happens to show up in the recent attendance logs
    const coursesList = teacherData.allocations.map((alloc) => ({
      id: alloc.id,
      allocationId: alloc.id,
      name: alloc.course?.name || "Unknown Course",
      code: alloc.course?.code,
      department: alloc.department,
      semester: `Sem ${alloc.semester}`,
      section: alloc.section,
    }));

    // Directly apply backend optimized SQL counts instead of artificially counting limited array size
    return {
      coursesList,
      totalSessions: teacherData.totalSessions || 0,
      thisMonthSessions: teacherData.thisMonthSessions || 0,
    };
  }, [teacherData]);

  const openSessionModal = async (sessionId) => {
    setSelectedSessionId(sessionId);
    setSessionDetail(null);
    setSessionDetailLoading(true);

    try {
      const res = await axios.get(`/api/teacher/attendance/${sessionId}`);
      setSessionDetail(res.data);
    } catch (error) {
      console.error("Failed to load attendance session detail", error);
      setSelectedSessionId(null);
    } finally {
      setSessionDetailLoading(false);
    }
  };

  const closeSessionModal = () => {
    setSelectedSessionId(null);
    setSessionDetail(null);
    setSessionDetailLoading(false);
  };

  const openCourseModal = async (courseAllocationId) => {
    setSelectedCourseAllocationId(courseAllocationId);
    setCourseDetail(null);
    setCourseDetailLoading(true);

    try {
      const res = await axios.get(
        `/api/teacher/${teacherId}/allocation/${courseAllocationId}/course`,
      );
      setCourseDetail(res.data);
    } catch (error) {
      console.error("Failed to load course attendance detail", error);
      setSelectedCourseAllocationId(null);
    } finally {
      setCourseDetailLoading(false);
    }
  };

  const closeCourseModal = () => {
    setSelectedCourseAllocationId(null);
    setCourseDetail(null);
    setCourseDetailLoading(false);
  };

  const openCourseSessionDetail = async (sessionId) => {
    closeCourseModal();
    await openSessionModal(sessionId);
  };

  const sessionModalDetail = useMemo(() => {
    if (!sessionDetail) return null;

    const rows = sessionDetail.students || [];
    const presentCount = rows.filter(
      (student) =>
        student.status?.toUpperCase() === "PRESENT" ||
        student.status?.toUpperCase() === "LATE",
    ).length;
    const absentCount = rows.filter(
      (student) => student.status?.toUpperCase() === "ABSENT",
    ).length;
    const lateCount = rows.filter(
      (student) => student.status?.toUpperCase() === "LATE",
    ).length;

    return {
      summary: {
        title: sessionDetail.courseName,
        subtitle: sessionDetail.courseCode,
        meta: `${new Date(sessionDetail.date).toLocaleString()} • ${sessionDetail.department} • Sem ${sessionDetail.semester} • Sec ${sessionDetail.section}`,
        metrics: [
          { label: "Present", value: presentCount, tone: "success" },
          { label: "Absent", value: absentCount, tone: "danger" },
          { label: "Late", value: lateCount, tone: "warning" },
          { label: "Total", value: rows.length, tone: "neutral" },
        ],
      },
      listTitle: "Student Attendance List",
      rows,
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

  const courseModalDetail = useMemo(() => {
    if (!courseDetail) return null;

    return {
      summary: {
        title: courseDetail.courseName,
        subtitle: courseDetail.courseCode,
        meta: `${courseDetail.department} • Sem ${courseDetail.semester} • Sec ${courseDetail.section} • ${courseDetail.totalSessions} session(s) recorded`,
        metrics: [
          { label: "Sessions", value: courseDetail.totalSessions, tone: "neutral" },
          {
            label: "Overall Attendance",
            value: `${courseDetail.overallAttendance}%`,
            tone: courseDetail.overallAttendance < 75 ? "danger" : "success",
          },
        ],
      },
      listTitle: "Past Sessions",
      rows: courseDetail.sessions || [],
      emptyMessage: "No attendance sessions found for this course.",
      renderRow: (session) => (
        <button
          type="button"
          onClick={() => openCourseSessionDetail(session.id)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-slate-500">
              {session.department} • Sem {session.semester} • Sec {session.section}
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {session.presentCount}/{session.totalCount}
          </p>
        </button>
      ),
    };
  }, [courseDetail]);

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
