import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AttendanceCalendar from "./Component/AttendanceCalendar";
import CourseCard from "./Component/CourseCard";
import RecentAttendanceList from "./Component/RecentAttendanceList";
import QuickStats from "./Component/QuickStats";
import StatCard from "./Component/StatCard";

const StudentDashboard = () => {
  const location = useLocation();
  const [stuData, setStuData] = useState(location.state?.user || null);

  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  useEffect(() => {
    if (stuData) return;
    axios
      .get("/api/student/dashboard/BCA-002")
      .then((res) => setStuData(res.data))
      .catch((err) => console.error("Error fetching student data", err));
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

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    // Monday-anchored week start/end
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const endOffset = 5 - ((lastOfMonth.getDay() + 6) % 7);
    const startDate = new Date(year, month, 1 - startOffset);
    const endDate = new Date(year, month, lastOfMonth.getDate() + endOffset);

    const days = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      if (dt.getDay() === 0) continue; // skip Sundays
      const d = new Date(dt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const dayRecords = attendanceByDate[key] ?? [];
      const periods = dayRecords.slice(0, 4).map((r) => r.status.toUpperCase());
      while (periods.length < 4) periods.push(null);
      days.push({ date: d, periods, isCurrentMonth: d.getMonth() === month });
    }
    return days;
  }, [attendanceByDate, calendarMonth]);

  // useCallback prevents child re-renders on every parent render
  const goToPreviousMonth = useCallback(
    () =>
      setCalendarMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)),
    [],
  );
  const goToNextMonth = useCallback(
    () =>
      setCalendarMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)),
    [],
  );

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

  if (!stuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
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
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
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
                    <svg
                      className="w-4 h-4 text-red-400 rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 7l10 10M7 17l10-10" strokeWidth="2" />
                    </svg>
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
            icon="📈"
          />
          <StatCard
            title="ENROLLED COURSES"
            value={stuData.courses?.length}
            icon="📚"
          />
          <StatCard
            title="CLASSES ATTENDED"
            value={`${overallAttended} of ${overallTotal}`}
            icon="📅"
          />
          <StatCard
            title="LOW ATTENDANCE"
            value={lowAttendanceSubjects.length.toString()}
            icon="⚠️"
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
