import React from "react";
import Skeleton from "./Skeleton";

const CardGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton variant="text" className="h-7 w-48" />
        <Skeleton variant="rectangular" className="h-10 w-40 rounded-xl" />
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton
                  variant="rectangular"
                  className="h-6 w-24 rounded-full"
                />
                <Skeleton variant="circular" className="h-8 w-8" />
              </div>
              <Skeleton variant="text" className="h-5 w-4/5" />
              <Skeleton variant="text" className="h-3.5 w-full" />
              <Skeleton variant="text" className="h-3.5 w-2/3" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <Skeleton variant="text" className="h-4 w-20" />
              <Skeleton
                variant="rectangular"
                className="h-8 w-24 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGridSkeleton;
