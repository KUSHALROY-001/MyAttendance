import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SessionCard from "./SessionCard";
import { ChevronRightSVG, PlayCircleSVG } from "../../../UI/SVG";

const AttendanceSessions = ({ sessions = [], onSessionClick }) => {
  const [activeTab, setActiveTab] = useState("completed");
  const [liveSession, setLiveSession] = useState(null);

  useEffect(() => {
    const read = () => {
      const raw = localStorage.getItem("activeSession");
      setLiveSession(raw ? JSON.parse(raw) : null);
    };
    read();
    window.addEventListener("focus", read);
    return () => window.removeEventListener("focus", read);
  }, []);

  useEffect(() => {
    if (liveSession) setActiveTab("active");
  }, [liveSession]);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-slate-100">
        Attendance Sessions
      </h2>

      <div className="mb-6 flex self-start rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
        <button
          onClick={() => setActiveTab("active")}
          className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "active"
              ? "border border-slate-200/50 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Active ({liveSession ? 1 : 0})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "completed"
              ? "border border-slate-200/50 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Completed ({sessions.length})
        </button>
      </div>

      <div className="max-h-[350px] flex-1 overflow-y-auto pr-2">
        {activeTab === "active" ? (
          liveSession ? (
            <Link
              to={`/teacher/attendance/live/${liveSession.allocationId}`}
              className="group block"
            >
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-4 transition-colors hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                        LIVE
                      </span>
                    </div>
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                      {liveSession.courseName}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {liveSession.courseCode} • Sem {liveSession.semester} • Sec{" "}
                      {liveSession.section}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      Started{" "}
                      {new Date(liveSession.startedAt).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <ChevronRightSVG className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                <PlayCircleSVG className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500">
                No active sessions
              </h3>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Start a new attendance session above
              </p>
            </div>
          )
        ) : sortedSessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sortedSessions.map((session, index) => (
              <SessionCard
                key={index}
                session={session}
                onClick={onSessionClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              <PlayCircleSVG className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500">
              No completed sessions
            </h3>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Start a new attendance session above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSessions;
