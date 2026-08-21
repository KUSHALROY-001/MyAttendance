import React from "react";
import Skeleton from "./Skeleton";

const PendingApprovalsSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" className="h-5 w-44" />
              <Skeleton variant="text" className="h-3.5 w-56" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
          </div>

          {/* 2x3 Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="space-y-1">
                <Skeleton variant="text" className="h-3 w-16" />
                <Skeleton variant="text" className="h-4 w-28" />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rectangular" className="h-9 flex-1 rounded-xl" />
            <Skeleton variant="rectangular" className="h-9 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingApprovalsSkeleton;
