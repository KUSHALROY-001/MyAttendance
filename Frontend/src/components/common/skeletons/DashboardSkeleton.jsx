import React from "react";
import Skeleton from "./Skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="text" className="h-4 w-96" />
        </div>
        <Skeleton variant="rectangular" className="h-10 w-36 rounded-lg" />
      </div>

      {/* Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <Skeleton variant="circular" className="h-12 w-12" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-3 w-20" />
              <Skeleton variant="text" className="h-7 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Primary Box */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="h-6 w-44" />
            <Skeleton variant="text" className="h-4 w-24" />
          </div>
          <Skeleton variant="rectangular" className="h-64 rounded-xl" />
          <div className="space-y-2 pt-2">
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-4/5" />
          </div>
        </div>

        {/* Right Secondary Box */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Skeleton variant="text" className="h-6 w-36" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800/80"
              >
                <div className="flex-1 space-y-1.5 pr-4">
                  <Skeleton variant="text" className="h-4 w-3/4" />
                  <Skeleton variant="text" className="h-3 w-1/2" />
                </div>
                <Skeleton
                  variant="rectangular"
                  className="h-6 w-16 rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
