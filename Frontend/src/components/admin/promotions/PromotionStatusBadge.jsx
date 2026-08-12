import React from "react";

const STATUS_STYLES = {
  RUNNING:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  COMPLETED:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  COMPLETED_WITH_ERRORS:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const PromotionStatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {status?.replaceAll("_", " ")}
  </span>
);

export default PromotionStatusBadge;
