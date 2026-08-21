import React from "react";
import { Loader2, GraduationCap } from "lucide-react";

const PromotionScopeHeader = ({
  department,
  setDepartment,
  preview,
  requestRunPromotion,
  running,
  loadingPreview,
  totalEligible,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Scope
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-56 rounded-lg border border-slate-300 bg-[#ffffff] px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-[#050505] dark:text-white"
        >
          <option value="">All departments</option>
          {preview.map((d) => (
            <option key={d.department} value={d.department}>
              {d.department}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={requestRunPromotion}
        disabled={running || loadingPreview || totalEligible === 0}
        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GraduationCap className="h-4 w-4" />
        )}
        {running ? "Promoting…" : "Run Promotion"}
      </button>
    </div>
  );
};

export default PromotionScopeHeader;
