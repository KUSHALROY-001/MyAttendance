import React from "react";
import { ArrowLeft } from "lucide-react";

export default function TakeAttendanceHeader({
  allocation,
  onBack,
  onCancel,
  onSave,
  saving,
  disabled,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="shrink-0 rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {allocation?.course?.name || "Unknown Subject"}
            </h1>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              Live
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {allocation?.course?.code || "N/A"} •{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border-2 border-red-100 px-2 md:px-5 py-1.5 md:py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
        >
          Cancel
        </button>
        <button
          disabled={saving || disabled}
          onClick={onSave}
          className={`flex items-center gap-2 rounded-lg px-2.5 md:px-6 py-1.5 md:py-2.5 text-sm font-black text-white transition ${
            saving
              ? "cursor-not-allowed bg-emerald-300"
              : "bg-emerald-600 shadow-sm hover:bg-emerald-700"
          }`}
        >
          {saving ? "Saving..." : "Submit Session"}
        </button>
      </div>
    </div>
  );
}
