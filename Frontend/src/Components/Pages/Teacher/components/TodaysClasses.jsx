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

    const todaysClasses = schedule.filter((c) => c.day === todayStr);
    const map = {};

    todaysClasses.forEach((c) => {
      (c.slots || []).forEach((s) => {
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
        while (i + span < times.length && map[slotNum + span] === c) {
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
          type: c.type || "class",
        });

        i += span;
      } else {
        parsedClasses.push({
          id: `ts-${slotNum}`,
          time: times[i],
          type: "free",
        });
        i++;
      }
    }

    return parsedClasses;
  }, [schedule, todayStr]);

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10">
      <div className="mb-6 flex items-center space-x-2">
        <CalendarSVG className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Today&apos;s Classes ({todayStr})
        </h2>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center ${
              cls.type === "free"
                ? "border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50"
                : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <div className="mb-2 flex items-center space-x-4 sm:mb-0">
              <div className="flex items-center text-slate-400 dark:text-slate-500">
                <MissingSVG className="mr-1.5 h-4 w-4" />
                <span className="text-xs font-semibold">{cls.time}</span>
              </div>

              {cls.type !== "free" && (
                <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block"></div>
              )}

              <div>
                <h3
                  className={`text-sm font-bold ${
                    cls.type === "free"
                      ? "text-slate-400 dark:text-slate-500"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {cls.type === "free" ? "OFF / Free Period" : cls.courseName}
                </h3>
                {cls.type !== "free" && (
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    {cls.section}
                  </p>
                )}
              </div>
            </div>

            {cls.type !== "free" && (
              <div className="flex items-center self-start rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:self-auto">
                <LocationSVG className="mr-1 h-3.5 w-3.5" />
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
