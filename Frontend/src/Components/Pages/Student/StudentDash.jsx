import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../api/axios";
import { useLocation } from "react-router-dom";
import PremiumErrorState from "../../UI/PremiumErrorState";
import AttendanceCalendar from "./Component/AttendanceCalendar";
import CourseCard from "./Component/CourseCard";
import RecentAttendanceList from "./Component/RecentAttendanceList";
import QuickStats from "./Component/QuickStats";
import StatCard from "../../UI/StatCard";
import LoadingAnimation from "../../UI/LoadingAnimation";
import ClassRoutineTable from "../../UI/ClassRoutineTable";
import AttendanceSessionModal, {
  AttendanceStatusBadge,
} from "../../UI/AttendanceSessionModal";
import {
  ExclamationCircleSVG,
  CrossSVG,
  CalendarSVG,
  StackSVG,
  ChartSVG,
} from "../../UI/SVG";
import { useCalendar } from "../../../hooks/useCalendar";

const StudentDashboard = () => {
  const location = useLocation();
  const [stuData, setStuData] = useState(location.state?.user || null);
  const [fetchError, setFetchError] = useState(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);

  useEffect(() => {
    if (stuData) return;
    axios
      .get("/api/student/dashboard/BCA-002", { hideGlobalToast: true })
      .then((res) => setStuData(res.data))
      .catch((err) => {
        setFetchError({
          status: err.response?.status || 500,
          message:
            err.response?.data?.message || "Failed to load dashboard data",
        });
      });
  }, [stuData]);

  const openCourseModal = async (courseCode) => {
    if (!stuData?.rollNumber) return;

    setSelectedCourseCode(courseCode);
    setCourseDetail(null);
    setCourseDetailLoading(true);

    try {
      const res = await axios.get(
        `/api/student/course/${courseCode}?rollNumber=${stuData.rollNumber}`,
      );
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
    return <LoadingAnimation />;
  }

  return (
    <div className="mx-4 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-6xl animate-fadeIn space-y-6 pb-12">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {safeUserName}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Enrollment: {enrollmentNo} • {department} • {semester}
          </p>
        </div>

        {lowAttendanceSubjects.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100">
            <div className="mb-4 flex items-center space-x-2">
              <ExclamationCircleSVG className="h-5 w-5 text-red-600" />
              <span className="text-sm font-bold uppercase tracking-tight">
                Low Attendance Warning
              </span>
            </div>
            <p className="mb-4 text-sm font-medium">
              You have low attendance (&lt;75%) in{" "}
              {lowAttendanceSubjects.length} subject(s):
            </p>
            <div className="mb-4 space-y-2">
              {lowAttendanceSubjects.map((subject) => (
                <div
                  key={subject.courseCode}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <CrossSVG className="h-4 w-4 rotate-45 text-red-400" />
                    <span className="font-bold text-red-700">
                      {subject.courseName}
                    </span>
                    <span className="text-red-400 dark:text-red-300">
                      ({subject.courseCode})
                    </span>
                  </div>
                  <span className="font-black">
                    {subject.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-500 dark:text-red-300">
              Maintain at least 75% attendance to be eligible for examinations.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="OVERALL ATTENDANCE"
            value={`${overallPercentage.toFixed(1)}%`}
            icon={<ChartSVG />}
          />
          <StatCard
            title="ENROLLED COURSES"
            value={stuData.courses?.length}
            icon={<StackSVG />}
          />
          <StatCard
            title="CLASSES ATTENDED"
            value={`${overallAttended} of ${overallTotal}`}
            icon={<CalendarSVG />}
          />
          <StatCard
            title="LOW ATTENDANCE"
            value={lowAttendanceSubjects.length.toString()}
            icon={<ExclamationCircleSVG />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceCalendar
              month={calendarMonth}
              days={calendarDays}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
            />
          </div>
          <QuickStats summaries={summaries} />
        </div>

        <ClassRoutineTable
          title="Class Routine"
          subtitle={classRoutineSubtitle}
          periods={stuData?.classRoutine?.periods || []}
          entries={stuData?.classRoutine?.entries || []}
          emptyMessage="No class routine has been published for your section yet."
        />

        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            My Courses
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {summaries.map((course) => (
              <CourseCard
                key={course.courseCode}
                course={course}
                onClick={openCourseModal}
              />
            ))}
          </div>
        </div>

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
