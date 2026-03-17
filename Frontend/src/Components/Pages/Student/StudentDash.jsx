import React, { useState, useMemo, useEffect } from "react";
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

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    if (!stuData) {
      axios
        .get("/api/student/dashboard/BCA-002")
        .then((res) => {
          setStuData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching fallback student data", err);
        });
    }
  }, [stuData]);

  const summaries = useMemo(() => {
    return stuData?.summaries || [];
  }, [stuData]);

  const attendanceByDate = useMemo(() => {
    const map = {};
    if (!stuData?.attendance) return map;

    // Group records by ISO date
    stuData.attendance.forEach((rec) => {
      // Create a clean date string in local YYYY-MM-DD
      const dateObj = new Date(rec.date);
      // We assume date comes back closely matching ISO formats without timezone shifts breaking days
      const dateStr = dateObj.toISOString().split("T")[0];

      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(rec);
    });
    return map;
  }, [stuData]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);

    // Start on the Monday of the week that contains the 1st
    const startDay = (firstOfMonth.getDay() + 6) % 7; // shift so Monday=0
    const startDate = new Date(year, month, 1 - startDay);

    const lastOfMonth = new Date(year, month + 1, 0);
    // End on the Saturday of the week that contains the last day
    const endDay = (lastOfMonth.getDay() + 6) % 7; // Monday=0
    const endDate = new Date(year, month, lastOfMonth.getDate() + (5 - endDay));

    const days = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      const d = new Date(dt);
      // Exclude Sundays entirely
      if (d.getDay() === 0) continue;

      const dStr = d.toISOString().split("T")[0];
      const dayRecords = attendanceByDate[dStr] || [];
      const periods = [null, null, null, null];

      // Since backend doesn't provide explicit P1/P2/P3/P4, we assign them sequentially up to 4
      dayRecords.slice(0, 4).forEach((rec, index) => {
        periods[index] = rec.status.toUpperCase();
      });

      days.push({ date: d, periods, isCurrentMonth: d.getMonth() === month });
    }
    return days;
  }, [attendanceByDate, calendarMonth]);

  const goToPreviousMonth = () =>
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  const goToNextMonth = () =>
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );

  const enrollmentNo = stuData?.rollNumber || "Loading...";
  const department = stuData?.department || "Loading...";
  const semester = stuData?.batch || "Loading...";

  const lowAttendanceSubjects = summaries.filter((s) => s.percentage < 75);
  const overallAttended = summaries.reduce(
    (acc, curr) => acc + curr.attendedClasses,
    0,
  );
  const overallTotal = summaries.reduce(
    (acc, curr) => acc + curr.totalClasses,
    0,
  );
  const overallPercentage = (overallAttended / overallTotal) * 100;

  const safeUserName = stuData?.user?.name
    ? stuData.user.name.split(" ")[0]
    : "Student";

  if (!stuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
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
                Maintain at least 75% attendance to be eligible for
                examinations.
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

          {/* Attendance Calendar & Recent History Grid */}
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

          {/* My Courses Progress Cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Courses
            </h2>
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
    </>
  );
};

export default StudentDashboard;
