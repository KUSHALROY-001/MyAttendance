import Skeleton from "./Skeleton";

const AcademicOptionsSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton variant="rectangular" className="h-8 w-16 rounded-xl" />
              <div className="flex gap-2">
                <Skeleton variant="circular" className="h-7 w-7" />
                <Skeleton variant="circular" className="h-7 w-7" />
              </div>
            </div>
            <Skeleton variant="text" className="h-6 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2" />

            {/* Semester pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton
                variant="rectangular"
                className="h-6 w-20 rounded-full"
              />
              <Skeleton
                variant="rectangular"
                className="h-6 w-20 rounded-full"
              />
              <Skeleton
                variant="rectangular"
                className="h-6 w-20 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="rectangular" className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcademicOptionsSkeleton;
