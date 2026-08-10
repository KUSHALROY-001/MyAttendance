import { useState, useMemo, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { AttendanceStatusBadge } from "../components/common/AttendanceSessionModal";
import {
  cleanTeacherName,
  transformTeacherAllocations,
} from "../utils/teacherHelpers";

export const useTeacherDashboard = () => {
  const { user } = useAuth();
  const teacherId = user?.profile?.employeeId;
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
    if (!teacherId) return;
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

  const teacherName = useMemo(
    () => cleanTeacherName(teacherData?.user?.name),
    [teacherData],
  );

  const { coursesList, totalSessions, thisMonthSessions } = useMemo(() => {
    if (!teacherData?.allocations)
      return { coursesList: [], totalSessions: 0, thisMonthSessions: 0 };

    const coursesList = transformTeacherAllocations(teacherData.allocations);

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
            <p className="font-medium text-white">{student.name}</p>
            <p className="text-xs font-mono text-slate-200">
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
          {
            label: "Sessions",
            value: courseDetail.totalSessions,
            tone: "neutral",
          },
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
            <p className="font-medium text-white">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-white/70">
              {session.department} • Sem {session.semester} • Sec{" "}
              {session.section}
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {session.presentCount}/{session.totalCount}
          </p>
        </button>
      ),
    };
  }, [courseDetail]);

  return {
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
  };
};

export default useTeacherDashboard;
