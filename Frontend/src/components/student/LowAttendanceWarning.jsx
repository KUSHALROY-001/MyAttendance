import { AlertTriangle, X } from "lucide-react";

const LowAttendanceWarning = ({ lowAttendanceSubjects }) => {
  if (lowAttendanceSubjects.length === 0) return null;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-500/20 dark:bg-[#151518] dark:text-red-100">
      <div className="mb-4 flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <span className="text-sm font-bold uppercase tracking-tight">
          Low Attendance Warning
        </span>
      </div>
      <p className="mb-4 text-sm font-medium">
        You have low attendance (&lt;75%) in{" "}
        {lowAttendanceSubjects.length} subject(s):
      </p>
      <div className="mb-4 space-y-2">
        {lowAttendanceSubjects.map((subject) => (
          <div
            key={subject.courseCode}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 rotate-45 text-red-400" />
              <span className="font-bold text-red-700">
                {subject.courseName}
              </span>
              <span className="text-red-400 dark:text-red-300">
                ({subject.courseCode})
              </span>
            </div>
            <span className="font-black">
              {subject.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-red-500 dark:text-red-300">
        Maintain at least 75% attendance to be eligible for examinations.
      </p>
    </div>
  );
};

export default LowAttendanceWarning;
