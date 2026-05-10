import React from "react";
import { BookSVG, LocationSVG, MissingSVG } from "../../../UI/SVG";

const WeeklySchedule = ({ routine }) => {
  const days = routine?.days || [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-start gap-3">
        <BookSVG className="mt-2 h-10 w-10 text-indigo-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Weekly Schedule
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Built directly from the admin class timetable.
          </p>
        </div>
      </div>

      {days.every((day) => day.entries.length === 0) ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No weekly schedule has been published for this teacher yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day) => (
            <section
              key={day.day}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2 md:p-4 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                  {day.day}
                </h3>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {day.entries.length} class
                  {day.entries.length === 1 ? "" : "es"}
                </span>
              </div>

              {day.entries.length > 0 ? (
                <div className="space-y-3">
                  {day.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`rounded-xl border p-2 md:p-4 shadow-sm ${
                        entry.classType === "lab"
                          ? "border-amber-200 bg-amber-50/90 dark:border-amber-500/20 dark:bg-amber-500/10"
                          : "border-indigo-200 bg-white dark:border-indigo-500/20 dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {entry.courseName}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {entry.courseCode}
                          </p>
                        </div>
                        <span className="rounded-md md:rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {entry.startTime && entry.endTime
                            ? `${entry.startTime} - ${entry.endTime}`
                            : "Time TBA"}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <p>
                          {entry.department} Sem {entry.semester} Sec{" "}
                          {entry.section}
                        </p>
                        <div className="flex items-center gap-2">
                          <LocationSVG className="h-3.5 w-3.5" />
                          <span>{entry.room || "Room TBA"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <MissingSVG className="h-4 w-4" />
                  <span>No classes assigned.</span>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
