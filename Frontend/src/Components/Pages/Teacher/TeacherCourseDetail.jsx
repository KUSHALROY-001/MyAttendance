import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import SessionCard from "./components/SessionCard";

const StatCard = ({ title, value, icon, iconBg }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-xl font-black text-gray-900">{value}</h3>
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

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
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 pb-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 pb-20">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Course Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200 transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {courseData.courseName}
            </h1>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">
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
            icon={
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
          />
          <StatCard
            title="Overall Attendance"
            value={`${courseData.overallAttendance}%`}
            iconBg="bg-indigo-50"
            icon={
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
        </div>

        {/* Sessions List */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Past Sessions</h2>

        {courseData.sessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courseData.sessions.map((session) => (
              <SessionCard key={session.id} session={session} showCourseName={false} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-600">
              No sessions found
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              You haven't conducted any classes for this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseDetail;
