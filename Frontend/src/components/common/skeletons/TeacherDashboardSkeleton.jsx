import React from "react";
import Skeleton from "./Skeleton";

const TeacherDashboardSkeleton = () => {
  return (
    <div className="mx-4 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 pb-12 mt-6">
        {/* TeacherHeader Skeleton */}
        <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton variant="text" className="h-8 w-56 sm:h-9 sm:w-72" />
              <Skeleton variant="circular" className="h-10 w-10" />
            </div>
            <Skeleton variant="text" className="h-4 w-64" />
          </div>
          <Skeleton variant="rectangular" className="h-10 w-40 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* TodaysClasses Skeleton Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="h-6 w-36" />
              <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 space-y-2.5"
                >
                  <Skeleton variant="text" className="h-5 w-3/4" />
                  <Skeleton variant="text" className="h-4 w-1/2" />
                  <Skeleton variant="rectangular" className="h-8 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* WeeklySchedule Skeleton Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <Skeleton variant="text" className="h-6 w-44" />
            <Skeleton variant="rectangular" className="h-48 w-full rounded-xl" />
          </div>

          {/* TeacherStats Skeleton (4 StatCards) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" className="h-3 w-20" />
                  <Skeleton variant="text" className="h-7 w-24" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Split (1 col TeacherCourses, 2 cols AttendanceSessions) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TeacherCourses Card (1 col) */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <Skeleton variant="text" className="h-6 w-36" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2"
                  >
                    <Skeleton variant="text" className="h-4 w-4/5" />
                    <Skeleton variant="text" className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </div>

            {/* AttendanceSessions Card (2 cols) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <Skeleton variant="text" className="h-6 w-44" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800"
                  >
                    <div className="space-y-1.5 flex-1">
                      <Skeleton variant="text" className="h-4 w-3/4" />
                      <Skeleton variant="text" className="h-3 w-1/2" />
                    </div>
                    <Skeleton variant="rectangular" className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardSkeleton;
