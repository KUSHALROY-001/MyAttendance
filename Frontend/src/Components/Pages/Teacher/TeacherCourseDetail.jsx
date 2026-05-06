import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../../api/axios";
import SessionCard from "./components/SessionCard";
import LoadingAnimation from "../../UI/LoadingAnimation";
import PremiumErrorState from "../../UI/PremiumErrorState";
import StatCard from "../../UI/StatCard";
import { BookSVG, ChartSVG, BackArrowSVG, MissingSVG } from "../../UI/SVG.jsx";

const TeacherCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // We use the same hardcoded teacher ID as TeacherDashboard for current prototyping
  const teacherId = "EMP-001";

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(
          `/api/teacher/${teacherId}/course/${courseId}`,
        );
        setCourseData(res.data);
      } catch (err) {
        console.error("Failed to load course detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, teacherId]);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!courseData) {
    return (
      <PremiumErrorState
        title="Course Not Found"
        message="No details found for this course assignment."
        errorCode="404"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <BackArrowSVG className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {courseData.courseName}
            </h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {courseData.courseCode}
            </p>
          </div>
        </div>

        {/* Analytics Hero */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <StatCard
            title="Total Sessions"
            value={courseData.totalSessions}
            iconBg="bg-blue-50"
            icon={<BookSVG className="w-4 h-4 text-blue-600" />}
          />
          <StatCard
            title="Overall Attendance"
            value={`${courseData.overallAttendance}%`}
            iconBg="bg-indigo-50"
            icon={<ChartSVG className="w-4 h-4 text-indigo-600" />}
          />
        </div>

        {/* Sessions List */}
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
          Past Sessions
        </h2>

        {courseData.sessions?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courseData.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                showCourseName={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <MissingSVG className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-base font-bold text-slate-600 dark:text-slate-300">
              No sessions found
            </h3>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              You haven't conducted any classes for this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseDetail;
