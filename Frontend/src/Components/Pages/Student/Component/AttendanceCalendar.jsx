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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onPreviousMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftSVG className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-gray-900">
            {month.toLocaleString("default", { month: "long" })}{" "}
            {month.getFullYear()}
          </span>
          <button
            onClick={onNextMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRightSVG className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-100" />
          <span>No class</span>
        </div>
        <span className="text-[10px] font-medium text-gray-400">
          Periods clockwise: 1st • 2nd • 3rd • 4th
        </span>
      </div>

      <div className="grid grid-cols-6 gap-y-5 gap-x-2 text-center">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
          >
            {d}
          </div>
        ))}

        {days.map((day, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center group relative cursor-pointer ${
              !day.isCurrentMonth ? "opacity-40" : ""
            }`}
          >
            <div className="relative w-10 h-10">
              <div
                className={`absolute inset-0 rounded-full bg-gray-100 ${
                  !day.isCurrentMonth ? "opacity-60" : ""
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <AttendanceCircle periods={day.periods} />
              </div>
              <span
                className={`absolute inset-0 flex items-center justify-center text-[14px] font-bold ${
                  day.isCurrentMonth ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {day.date.getDate()}
              </span>
            </div>

            <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-all z-20 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap pointer-events-none">
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
