import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

const SessionHistory = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const res = await axios.get(`/api/teacher/attendance/${sessionId}`);
        setSession(res.data);
      } catch (err) {
        console.error("Failed to load session", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 pb-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 pb-20">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Session Not Found
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

  const totalStudents = session.students.length;
  const presentCount = session.students.filter(
    (s) => s.status === "Present" || s.status === "Late",
  ).length;
  const absentCount = session.students.filter(
    (s) => s.status === "Absent",
  ).length;
  const leaveCount = session.students.filter(
    (s) => s.status === "Leave",
  ).length;

  const attendancePercentage =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

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
              Session Details
            </h1>
            <p className="text-sm font-semibold text-gray-500">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {session.courseName}
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {session.courseCode}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mt-2">
                {session.department} • Sem {session.semester} • Section{" "}
                {session.section}
              </p>
            </div>

            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
              <StatCard
                title="Total"
                value={totalStudents}
                iconBg="bg-gray-100"
                icon={
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Present"
                value={presentCount}
                iconBg="bg-emerald-100"
                icon={
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Absent"
                value={absentCount}
                iconBg="bg-red-100"
                icon={
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Ratio"
                value={`${attendancePercentage}%`}
                iconBg="bg-indigo-100"
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
          </div>
        </div>

        {/* Student Records List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900">
              Student Attendance List
            </h3>
          </div>

          <div className="divide-y divide-gray-50">
            {session.students.map((student) => {
              let statusColor = "bg-gray-100 text-gray-600";
              let statusBorder = "border-gray-200";

              if (student.status === "Present") {
                statusColor = "bg-emerald-50 text-emerald-600";
                statusBorder = "border-emerald-200";
              } else if (student.status === "Absent") {
                statusColor = "bg-red-50 text-red-600";
                statusBorder = "border-red-200";
              } else if (student.status === "Late") {
                statusColor = "bg-orange-50 text-orange-600";
                statusBorder = "border-orange-200";
              }

              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {student.name}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        {student.rollNumber}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-md text-[11px] font-bold border ${statusColor} ${statusBorder}`}
                  >
                    {student.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
