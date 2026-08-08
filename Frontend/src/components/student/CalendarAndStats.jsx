import AttendanceCalendar from "./AttendanceCalendar";
import QuickStats from "./QuickStats";

const CalendarAndStats = ({
  calendarMonth,
  calendarDays,
  goToPreviousMonth,
  goToNextMonth,
  summaries,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <AttendanceCalendar
          month={calendarMonth}
          days={calendarDays}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
      </div>
      <QuickStats summaries={summaries} />
    </div>
  );
};

export default CalendarAndStats;
