import React from "react";

const AdminStatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = "text-indigo-500",
  bgColor = "bg-indigo-500/10",
}) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-hidden relative group">
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl"
        style={{
          backgroundColor: "currentColor",
          color: iconColor.replace("text-", ""),
        }}
      ></div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
};

export default AdminStatCard;
