import React from "react";
import { ChevronRightSVG } from "../../../UI/SVG";

const SessionCard = ({ session, showCourseName = true, onClick }) => {
  const presentCount =
    session.presentCount ??
    (session.records?.filter(
      (r) => r.status === "Present" || r.status === "Late",
    ).length ||
      0);
  const totalCount = session.totalCount ?? (session.records?.length || 0);

  return (
    <div
      onClick={() => onClick && onClick(session.id)}
      className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-2 md:p-4 transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          {showCourseName && session.name ? (
            <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100">
              {session.name}
            </h4>
          ) : (
            <span className="mb-2 inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-[12px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}

          <p className="mt-1 text-[13px] font-semibold text-slate-500 dark:text-slate-400">
            {session.department} • Sem {session.semester} • Sec{" "}
            {session.section}
          </p>
        </div>

        {showCourseName && session.name ? (
          <span className="shrink-0 rounded-md bg-indigo-50 px-2.5 py-1 text-[12px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            {new Date(session.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-300">
            <ChevronRightSVG className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/70">
        <div className="flex-1 text-center">
          <p className="mb-0.5 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
            Total
          </p>
          <p className="text-sm font-black text-slate-700 dark:text-slate-200">
            {totalCount}
          </p>
        </div>
        <div className="mx-2 h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex-1 text-center">
          <p className="mb-0.5 text-[10px] font-bold uppercase text-emerald-600/70">
            Present
          </p>
          <p className="text-sm font-black text-emerald-600">{presentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
