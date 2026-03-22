import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SessionCard from "./SessionCard";

const AttendanceSessions = ({ sessions = [] }) => {
  const [activeTab, setActiveTab] = useState("completed");
  const [liveSession, setLiveSession] = useState(null);

  // Read active session from localStorage on mount (and whenever the tab re-focuses)
  useEffect(() => {
    const read = () => {
      const raw = localStorage.getItem("activeSession");
      setLiveSession(raw ? JSON.parse(raw) : null);
    };
    read();
    window.addEventListener("focus", read);
    return () => window.removeEventListener("focus", read);
  }, []);

  // Auto-switch to Active tab when a live session exists
  useEffect(() => {
    if (liveSession) setActiveTab("active");
  }, [liveSession]);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Attendance Sessions
      </h2>

      <div className="flex bg-gray-50 self-start p-1 rounded-lg border border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
            activeTab === "active"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          Active ({liveSession ? 1 : 0})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
            activeTab === "completed"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          Completed ({sessions.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 max-h-[350px]">
        {activeTab === "active" ? (
          liveSession ? (
            <Link
              to={`/teacher/attendance/live/${liveSession.allocationId}`}
              className="block group"
            >
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-4 hover:bg-emerald-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                        LIVE
                      </span>
                    </div>
                    <p className="font-bold text-sm text-gray-900 truncate">{liveSession.courseName}</p>
                    <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                      {liveSession.courseCode} • Sem {liveSession.semester} • Sec {liveSession.section}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Started {new Date(liveSession.startedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center py-6">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-400">No active sessions</h3>
              <p className="text-xs text-gray-400 mt-1">Start a new attendance session above</p>
            </div>
          )
        ) : sortedSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedSessions.map((session, index) => (
              <SessionCard key={index} session={session} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center py-6">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-400">No completed sessions</h3>
            <p className="text-xs text-gray-400 mt-1">Start a new attendance session above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSessions;
