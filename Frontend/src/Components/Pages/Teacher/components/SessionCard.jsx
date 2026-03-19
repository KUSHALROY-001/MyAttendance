import React from 'react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session, showCourseName = true }) => {
  const presentCount = session.presentCount ?? (session.records?.filter((r) => r.status === "Present" || r.status === "Late").length || 0);
  const totalCount = session.totalCount ?? (session.records?.length || 0);

  return (
    <Link
      to={`/teacher/session/${session.id}`}
      className="flex flex-col p-4 border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md cursor-pointer transition-all bg-white group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          {showCourseName && session.name ? (
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {session.name}
            </h4>
          ) : (
            <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}

          <p className="text-[13px] font-semibold text-gray-500 mt-1">
            {session.department} • Sem {session.semester} • Sec {session.section}
          </p>
        </div>

        {showCourseName && session.name ? (
          <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md shrink-0">
            {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-auto flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
        <div className="text-center flex-1">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Total</p>
          <p className="text-sm font-black text-gray-700">{totalCount}</p>
        </div>
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        <div className="text-center flex-1">
          <p className="text-[10px] uppercase font-bold text-emerald-600/70 mb-0.5">Present</p>
          <p className="text-sm font-black text-emerald-600">{presentCount}</p>
        </div>
      </div>
    </Link>
  );
};

export default SessionCard;
