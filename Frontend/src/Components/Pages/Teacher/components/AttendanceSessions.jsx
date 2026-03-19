import React, { useState } from "react";
import { Link } from "react-router-dom";
import SessionCard from "./SessionCard";

const AttendanceSessions = ({ sessions = [] }) => {
  const [activeTab, setActiveTab] = useState("completed");

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
          Active (0)
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
        {activeTab === "completed" && sortedSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedSessions.map((session, index) => (
              <SessionCard key={index} session={session} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center py-6">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <svg
                className="w-6 h-6 text-indigo-400"
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
            </div>
            <h3 className="text-sm font-bold text-gray-400">
              No {activeTab} sessions
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Start a new attendance session above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSessions;
