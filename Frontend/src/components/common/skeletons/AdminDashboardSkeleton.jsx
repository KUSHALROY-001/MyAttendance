import Skeleton from "./Skeleton";

const AdminDashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" className="h-8 w-56" />
        <Skeleton variant="text" className="h-4 w-80" />
      </div>

      {/* 3 StatCards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-3 w-24" />
              <Skeleton variant="text" className="h-7 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions Table Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 p-5 space-y-4">
        <Skeleton variant="text" className="h-6 w-44" />
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="space-y-1.5 flex-1 pr-4">
                <Skeleton variant="text" className="h-4 w-40" />
                <Skeleton variant="text" className="h-3 w-24" />
              </div>
              <Skeleton variant="rectangular" className="h-6 w-24 rounded" />
              <Skeleton variant="text" className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
