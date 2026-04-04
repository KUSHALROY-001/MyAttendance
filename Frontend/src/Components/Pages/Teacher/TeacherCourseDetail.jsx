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
    return <PremiumErrorState title="Course Not Found" message="No details found for this course assignment." errorCode="404" />;
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
            <BackArrowSVG className="w-5 h-5 text-gray-600" />
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
        <h2 className="text-lg font-bold text-gray-900 mb-4">Past Sessions</h2>

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
          <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <MissingSVG className="w-8 h-8 text-gray-400" />
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
