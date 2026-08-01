import React from "react";

export default function TakeAttendanceActions({ onMarkAll }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <button
        onClick={() => onMarkAll("Present")}
        className="rounded-lg border-2 max-sm:w-full border-emerald-100 px-4 py-2 text-sm font-bold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10"
      >
        Mark All Present
      </button>
      <button
        onClick={() => onMarkAll("Absent")}
        className="rounded-lg border-2 max-sm:w-full border-red-100 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
      >
        Mark All Absent
      </button>
      <button
        onClick={() => onMarkAll("Late")}
        className="rounded-lg border-2 max-sm:w-full border-amber-100 px-4 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-50 dark:border-amber-500/20 dark:hover:bg-amber-500/10"
      >
        Mark All Late
      </button>
    </div>
  );
}
