import React, { useMemo } from "react";
import { CalendarSVG, MissingSVG, LocationSVG } from "../../../UI/SVG";

const formatTimeLabel = (timeValue) => {
  if (!timeValue) return "Time TBA";

  const [hoursText, minutesText] = String(timeValue).split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;

  return `${normalizedHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const TodaysClasses = ({ routine }) => {
  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const classes = useMemo(() => {
    const today = routine?.days?.find((day) => day.day === todayStr);

    if (!today) return [];

    return today.entries.map((entry) => ({
      id: entry.id,
      time:
        entry.startTime && entry.endTime
          ? `${formatTimeLabel(entry.startTime)} - ${formatTimeLabel(entry.endTime)}`
          : "Time TBA",
      courseName: entry.courseName,
      section: `${entry.department} Sem ${entry.semester} Sec ${entry.section}`,
      room: entry.room || "TBA",
      type: entry.classType || "class",
    }));
  }, [routine, todayStr]);

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10">
      <div className="mb-6 flex items-center space-x-2">
        <CalendarSVG className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Today&apos;s Classes ({todayStr})
        </h2>
      </div>

      <div className="space-y-4">
        {classes.length > 0 ? classes.map((cls) => (
          <div
            key={cls.id}
            className={`flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center ${
              cls.type === "lab"
                ? "border-amber-200 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-500/10"
                : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <div className="mb-2 flex items-center space-x-4 sm:mb-0">
              <div className="flex items-center text-slate-400 dark:text-slate-500">
                <MissingSVG className="mr-1.5 h-4 w-4" />
                <span className="text-xs font-semibold">{cls.time}</span>
              </div>

              <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block"></div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {cls.courseName}
                </h3>
                <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  {cls.section}
                </p>
              </div>
            </div>

            <div className="flex items-center self-start rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:self-auto">
              <LocationSVG className="mr-1 h-3.5 w-3.5" />
              <span className="text-xs font-bold">{cls.room}</span>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            No classes scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysClasses;
