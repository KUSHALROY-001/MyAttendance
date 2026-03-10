import React from "react";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-transform hover:translate-y-[-2px]">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shadow-inner border border-gray-100">
      {icon}
    </div>
  </div>
);

export default StatCard;
