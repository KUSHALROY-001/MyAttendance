import React from "react";
import { Loader2, X } from "lucide-react";

const PromotionBatchDetailPanel = ({ batch, loading, onClose }) => {
  if (!batch && !loading) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Promotion Batch
            </h3>
            {batch && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {batch.department || "All departments"} · triggered by{" "}
                {batch.triggeredBy?.name || "—"} ·{" "}
                {new Date(batch.startedAt).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                <p className="text-xl font-black text-green-600 dark:text-green-400">
                  {batch.promotedCount}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Promoted
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                <p className="text-xl font-black text-slate-600 dark:text-slate-300">
                  {batch.skippedCount}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Skipped
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                <p className="text-xl font-black text-red-600 dark:text-red-400">
                  {batch.failedCount}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Failed
                </p>
              </div>
            </div>

            {Array.isArray(batch.errorLog) && batch.errorLog.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900/40 dark:bg-red-500/5">
                <p className="mb-1 font-semibold text-red-700 dark:text-red-400">
                  Failures
                </p>
                <ul className="space-y-1 text-red-600 dark:text-red-400">
                  {batch.errorLog.map((e, i) => (
                    <li key={i}>
                      {e.rollNumber || `Student #${e.studentId}`}: {e.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Student Summaries ({batch.summaries?.length || 0})
              </p>
              <div className="space-y-2">
                {(batch.summaries || []).map((summary) => (
                  <details
                    key={summary.id}
                    className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                  >
                    <summary className="flex cursor-pointer items-center justify-between text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {summary.student?.user?.name} (
                        {summary.student?.rollNumber})
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {summary.overallPercentage.toFixed(1)}%
                      </span>
                    </summary>
                    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <p className="text-xs text-slate-500">
                        Semester {summary.semester} →{" "}
                        {summary.promotedToSemester}
                        {" · "}
                        {summary.totalAttended}/{summary.totalSessions} sessions
                      </p>
                      {summary.courses.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                        >
                          <span>
                            {c.courseName} ({c.courseCode})
                          </span>
                          <span>
                            {c.percentage.toFixed(1)}% ({c.totalAttended}/
                            {c.totalSessions})
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionBatchDetailPanel;
