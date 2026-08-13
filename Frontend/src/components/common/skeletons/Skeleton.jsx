import React from "react";

const Skeleton = ({
  className = "",
  variant = "rectangular", // 'text', 'circular', 'rectangular'
  width,
  height,
  count = 1,
}) => {
  const variantClasses = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full shrink-0",
    rectangular: "rounded-xl w-full",
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const skeletonElement = (index = 0) => (
    <div
      key={index}
      style={style}
      className={`relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 ${variantClasses[variant] || ""} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
    </div>
  );

  if (count > 1) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: count }).map((_, i) => skeletonElement(i))}
      </div>
    );
  }

  return skeletonElement(0);
};

export default Skeleton;
