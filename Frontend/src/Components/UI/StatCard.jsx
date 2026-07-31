const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  isEffect = true,
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#151518] p-4 overflow-hidden relative group transition-all duration-300 ${
        isEffect
          ? "hover:scale-[1.02] hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-[#1C1C22]"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
