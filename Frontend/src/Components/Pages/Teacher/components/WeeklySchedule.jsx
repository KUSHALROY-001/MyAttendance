import React from "react";
import { BookSVG } from "../../../UI/SVG";

const WeeklySchedule = ({ schedule }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const times = [
    "11:30 AM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 02:50 PM",
    "02:50 PM - 03:40 PM",
    "03:40 PM - 04:30 PM",
    "04:30 PM - 05:20 PM",
  ];

  const colors = [
    "bg-red-50", "bg-blue-50", "bg-green-50", 
    "bg-yellow-50", "bg-purple-50", "bg-orange-50", 
    "bg-indigo-50", "bg-pink-50", "bg-teal-50"
  ];

  const timetable = React.useMemo(() => {
    const map = {};
    times.forEach(t => map[t] = {});
    
    if (!schedule || schedule.length === 0) return map;

    schedule.forEach((cls) => {
      const slots = cls.slots || [];
      if (slots.length === 0) return;
      
      const sortedSlots = [...slots].sort((a,b) => a - b);
      const startSlot = sortedSlots[0];
      const timeLabel = times[startSlot - 1]; // slots are 1-indexed
      
      if (timeLabel && cls.day) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        map[timeLabel][cls.day] = {
          name: cls.subject,
          section: `${cls.department} Sem ${cls.semester} Sec ${cls.section}`,
          room: cls.room || "TBA",
          color: randomColor,
          colSpan: sortedSlots.length
        };
      }
    });
    
    return map;
  }, [schedule]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 overflow-hidden">
      <div className="flex items-center space-x-2 mb-6">
        <BookSVG className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-r border-gray-300 text-[10px] uppercase font-bold text-gray-500 bg-gray-200 w-32">
                Day / Time
              </th>
              {times.map((time) => (
                <th
                  key={time}
                  className="p-3 text-center border-b border-gray-300 text-[12px] uppercase font-bold text-gray-600 bg-gray-200 min-w-[120px]"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr
                key={day}
                className="border-b border-gray-300 hover:bg-gray-50/20"
              >
                <td className="p-3 border-r border-gray-300 bg-white">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {day}
                    </span>
                    {day === "Monday" && (
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                </td>
                {times.map((time, index) => {
                  const cellData = timetable[time]?.[day];

                  // Skip rendering cell if standard slot but has colSpan covered by previous slot
                  if (
                    index > 0 &&
                    timetable[times[index - 1]]?.[day]?.colSpan > 1
                  ) {
                    return null;
                  }

                  return (
                    <td
                      key={`${day}-${time}`}
                      colSpan={cellData?.colSpan || 1}
                      className={`p-2 border border-gray-300 text-center ${
                        cellData ? cellData.color : "bg-white"
                      }`}
                    >
                      {cellData ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-0.5">
                          <span className="text-[13px] font-bold text-gray-900 leading-tight">
                            {cellData.name}
                          </span>
                          <span className="text-[12px] text-gray-500 leading-tight">
                            {cellData.section}
                          </span>
                          <span className="text-[12px] text-gray-400 font-medium">
                            {cellData.room}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySchedule;
