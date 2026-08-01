import React from "react";
import StatCard from "../common/StatCard";
import { BookOpen, PlayCircle, Calendar, Layers } from "lucide-react";

const TeacherStats = ({
  totalCourses = 0,
  totalSessions = 0,
  thisMonthSessions = 0,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="TOTAL COURSES"
        value={totalCourses}
        icon={<BookOpen className="h-5 w-5 text-indigo-600" />}
        iconBg="bg-indigo-50 dark:bg-indigo-500/10"
      />
      <StatCard
        title="ACTIVE SESSIONS"
        value="0"
        icon={<PlayCircle className="h-5 w-5 text-emerald-600" />}
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
      />
      <StatCard
        title="TOTAL SESSIONS"
        value={totalSessions}
        icon={<Calendar className="h-5 w-5 text-purple-600" />}
        iconBg="bg-purple-50 dark:bg-purple-500/10"
      />
      <StatCard
        title="THIS MONTH"
        value={thisMonthSessions}
        subtext="Sessions conducted"
        icon={<Layers className="h-5 w-5 text-orange-600" />}
        iconBg="bg-orange-50 dark:bg-orange-500/10"
      />
    </div>
  );
};

export default TeacherStats;
