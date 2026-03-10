import React, { useState, useMemo } from "react";
import { MOCK_COURSES, MOCK_ATTENDANCE, MOCK_STUDENT } from "../mockData";
import { Link } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../layout/Footer";

const AttendanceCircle = ({ periods }) => {
  const getColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "#22c55e"; // Green
      case "LATE":
        return "#f59e0b"; // Orange
      case "ABSENT":
        return "#ef4444"; // Red
      default:
        return "#f1f5f9"; // Light Gray
    }
  };

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 100 100"
      className="drop-shadow-sm group-hover:scale-110 transition-transform"
    >
      {/* 1st Period: Top-Right (Clock 12 to 3) */}
      <path
        d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z"
        fill={getColor(periods[0])}
        stroke="white"
        strokeWidth="2"
      />
      {/* 2nd Period: Bottom-Right (Clock 3 to 6) */}
      <path
        d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z"
        fill={getColor(periods[1])}
        stroke="white"
        strokeWidth="2"
      />
      {/* 3rd Period: Bottom-Left (Clock 6 to 9) */}
      <path
        d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z"
        fill={getColor(periods[2])}
        stroke="white"
        strokeWidth="2"
      />
      {/* 4th Period: Top-Left (Clock 9 to 12) */}
      <path
        d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z"
        fill={getColor(periods[3])}
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="12" fill="white" />
    </svg>
  );
};

const StudentDashboard = ({ user = MOCK_STUDENT }) => {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const userId = user?.id ?? "s1";
  const isMockUser = userId === "s1";

  const summaries = useMemo(() => {
    return MOCK_COURSES.filter((c) =>
      isMockUser ? c.studentIds.includes(userId) : true,
    ).map((course) => {
      const courseRecords = MOCK_ATTENDANCE.filter(
        (r) => r.courseId === course.id && r.studentId === userId,
      );
      const attended = courseRecords.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE",
      ).length;
      const total = Math.max(courseRecords.length, 12); // Minimum sessions for UI density
      return {
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        totalClasses: total,
        attendedClasses: attended,
        percentage: (attended / total) * 100,
      };
    });
  }, [userId, isMockUser]);

  const recentHistory = useMemo(() => {
    return [...MOCK_ATTENDANCE]
      .filter((r) => r.studentId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
  }, [userId]);

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
      const dayRecords = MOCK_ATTENDANCE.filter(
        (r) => r.date === dStr && r.studentId === userId,
      );
      const periods = [null, null, null, null];
      dayRecords.forEach((rec) => {
        const pNum = parseInt(rec.sessionId.split("-").pop() || "1");
        if (pNum >= 1 && pNum <= 4) periods[pNum - 1] = rec.status;
      });
      days.push({ date: d, periods, isCurrentMonth: d.getMonth() === month });
    }
    return days;
  }, [userId, calendarMonth]);

  const goToPreviousMonth = () =>
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  const goToNextMonth = () =>
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );

  // Derived user details for the header UI (simulated fallback)
  const enrollmentNo = user.enrollmentNo || "006CSE2024";
  const department = user.department || "Computer Science";
  const semester = user.semester || "Semester 2";

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

  const safeUserName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <>
      <Navbar />
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
              value={summaries.length.toString()}
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
            {/* Calendar Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Attendance Calendar
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous month"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 19l-7-7 7-7" strokeWidth="2" />
                    </svg>
                  </button>
                  <span className="text-sm font-bold text-gray-900">
                    {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
                    {calendarMonth.getFullYear()}
                  </span>
                  <button
                    onClick={goToNextMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next month"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 5l7 7-7 7" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4 text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Present</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Late</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Absent</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-100" />
                  <span>No class</span>
                </div>
                <span className="text-[10px] font-medium text-gray-400">
                  Periods clockwise: 1st • 2nd • 3rd • 4th
                </span>
              </div>

              <div className="grid grid-cols-6 gap-y-5 gap-x-2 text-center">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    {d}
                  </div>
                ))}
                {calendarDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center group relative cursor-pointer ${!day.isCurrentMonth ? "opacity-40" : ""}`}
                  >
                    <div className="relative w-10 h-10">
                      <div
                        className={`absolute inset-0 rounded-full bg-gray-100 ${!day.isCurrentMonth ? "opacity-60" : ""}`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AttendanceCircle
                          periods={day.periods}
                          className="w-6 h-6"
                        />
                      </div>
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-[14px] font-bold ${day.isCurrentMonth ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {day.date.getDate()}
                      </span>
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-all z-20 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap pointer-events-none">
                      P1: {day.periods[0] || "-"} | P2: {day.periods[1] || "-"}{" "}
                      <br />
                      P3: {day.periods[2] || "-"} | P4: {day.periods[3] || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Section: Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Stats
                </h2>
                <div className="space-y-4">
                  {summaries.map((sub) => (
                    <div
                      key={sub.courseId}
                      className="flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-[1rem] font-black text-gray-900 tracking-tight">
                          {sub.courseCode}
                        </p>
                        <p className="text-s text-gray-400">{sub.courseName}</p>
                      </div>
                      <span
                        className={`text-sm font-black ${sub.percentage < 75 ? "text-red-500" : "text-green-500"}`}
                      >
                        {sub.percentage.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* My Courses Progress Cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaries.map((course) => (
                <Link
                  key={course.courseId}
                  to={`/student/course/${course.courseId}`}
                  className={`group block bg-white rounded-2xl p-6 border transition-all ${course.percentage < 75 ? "border-red-100 shadow-red-50/50 shadow-md" : "border-gray-100 shadow-sm"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${course.percentage < 75 ? "bg-red-50 text-red-500" : "bg-indigo-50 text-indigo-500"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {course.courseName}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase font-black">
                          {course.courseCode}
                        </p>
                      </div>
                    </div>
                    {course.percentage < 75 && (
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-tight flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            strokeWidth="2"
                          />
                        </svg>
                        Low
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400">
                        Attendance
                      </span>
                      <span
                        className={`text-sm font-black ${course.percentage < 75 ? "text-red-500" : "text-green-500"}`}
                      >
                        {course.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${course.percentage < 75 ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      {course.attendedClasses} / {course.totalClasses} classes
                      attended
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center space-x-2">
                    <img
                      src={`https://i.pravatar.cc/150?u=${course.courseId}`}
                      className="w-6 h-6 rounded-full border border-gray-100"
                    />
                    <span className="text-[10px] font-bold text-gray-500">
                      Dr. Smith
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Recent Attendance History (Always at end) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Recent Attendance History
            </h2>
            <div className="space-y-4">
              {recentHistory.map((rec, i) => {
                const course = MOCK_COURSES.find((c) => c.id === rec.courseId);
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${rec.status === "PRESENT" ? "bg-green-500" : rec.status === "LATE" ? "bg-orange-500" : "bg-red-500"}`}
                      />
                      <div>
                        <p className="text-[1rem] font-bold text-gray-900">
                          {course?.name}
                        </p>
                        <p className="text-[13px] text-gray-400 uppercase tracking-tighter">
                          {course?.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-[15px] font-black ${rec.status === "PRESENT" ? "text-green-600" : rec.status === "LATE" ? "text-orange-600" : "text-red-600"}`}
                      >
                        {rec.status}
                      </p>
                      <p className="text-[13px] text-gray-400">
                        {new Date(rec.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-transform hover:translate-y-[-2px]">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shadow-inner border border-gray-100">
      {icon}
    </div>
  </div>
);

export default StudentDashboard;
