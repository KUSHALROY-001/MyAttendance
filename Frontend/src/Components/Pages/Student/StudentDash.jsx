import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "../../../api/axios";
import { useLocation } from "react-router-dom";
import PremiumErrorState from "../../UI/PremiumErrorState";
import AttendanceCalendar from "./Component/AttendanceCalendar";
import CourseCard from "./Component/CourseCard";
import RecentAttendanceList from "./Component/RecentAttendanceList";
import QuickStats from "./Component/QuickStats";
import StatCard from "../../UI/StatCard";
import {
  ExclamationCircleSVG,
  CrossSVG,
  CalendarSVG,
  StackSVG,
  ChartSVG,
} from "../../UI/SVG";
import LoadingAnimation from "../../UI/LoadingAnimation";
import { useCalendar } from "../../../hooks/useCalendar";

const StudentDashboard = () => {
  const location = useLocation();
  const [stuData, setStuData] = useState(location.state?.user || null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (stuData) return;
    axios
      .get("/api/student/dashboard/BCA-002", { hideGlobalToast: true })
      .then((res) => setStuData(res.data))
      .catch((err) => {
        setFetchError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "Failed to load dashboard data",
        });
      });
  }, []); // only run once on mount

  // ──────────────────────── Memoised derivations ────────────────────────

  const summaries = useMemo(() => stuData?.summaries ?? [], [stuData]);

  const attendanceByDate = useMemo(() => {
    const map = {};
    stuData?.attendance?.forEach((rec) => {
      // Use local date parts to avoid UTC-midnight timezone shifts
      const d = new Date(rec.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      (map[key] ??= []).push(rec);
    });
    return map;
  }, [stuData]);

  const { calendarMonth, calendarDays, goToPreviousMonth, goToNextMonth } = useCalendar(attendanceByDate);

  // ─────────────────────── Aggregate stats (safe against empty summaries) ───────────────────────

  const {
    lowAttendanceSubjects,
    overallAttended,
    overallTotal,
    overallPercentage,
  } = useMemo(() => {
    const low = summaries.filter((s) => s.percentage < 75);
    const attended = summaries.reduce((a, c) => a + c.attendedClasses, 0);
    const total = summaries.reduce((a, c) => a + c.totalClasses, 0);
    return {
      lowAttendanceSubjects: low,
      overallAttended: attended,
      overallTotal: total,
      overallPercentage: total > 0 ? (attended / total) * 100 : 0, // safe division
    };
  }, [summaries]);

  // ─────────────────────── Loading state (guard BEFORE any render that uses stuData) ───────────────────────

  if (fetchError) {
    return (
      <PremiumErrorState 
        title={fetchError.status === 404 ? "Student Not Found" : "System Error"}
        message={fetchError.message} 
        errorCode={fetchError.status === 404 ? "404" : fetchError.status.toString()} 
      />
    );
  }

  if (!stuData) {
    return <LoadingAnimation />;
  }

  const safeUserName = stuData.user?.name?.split(" ")[0] ?? "Student";
  const enrollmentNo = stuData.rollNumber ?? "—";
  const department = stuData.department ?? "—";
  const semester = stuData.batch ?? "—";

  return (
    <div className="mx-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {safeUserName}
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Enrollment: {enrollmentNo} • {department} • {semester}
          </p>
        </div>

        {/* Low Attendance Warning */}
        {lowAttendanceSubjects.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-900">
            <div className="flex items-center space-x-2 mb-4">
              <ExclamationCircleSVG className="w-5 h-5 text-red-600" />
              <span className="font-bold text-sm uppercase tracking-tight">
                Low Attendance Warning
              </span>
            </div>
            <p className="text-sm font-medium mb-4">
              You have low attendance (&lt;75%) in{" "}
              {lowAttendanceSubjects.length} subject(s):
            </p>
            <div className="space-y-2 mb-4">
              {lowAttendanceSubjects.map((sub) => (
                <div
                  key={sub.courseId}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <CrossSVG className="w-4 h-4 text-red-400 rotate-45" />
                    <span className="font-bold text-red-700">
                      {sub.courseName}
                    </span>
                    <span className="text-red-400">({sub.courseCode})</span>
                  </div>
                  <span className="font-black">
                    {sub.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-500">
              Maintain at least 75% attendance to be eligible for examinations.
            </p>
          </div>
        )}

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Calendar + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* My Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                to={`/student/course/${course.courseId}`}
                state={{ user: stuData }}
              />
            ))}
          </div>
        </div>

        <RecentAttendanceList records={attendanceByDate} />
      </div>
    </div>
  );
};

export default StudentDashboard;
