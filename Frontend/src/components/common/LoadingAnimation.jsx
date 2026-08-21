import DashboardSkeleton from "./skeletons/DashboardSkeleton";

const LoadingAnimation = () => {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <DashboardSkeleton />
    </div>
  );
};

export default LoadingAnimation;
