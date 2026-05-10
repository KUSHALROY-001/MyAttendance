import React from "react";
import AdminModal from "../Pages/Admin/Component/AdminModal";

const STATUS_STYLES = {
  PRESENT:
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20",
  ABSENT:
    "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-red-600/20",
  LATE: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-600/20",
  LEAVE:
    "bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 ring-slate-500/20",
  NEUTRAL:
    "bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 ring-slate-500/20",
};

const METRIC_TONE_STYLES = {
  success: "text-emerald-600 dark:text-emerald-400",
  danger: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  neutral: "text-slate-600 dark:text-slate-300",
};

export const AttendanceStatusBadge = ({ status, label }) => {
  const normalized = (status || "NEUTRAL").toString().toUpperCase();
  const badgeLabel = label || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
        STATUS_STYLES[normalized] || STATUS_STYLES.NEUTRAL
      }`}
    >
      {badgeLabel}
    </span>
  );
};

const AttendanceSessionModal = ({
  isOpen,
  onClose,
  title,
  loading = false,
  errorMessage = "Unable to load details.",
  detail = null,
}) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      {loading ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading details...
        </p>
      ) : detail ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col gap-4 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {detail.summary?.title}
                </p>
                {detail.summary?.subtitle ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {detail.summary.subtitle}
                  </p>
                ) : null}
                {detail.summary?.meta ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {detail.summary.meta}
                  </p>
                ) : null}
              </div>
              {detail.summary?.metrics?.length ? (
                <div className="grid min-w-[180px] grid-cols-2 gap-2 text-center sm:text-right">
                  {detail.summary.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p
                        className={`text-sm font-semibold ${
                          METRIC_TONE_STYLES[metric.tone || "neutral"]
                        }`}
                      >
                        {metric.value}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {detail.listTitle ? (
            <div className="border-b border-slate-200 px-1 pb-2 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {detail.listTitle}
              </h3>
            </div>
          ) : null}

          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {detail.rows?.length ? (
              detail.rows.map((row, index) => (
                <div key={row.id ?? index}>{detail.renderRow(row, index)}</div>
              ))
            ) : (
              <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {detail.emptyMessage || "No records found."}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {errorMessage}
        </p>
      )}
    </AdminModal>
  );
};

export default AttendanceSessionModal;
