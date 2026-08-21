import React from "react";
import Skeleton from "./Skeleton";

const TableSkeleton = ({ rows = 6, columns = 5 }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Toolbar / Search Filter Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton
          variant="rectangular"
          className="h-10 w-full max-w-sm rounded-xl"
        />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
          <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Table Box */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-2">
              <Skeleton variant="text" className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center px-6 py-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1 px-2">
                  <Skeleton
                    variant="text"
                    className={`h-4 ${
                      colIndex === 0
                        ? "w-3/4 font-medium"
                        : colIndex === columns - 1
                          ? "w-16 rounded-full"
                          : "w-1/2"
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
