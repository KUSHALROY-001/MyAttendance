import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import AttendanceCalendar from "./Component/AttendanceCalendar";
import RecentAttendanceList from "./Component/RecentAttendanceList";
import StatCard from "../../UI/StatCard";
import { useCalendar } from "../../../hooks/useCalendar";

const CourseDetail = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const [stuData, setStuData] = useState(location.state?.user || null);

  useEffect(() => {
    if (!stuData) {
      axios
        .get("/api/student/dashboard/BCA-002")
        .then((res) => {
          setStuData(res.data);
        })
        .catch((err) =>
          console.error("Error fetching fallback student data", err),
        );
    }
  }, [stuData]);

  const courseSummary = useMemo(() => {
    return stuData?.summaries?.find((c) => c.courseId === courseId) || null;
  }, [stuData, courseId]);

  const courseRecords = useMemo(() => {
    if (!stuData?.attendance) return [];
    return stuData.attendance.filter((r) => r.course.code === courseId);
  }, [stuData, courseId]);

  const teacher = useMemo(() => {
    if (courseRecords.length > 0 && courseRecords[0].teacher) {
      return courseRecords[0].teacher;
    }
    return { name: "Instructor" };
  }, [courseRecords]);

  const attendanceByDate = useMemo(() => {
    const byDate = {};
    courseRecords.forEach((rec) => {
      const dateObj = new Date(rec.date);
      // Use local date parts to avoid UTC-midnight timezone shifts
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
      if (!byDate[dateStr]) byDate[dateStr] = [];
      byDate[dateStr].push(rec);
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
      const hasAbsent = records.some(
        (r) => r.status.toUpperCase() === "ABSENT",
      );
      const hasPresent = records.some(
        (r) =>
          r.status.toUpperCase() === "PRESENT" ||
          r.status.toUpperCase() === "LATE",
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

  const { calendarMonth, calendarDays, goToPreviousMonth, goToNextMonth } =
    useCalendar(attendanceByDate);

  if (!stuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!courseSummary) {
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
                {courseSummary.courseName}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">
                {courseSummary.courseCode} • {teacher?.name ?? "Instructor"}
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

            <RecentAttendanceList records={attendanceByDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
