import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MOCK_COURSES,
  MOCK_ATTENDANCE,
  MOCK_STUDENT,
  MOCK_TEACHER,
} from "../mockData";
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
      <path
        d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z"
        fill={getColor(periods[0])}
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z"
        fill={getColor(periods[1])}
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z"
        fill={getColor(periods[2])}
        stroke="white"
        strokeWidth="2"
      />
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

const CourseDetail = () => {
  const { courseId } = useParams();
  const userId = MOCK_STUDENT.id;

  const course = useMemo(
    () => MOCK_COURSES.find((c) => c.id === courseId),
    [courseId],
  );

  const teacher = useMemo(() => {
    if (!course) return null;
    return MOCK_TEACHER.id === course.teacherId ? MOCK_TEACHER : null;
  }, [course]);

  const courseRecords = useMemo(() => {
    if (!course) return [];
    return MOCK_ATTENDANCE.filter(
      (r) => r.courseId === course.id && r.studentId === userId,
    );
  }, [course, userId]);

  const attendanceByDate = useMemo(() => {
    const byDate = {};
    courseRecords.forEach((rec) => {
      if (!byDate[rec.date]) byDate[rec.date] = [];
      byDate[rec.date].push(rec);
    });
    return byDate;
  }, [courseRecords]);

  const attendanceSummary = useMemo(() => {
    const dates = Object.keys(attendanceByDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    const totalDays = dates.length;
    let presentDays = 0;
    let absentDays = 0;

    dates.forEach((date) => {
      const records = attendanceByDate[date];
      const hasAbsent = records.some((r) => r.status === "ABSENT");
      const hasPresent = records.some(
        (r) => r.status === "PRESENT" || r.status === "LATE",
      );
      if (hasAbsent) absentDays += 1;
      else if (hasPresent) presentDays += 1;
    });

    return {
      totalDays,
      presentDays,
      absentDays,
      percentage: totalDays ? (presentDays / totalDays) * 100 : 0,
    };
  }, [attendanceByDate]);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);

    const startDay = (firstOfMonth.getDay() + 6) % 7;
    const startDate = new Date(year, month, 1 - startDay);

    const lastOfMonth = new Date(year, month + 1, 0);
    const endDay = (lastOfMonth.getDay() + 6) % 7;
    const endDate = new Date(year, month, lastOfMonth.getDate() + (5 - endDay));

    const days = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      const d = new Date(dt);
      if (d.getDay() === 0) continue;
      const dStr = d.toISOString().split("T")[0];
      const dayRecords = attendanceByDate[dStr] || [];
      const periods = [null, null, null, null];
      dayRecords.forEach((rec) => {
        const pNum = parseInt(rec.sessionId.split("-").pop() || "1");
        if (pNum >= 1 && pNum <= 4) periods[pNum - 1] = rec.status;
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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Course not found</h1>
            <p className="text-gray-500 mt-2">
              The course you are looking for does not exist or you are not
              enrolled.
            </p>
            <Link
              to="/student"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {course.name}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">
                {course.code} • {teacher?.name ?? "Instructor"}
              </p>
            </div>
            <Link
              to="/student"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              ← Back to dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="ATTENDANCE"
              value={`${attendanceSummary.percentage.toFixed(1)}%`}
              icon="📈"
            />
            <StatCard
              title="TOTAL DAYS"
              value={attendanceSummary.totalDays.toString()}
              icon="📅"
            />
            <StatCard
              title="PRESENT"
              value={attendanceSummary.presentDays.toString()}
              icon="✅"
            />
            <StatCard
              title="ABSENT"
              value={attendanceSummary.absentDays.toString()}
              icon="❌"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    {calendarMonth.toLocaleString("default", {
                      month: "long",
                    })}{" "}
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

                    <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-all z-20 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap pointer-events-none">
                      P1: {day.periods[0] || "-"} | P2: {day.periods[1] || "-"}{" "}
                      <br />
                      P3: {day.periods[2] || "-"} | P4: {day.periods[3] || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Recent Attendance
              </h2>
              <div className="space-y-4">
                {Object.keys(attendanceByDate)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                  .slice(0, 10)
                  .map((date) => {
                    const records = attendanceByDate[date] || [];
                    const status = records.some((r) => r.status === "ABSENT")
                      ? "ABSENT"
                      : records.some(
                            (r) =>
                              r.status === "PRESENT" || r.status === "LATE",
                          )
                        ? "PRESENT"
                        : "NO CLASS";

                    return (
                      <div
                        key={date}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === "PRESENT"
                                ? "bg-green-500"
                                : status === "ABSENT"
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                            }`}
                          />
                          <div>
                            <p className="text-[1rem] font-bold text-gray-900">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-[13px] text-gray-400 uppercase tracking-tighter">
                              {status}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-black ${
                            status === "PRESENT"
                              ? "text-green-600"
                              : status === "ABSENT"
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
              </div>
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

export default CourseDetail;
