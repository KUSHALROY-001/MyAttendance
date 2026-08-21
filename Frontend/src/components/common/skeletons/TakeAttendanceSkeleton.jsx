import React from "react";
import Skeleton from "./Skeleton";

const TakeAttendanceSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 pb-28 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* TakeAttendanceHeader Skeleton */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
            <div className="space-y-1.5">
              <Skeleton variant="text" className="h-6 w-48" />
              <Skeleton variant="text" className="h-4 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
            <Skeleton variant="rectangular" className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        {/* TakeAttendanceStats Skeleton (3 cards) */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2"
            >
              <Skeleton variant="text" className="h-8 w-12 mx-auto" />
              <Skeleton variant="text" className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* TakeAttendanceActions Skeleton */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Skeleton variant="text" className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" className="h-9 w-32 rounded-lg" />
            <Skeleton variant="rectangular" className="h-9 w-32 rounded-lg" />
          </div>
        </div>

        {/* TakeAttendanceRoster Skeleton (8 student rows) */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3.5">
                <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton variant="text" className="h-4 w-40" />
                  <Skeleton variant="text" className="h-3 w-28" />
                </div>
              </div>
              <Skeleton variant="rectangular" className="h-10 w-32 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeAttendanceSkeleton;
