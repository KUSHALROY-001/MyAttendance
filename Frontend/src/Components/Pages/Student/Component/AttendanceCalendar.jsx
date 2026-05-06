import AttendanceCircle from "./AttendanceCircle";
import { ChevronLeftSVG, ChevronRightSVG } from "../../../UI/SVG";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AttendanceCalendar = ({
  month,
  days,
  onPreviousMonth,
  onNextMonth,
  title = "Attendance Calendar",
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onPreviousMonth}
            className="rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Previous month"
          >
            <ChevronLeftSVG className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {month.toLocaleString("default", { month: "long" })}{" "}
            {month.getFullYear()}
          </span>
          <button
            onClick={onNextMonth}
            className="rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Next month"
          >
            <ChevronRightSVG className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span>No class</span>
        </div>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
          Periods clockwise: 1st - 2nd - 3rd - 4th
        </span>
      </div>

      <div className="grid grid-cols-6 gap-x-2 gap-y-5 text-center">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500"
          >
            {d}
          </div>
        ))}

        {days.map((day, idx) => (
          <div
            key={idx}
            className={`group relative flex cursor-pointer flex-col items-center ${
              !day.isCurrentMonth ? "opacity-40" : ""
            }`}
          >
            <div className="relative h-10 w-10">
              <div
                className={`absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800 ${
                  !day.isCurrentMonth ? "opacity-60" : ""
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <AttendanceCircle periods={day.periods} />
              </div>
              <span
                className={`absolute inset-0 flex items-center justify-center text-[14px] font-bold ${
                  day.isCurrentMonth
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {day.date.getDate()}
              </span>
            </div>

            <div className="pointer-events-none absolute -bottom-16 z-20 whitespace-nowrap rounded bg-slate-900 p-2 text-[10px] text-white opacity-0 shadow-xl transition-all group-hover:opacity-100">
              P1: {day.periods[0] || "-"} | P2: {day.periods[1] || "-"} <br />
              P3: {day.periods[2] || "-"} | P4: {day.periods[3] || "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
