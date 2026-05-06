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
    return (
      <PremiumErrorState
        title="Session Not Found"
        message="This attendance session doesn't exist or was removed."
        errorCode="404"
      />
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <BackArrowSVG />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Session Details
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
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
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <BookSVG className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">
                    {session.courseName}
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {session.courseCode}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                {session.department} • Sem {session.semester} • Section{" "}
                {session.section}
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/60 sm:grid-cols-4">
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Student Attendance List
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                  className="flex items-center justify-between p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
                        {student.name}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
