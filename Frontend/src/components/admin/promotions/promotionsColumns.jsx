import React from "react";
import PromotionStatusBadge from "./PromotionStatusBadge";

export const previewColumns = [
  {
    header: "Department",
    accessor: "department",
    render: (d) => (
      <span className="font-semibold text-slate-900 dark:text-white">
        {d.department}
      </span>
    ),
  },
  {
    header: "Final Semester",
    accessor: "maxSemester",
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-400">
        Sem {d.maxSemester}
      </span>
    ),
  },
  {
    header: "Total Students",
    accessor: "totalStudents",
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-400">
        {d.totalStudents}
      </span>
    ),
  },
  {
    header: "Eligible",
    accessor: "eligibleCount",
    render: (d) => (
      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
        {d.eligibleCount}
      </span>
    ),
  },
  {
    header: "Will Be Skipped",
    accessor: "atFinalSemesterCount",
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-400">
        {d.atFinalSemesterCount}
      </span>
    ),
  },
];

export const historyColumns = [
  {
    header: "Department Scope",
    accessor: "department",
    render: (batch) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          {batch.department || "All departments"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Started: {new Date(batch.startedAt).toLocaleString()}
        </p>
      </div>
    ),
  },
  {
    header: "Triggered By",
    render: (batch) => (
      <span className="text-slate-600 dark:text-slate-400">
        {batch.triggeredBy?.name || "—"}
      </span>
    ),
  },
  {
    header: "Promoted Students",
    accessor: "promotedCount",
    render: (batch) => (
      <span className="font-medium text-slate-700 dark:text-slate-300">
        {batch.promotedCount} promoted
      </span>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (batch) => <PromotionStatusBadge status={batch.status} />,
  },
];
