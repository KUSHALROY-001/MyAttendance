const StatCard = ({ title, value, icon, iconBg }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-xl font-black text-gray-900">{value}</h3>
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
