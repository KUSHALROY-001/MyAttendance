import React from "react";

// Mobile-only sticky summary bar: "4 / 10 Present | 0 / 10 Late | 6 / 10 Absent".
// On md+ screens the stat cards at the top of the page are shown instead.
const SUMMARY_ITEMS = [
  {
    key: "present",
    label: "Present",
    valueClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "late",
    label: "Late",
    valueClass: "text-amber-500 dark:text-amber-400",
  },
  {
    key: "absent",
    label: "Absent",
    valueClass: "text-red-600 dark:text-red-400",
  },
];

export default function TakeAttendanceFooter({ stats }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex items-stretch rounded-full border border-emerald-200 bg-emerald-50/95 py-1 shadow-lg shadow-emerald-900/10 backdrop-blur dark:border-emerald-500/30 dark:bg-emerald-950/90 dark:shadow-black/40"
      >
        {SUMMARY_ITEMS.map((item, index) => (
          <div
            key={item.key}
            className={`flex flex-1 flex-col items-center justify-center ${
              index > 0
                ? "border-l border-emerald-200 dark:border-emerald-500/20"
                : ""
            }`}
          >
            <p className={`text-base leading-tight ${item.valueClass}`}>
              {stats[item.key]} / {stats.total}
            </p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
