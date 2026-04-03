import React, { useMemo } from "react";
import { CalendarSVG, MissingSVG, LocationSVG } from "../../../UI/SVG";

const TodaysClasses = ({ schedule }) => {
  const times = [
    "11:30 AM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 02:50 PM",
    "02:50 PM - 03:40 PM",
    "03:40 PM - 04:30 PM",
    "04:30 PM - 05:20 PM",
  ];

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const classes = useMemo(() => {
    if (!schedule || schedule.length === 0) return [];
    
    const todaysClasses = schedule.filter(c => c.day === todayStr);
    const map = {};
    
    todaysClasses.forEach(c => {
      (c.slots || []).forEach(s => {
        map[s] = c;
      });
    });
    
    const parsedClasses = [];
    let i = 0;
    while (i < times.length) {
      const slotNum = i + 1;
      const c = map[slotNum];
      
      if (c) {
        let span = 1;
        while ((i + span) < times.length && map[slotNum + span] === c) {
          span++;
        }
        
        const startLabel = times[i].split(" - ")[0];
        const endLabel = times[i + span - 1].split(" - ")[1];
        
        parsedClasses.push({
          id: `ts-${slotNum}`,
          time: `${startLabel} - ${endLabel}`,
          courseName: c.subject,
          section: `${c.department} Sem ${c.semester} Sec ${c.section}`,
          room: c.room || "TBA",
          type: c.type || "class"
        });
        
        i += span;
      } else {
        parsedClasses.push({
          id: `ts-${slotNum}`,
          time: times[i],
          type: "free"
        });
        i++;
      }
    }
    
    return parsedClasses;
  }, [schedule, todayStr]);

  return (
    <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CalendarSVG className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-gray-900">
          Today's Classes ({todayStr})
        </h2>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
              cls.type === "free"
                ? "bg-gray-50 border-gray-100 border-dashed"
                : "bg-white border-gray-100 shadow-sm"
            }`}
          >
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <div className="flex items-center text-gray-400">
                <MissingSVG className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-semibold">{cls.time}</span>
              </div>

              {cls.type !== "free" && (
                <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              )}

              <div>
                <h3
                  className={`text-sm font-bold ${
                    cls.type === "free" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {cls.type === "free" ? "OFF / Free Period" : cls.courseName}
                </h3>
                {cls.type !== "free" && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {cls.section}
                  </p>
                )}
              </div>
            </div>

            {cls.type !== "free" && (
              <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 self-start sm:self-auto">
                <LocationSVG className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">{cls.room}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysClasses;
