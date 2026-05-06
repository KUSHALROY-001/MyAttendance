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
    "bg-red-50 dark:bg-red-500/10",
    "bg-blue-50 dark:bg-blue-500/10",
    "bg-green-50 dark:bg-green-500/10",
    "bg-yellow-50 dark:bg-yellow-500/10",
    "bg-purple-50 dark:bg-purple-500/10",
    "bg-orange-50 dark:bg-orange-500/10",
    "bg-indigo-50 dark:bg-indigo-500/10",
    "bg-pink-50 dark:bg-pink-500/10",
    "bg-teal-50 dark:bg-teal-500/10",
  ];

  const timetable = React.useMemo(() => {
    const map = {};
    times.forEach((t) => (map[t] = {}));

    if (!schedule || schedule.length === 0) return map;

    schedule.forEach((cls) => {
      const slots = cls.slots || [];
      if (slots.length === 0) return;

      const sortedSlots = [...slots].sort((a, b) => a - b);
      const startSlot = sortedSlots[0];
      const timeLabel = times[startSlot - 1];

      if (timeLabel && cls.day) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        map[timeLabel][cls.day] = {
          name: cls.subject,
          section: `${cls.department} Sem ${cls.semester} Sec ${cls.section}`,
          room: cls.room || "TBA",
          color: randomColor,
          colSpan: sortedSlots.length,
        };
      }
    });

    return map;
  }, [schedule]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center space-x-2">
        <BookSVG className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Weekly Schedule
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <tr>
              <th className="w-32 border-b border-r border-slate-300 bg-slate-100 p-3 text-left text-[10px] font-bold uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                Day / Time
              </th>
              {times.map((time) => (
                <th
                  key={time}
                  className="min-w-[120px] border-b border-slate-300 bg-slate-100 p-3 text-center text-[12px] font-bold uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
                className="border-b border-slate-300 hover:bg-slate-50/40 dark:border-slate-700 dark:hover:bg-slate-800/40"
              >
                <td className="border-r border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {day}
                    </span>
                    {day === "Monday" && (
                      <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        Today
                      </span>
                    )}
                  </div>
                </td>
                {times.map((time, index) => {
                  const cellData = timetable[time]?.[day];

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
                      className={`border border-slate-300 p-2 text-center dark:border-slate-700 ${
                        cellData ? cellData.color : "bg-white dark:bg-slate-900"
                      }`}
                    >
                      {cellData ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-0.5">
                          <span className="text-[13px] font-bold leading-tight text-slate-900 dark:text-slate-100">
                            {cellData.name}
                          </span>
                          <span className="text-[12px] leading-tight text-slate-500 dark:text-slate-400">
                            {cellData.section}
                          </span>
                          <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                            {cellData.room}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">-</span>
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
