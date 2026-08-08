import { BarChart2, ClipboardCheck, Calendar, AlertTriangle } from "lucide-react";
import StatCard from "../common/StatCard";

const StudentStatCards = ({
  overallPercentage,
  enrolledCoursesCount,
  overallAttended,
  overallTotal,
  lowAttendanceCount,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="OVERALL ATTENDANCE"
        value={`${overallPercentage.toFixed(1)}%`}
        icon={<BarChart2 className="w-5 h-5" />}
      />
      <StatCard
        title="ENROLLED COURSES"
        value={enrolledCoursesCount}
        icon={<ClipboardCheck className="w-5 h-5" />}
      />
      <StatCard
        title="CLASSES ATTENDED"
        value={`${overallAttended} of ${overallTotal}`}
        icon={<Calendar className="w-5 h-5" />}
      />
      <StatCard
        title="LOW ATTENDANCE"
        value={lowAttendanceCount.toString()}
        icon={<AlertTriangle className="w-5 h-5" />}
      />
    </div>
  );
};

export default StudentStatCards;
