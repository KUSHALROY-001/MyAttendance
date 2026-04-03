import React from "react";
import StatCard from "../../../UI/StatCard";
import { BookSVG, CalendarSVG, PlayCircleSVG, StackSVG } from "../../../UI/SVG";

const TeacherStats = ({
  totalCourses = 0,
  totalSessions = 0,
  thisMonthSessions = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="TOTAL COURSES"
        value={totalCourses}
        icon={<BookSVG className="w-5 h-5 text-indigo-600" />}
        iconBg="bg-indigo-50"
      />
      <StatCard
        title="ACTIVE SESSIONS"
        value="0"
        icon={<PlayCircleSVG className="w-5 h-5 text-emerald-600" />}
        iconBg="bg-emerald-50"
      />
      <StatCard
        title="TOTAL SESSIONS"
        value={totalSessions}
        icon={<CalendarSVG className="w-5 h-5 text-purple-600" />}
        iconBg="bg-purple-50"
      />
      <StatCard
        title="THIS MONTH"
        value={thisMonthSessions}
        subtext="Sessions conducted"
        icon={<StackSVG className="w-5 h-5 text-orange-600" />}
        iconBg="bg-orange-50"
      />
    </div>
  );
};

export default TeacherStats;
