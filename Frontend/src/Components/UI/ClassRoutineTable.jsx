import React, { useMemo } from "react";
import { BookSVG } from "./SVG";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatTimeLabel = (timeValue) => {
  if (!timeValue) return "Time TBA";

  const [hoursText, minutesText] = String(timeValue).split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;
  return `${normalizedHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

const ClassRoutineTable = ({
  title,
  subtitle,
  periods = [],
  entries = [],
  emptyMessage = "No routine has been published yet.",
}) => {
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const periodColumns = useMemo(
    () =>
      [...periods]
        .filter((period) => Number.isInteger(period.periodNumber))
        .sort((a, b) => a.periodNumber - b.periodNumber),
    [periods],
  );

  const entryMap = useMemo(() => {
    const map = new Map();

    entries.forEach((entry) => {
      map.set(`${entry.day}-${entry.periodNumber}`, entry);
    });

    return map;
  }, [entries]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center space-x-2">
          <BookSVG className="h-5 w-5 text-indigo-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {periodColumns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full border-collapse">
            <thead>
              <tr>
                <th className="w-32 border-b border-r border-slate-300 bg-slate-100 p-3 text-left text-[10px] font-bold uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  Day / Period
                </th>
                {periodColumns.map((period) => (
                  <th
                    key={period.periodNumber}
                    className="min-w-[150px] border-b border-slate-300 bg-slate-100 p-3 text-center dark:border-slate-700 dark:bg-slate-800"
                  >
                    <p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300">
                      {period.type === "lunch"
                        ? "Break"
                        : `Period ${period.periodNumber}`}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {formatTimeLabel(period.startTime)} -{" "}
                      {formatTimeLabel(period.endTime)}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr
                  key={day}
                  className="border-b border-slate-300 dark:border-slate-700"
                >
                  <td className="border-r border-slate-300 bg-white p-3 align-top dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {day}
                      </span>
                      {day === todayLabel ? (
                        <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          Today
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {periodColumns.map((period) => {
                    if (period.type === "lunch") {
                      return (
                        <td
                          key={`${day}-${period.periodNumber}`}
                          className="border border-slate-300 bg-amber-50/60 p-2 text-center dark:border-slate-700 dark:bg-amber-500/10"
                        >
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">
                            Break
                          </span>
                        </td>
                      );
                    }

                    const entry = entryMap.get(
                      `${day}-${period.periodNumber}`,
                    );

                    return (
                      <td
                        key={`${day}-${period.periodNumber}`}
                        className={`border border-slate-300 p-2 align-top dark:border-slate-700 ${
                          entry
                            ? entry.classType === "lab"
                              ? "bg-amber-50/70 dark:bg-amber-500/10"
                              : "bg-indigo-50/60 dark:bg-indigo-500/10"
                            : "bg-white dark:bg-slate-900"
                        }`}
                      >
                        {entry ? (
                          <div className="space-y-1 text-left">
                            <p className="text-[13px] font-bold leading-tight text-slate-900 dark:text-slate-100">
                              {entry.courseName}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              {entry.courseCode}
                            </p>
                            {entry.teacherName ? (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {entry.teacherName}
                              </p>
                            ) : null}
                            {entry.department &&
                            entry.semester &&
                            entry.section ? (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {entry.department} Sem {entry.semester} Sec{" "}
                                {entry.section}
                              </p>
                            ) : null}
                            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              {entry.room || "Room TBA"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">
                            -
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassRoutineTable;
