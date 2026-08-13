import React from "react";
import Skeleton from "./Skeleton";

const StudentDashboardSkeleton = () => {
  return (
    <div className="mx-4 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 pb-12">
        {/* StudentDashHeader Skeleton */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton variant="text" className="h-8 w-56 sm:h-9 sm:w-72" />
              <Skeleton variant="circular" className="h-10 w-10" />
            </div>
            <Skeleton variant="text" className="h-4 w-80" />
          </div>
        </div>

        {/* StudentStatCards Skeleton (4 cards) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {/* <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton variant="text" className="h-7 w-24" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div> */}
              <Skeleton
                variant="rectangular"
                className="h-12 w-full rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* CalendarAndStats Skeleton (12 cols split: 7 for calendar, 5 for breakdown) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Calendar Box (7 cols) */}
          <div className="lg:col-span-7 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="h-6 w-15" />
              <div className="flex gap-2">
                <Skeleton variant="circular" className="h-8 w-8" />
                <Skeleton variant="circular" className="h-8 w-8" />
              </div>
            </div>
            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} variant="text" className="h-4 w-full" />
              ))}
            </div>
            {/* Calendar grid 5 rows */}
            <div className="grid grid-cols-7 gap-2 pt-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  className="h-10 w-full rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Monthly Stats Breakdown Box (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton variant="text" className="h-6 w-40" />
                <Skeleton
                  variant="rectangular"
                  className="h-6 w-16 rounded-full"
                />
              </div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="h-4 w-32" />
                      <Skeleton variant="text" className="h-4 w-12" />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      className="h-2 w-full rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Class Routine Table Skeleton Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="h-6 w-36" />
            <Skeleton variant="text" className="h-4 w-44" />
          </div>
          <Skeleton variant="rectangular" className="h-40 w-full rounded-xl" />
        </div>

        {/* CourseGrid Skeleton Box (3 cards) */}
        <div className="space-y-4">
          <Skeleton variant="text" className="h-6 w-44" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton
                    variant="rectangular"
                    className="h-6 w-20 rounded-full"
                  />
                  <Skeleton variant="text" className="h-4 w-12" />
                </div>
                <Skeleton variant="text" className="h-5 w-4/5" />
                <Skeleton variant="text" className="h-4 w-full" />
                <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <Skeleton variant="text" className="h-4 w-28" />
                  <Skeleton
                    variant="rectangular"
                    className="h-8 w-20 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardSkeleton;
