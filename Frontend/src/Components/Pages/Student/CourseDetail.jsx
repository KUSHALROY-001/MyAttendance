import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MOCK_COURSES,
  MOCK_ATTENDANCE,
  MOCK_STUDENT,
  MOCK_TEACHER,
} from "../../../mockData";
import AttendanceCalendar from "../../UI/AttendanceCalendar";
import RecentAttendanceList from "../../UI/RecentAttendanceList";
import StatCard from "../../UI/StatCard";

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
      </div>
    );
  }

  return (
    <>
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
            <div className="lg:col-span-2">
              <AttendanceCalendar
                month={calendarMonth}
                days={calendarDays}
                onPreviousMonth={goToPreviousMonth}
                onNextMonth={goToNextMonth}
              />
            </div>

            <RecentAttendanceList
              records={attendanceByDate}
              getCourseById={(id) => MOCK_COURSES.find((c) => c.id === id)}
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default CourseDetail;
