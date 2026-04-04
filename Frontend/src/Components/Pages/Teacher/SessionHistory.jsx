import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import StatCard from "../../UI/StatCard";
import LoadingAnimation from "../../UI/LoadingAnimation";
import PremiumErrorState from "../../UI/PremiumErrorState";
import {
  BackArrowSVG,
  BookSVG,
  UsersSVG,
  PlayCircleSVG,
  XCircleSVG,
  ChartSVG,
} from "../../UI/SVG";

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

  // remove the redundant code
  if (loading) {
    return <LoadingAnimation />;
  }

  // remove the redundant code
  if (!session) {
    return <PremiumErrorState title="Session Not Found" message="This attendance session doesn't exist or was removed." errorCode="404" />;
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
            <BackArrowSVG />
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
                  <BookSVG className="w-5 h-5" />
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
                icon={<UsersSVG className="w-4 h-4 text-gray-600" />}
              />
              <StatCard
                title="Present"
                value={presentCount}
                iconBg="bg-emerald-100"
                icon={<PlayCircleSVG className="w-4 h-4 text-emerald-600" />}
              />
              <StatCard
                title="Absent"
                value={absentCount}
                iconBg="bg-red-100"
                icon={<XCircleSVG className="w-4 h-4 text-red-600" />}
              />
              <StatCard
                title="Ratio"
                value={`${attendancePercentage}%`}
                iconBg="bg-indigo-100"
                icon={<ChartSVG className="w-4 h-4 text-indigo-600" />}
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
