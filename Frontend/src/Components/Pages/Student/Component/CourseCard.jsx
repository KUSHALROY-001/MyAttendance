import { BookSVG, ExclamationCircleSVG } from "../../../UI/SVG";

const CourseCard = ({ course, onClick }) => {
  const isLow = course.percentage < 75;

  return (
    <button
      type="button"
      onClick={() => onClick?.(course.courseCode)}
      className={`group block rounded-2xl border bg-white p-6 transition-all dark:bg-slate-900 ${
        isLow
          ? "border-red-200 shadow-md shadow-red-50/50 dark:border-red-500/20 dark:shadow-none"
          : "border-slate-200 shadow-sm dark:border-slate-800"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isLow
                ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300"
                : "bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300"
            }`}
          >
            <BookSVG className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {course.courseName}
            </h3>
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
              {course.courseCode}
            </p>
          </div>
        </div>
        {isLow && (
          <span className="flex items-center rounded border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-black uppercase tracking-tight text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <ExclamationCircleSVG className="mr-1 h-3 w-3" />
            Low
          </span>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            Attendance
          </span>
          <span
            className={`text-sm font-black ${
              isLow ? "text-red-500" : "text-green-500"
            }`}
          >
            {course.percentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isLow ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${course.percentage}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          {course.attendedClasses} / {course.totalClasses} classes attended
        </p>
      </div>

      {/* <div className="mt-6 flex items-center space-x-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <img
          src={`https://i.pravatar.cc/150?u=${course.courseId}`}
          className="h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700"
          alt="Instructor"
        />
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          Dr. Smith
        </span>
      </div> */}
    </button>
  );
};

export default CourseCard;
