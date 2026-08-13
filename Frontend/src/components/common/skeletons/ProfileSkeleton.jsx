import React from "react";
import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Skeleton variant="circular" className="h-24 w-24" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <Skeleton variant="text" className="mx-auto h-7 w-48 sm:mx-0" />
            <Skeleton variant="text" className="mx-auto h-4 w-32 sm:mx-0" />
            <Skeleton
              variant="rectangular"
              className="mx-auto h-6 w-24 rounded-full sm:mx-0"
            />
          </div>
        </div>
      </div>

      {/* Form Fields Card Skeleton */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Skeleton variant="text" className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" className="h-4 w-24" />
              <Skeleton
                variant="rectangular"
                className="h-11 w-full rounded-xl"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
          <Skeleton variant="rectangular" className="h-11 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
