import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { AttendanceStatusBadge } from "../components/common/AttendanceSessionModal";
import { useCalendar } from "./useCalendar";
import { useAuth } from "../contexts/AuthContext";

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [stuData, setStuData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);

  useEffect(() => {
    if (!user?.profile?.rollNumber) return;
    axios
      .get(`/api/student/dashboard/${user.profile.rollNumber}`, {
        hideGlobalToast: true,
      })
      .then((res) => setStuData(res.data))
      .catch((err) => {
        setFetchError({
          status: err.response?.status || 500,
          message:
            err.response?.data?.message || "Failed to load dashboard data",
        });
      });
  }, [user?.profile?.rollNumber]);

  const openCourseModal = async (courseCode) => {
    if (!stuData?.rollNumber) return;

    setSelectedCourseCode(courseCode);
    setCourseDetail(null);
    setCourseDetailLoading(true);

    try {
      const res = await axios.get(`/api/student/course/${courseCode}`);
      setCourseDetail(res.data);
    } catch (error) {
      console.error("Failed to load course detail", error);
      setSelectedCourseCode(null);
    } finally {
      setCourseDetailLoading(false);
    }
  };

  const closeCourseModal = () => {
    setSelectedCourseCode(null);
    setCourseDetail(null);
    setCourseDetailLoading(false);
  };

  const summaries = useMemo(() => stuData?.summaries ?? [], [stuData]);

  const attendanceByDate = useMemo(() => {
    const map = {};
    stuData?.attendance?.forEach((record) => {
      const d = new Date(record.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      (map[key] ??= []).push(record);
    });
    return map;
  }, [stuData]);

  const { calendarMonth, calendarDays, goToPreviousMonth, goToNextMonth } =
    useCalendar(attendanceByDate);

  const {
    lowAttendanceSubjects,
    overallAttended,
    overallTotal,
    overallPercentage,
  } = useMemo(() => {
    const low = summaries.filter((subject) => subject.percentage < 75);
    const attended = summaries.reduce(
      (acc, subject) => acc + subject.attendedClasses,
      0,
    );
    const total = summaries.reduce(
      (acc, subject) => acc + subject.totalClasses,
      0,
    );
    return {
      lowAttendanceSubjects: low,
      overallAttended: attended,
      overallTotal: total,
      overallPercentage: total > 0 ? (attended / total) * 100 : 0,
    };
  }, [summaries]);

  const safeUserName = stuData?.user?.name?.split(" ")[0] ?? "Student";
  const enrollmentNo = stuData?.rollNumber ?? "-";
  const department = stuData?.department ?? "-";
  const semester = stuData?.batch ?? "-";
  const classRoutineSubtitle = `${stuData?.department || "-"} • Semester ${
    stuData?.semester || "-"
  } • Section ${stuData?.section || "-"}`;

  const courseModalDetail = useMemo(() => {
    if (!courseDetail) return null;

    const records = (courseDetail.attendance || []).slice().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const lateCount = records.filter(
      (record) => record.status?.toUpperCase() === "LATE",
    ).length;
    const absentCount = records.filter(
      (record) => record.status?.toUpperCase() === "ABSENT",
    ).length;

    return {
      summary: {
        title: courseDetail.courseSummary.courseName,
        subtitle: courseDetail.courseSummary.courseCode,
        meta: `${department} • ${semester} • ${records.length} record(s)`,
        metrics: [
          {
            label: "Attendance",
            value: `${courseDetail.courseSummary.percentage.toFixed(1)}%`,
            tone:
              courseDetail.courseSummary.percentage < 75 ? "danger" : "success",
          },
          {
            label: "Attended",
            value: courseDetail.courseSummary.attendedClasses,
            tone: "success",
          },
          {
            label: "Absent",
            value: absentCount,
            tone: "danger",
          },
          { label: "Late", value: lateCount, tone: "warning" },
        ],
      },
      listTitle: "Attendance by Date",
      rows: records,
      emptyMessage: "No attendance records found for this course.",
      renderRow: (record) => (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(record.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-slate-500">
              {record.teacher?.name || "Instructor"}
            </p>
          </div>
          <AttendanceStatusBadge status={record.status} />
        </div>
      ),
    };
  }, [courseDetail, department, semester]);

  return {
    stuData,
    fetchError,
    summaries,
    attendanceByDate,
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
    selectedCourseCode,
    courseDetail,
    courseDetailLoading,
    courseModalDetail,
    openCourseModal,
    closeCourseModal,
  };
};
