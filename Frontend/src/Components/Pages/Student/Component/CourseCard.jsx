import { Link } from "react-router-dom";
import { BookSVG, ExclamationCircleSVG } from "../../../UI/SVG";

const CourseCard = ({ course, to, state }) => {
  const isLow = course.percentage < 75;

  return (
    <Link
      to={to}
      state={state}
      className={`group block bg-white rounded-2xl p-6 border transition-all ${
        isLow
          ? "border-red-100 shadow-red-50/50 shadow-md"
          : "border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLow ? "bg-red-50 text-red-500" : "bg-indigo-50 text-indigo-500"
            }`}
          >
            <BookSVG className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {course.courseName}
            </h3>
            <p className="text-[10px] text-gray-400 uppercase font-black">
              {course.courseCode}
            </p>
          </div>
        </div>
        {isLow && (
          <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-tight flex items-center">
            <ExclamationCircleSVG className="w-3 h-3 mr-1" />
            Low
          </span>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-400">Attendance</span>
          <span
            className={`text-sm font-black ${isLow ? "text-red-500" : "text-green-500"}`}
          >
            {course.percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isLow ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${course.percentage}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium">
          {course.attendedClasses} / {course.totalClasses} classes attended
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center space-x-2">
        <img
          src={`https://i.pravatar.cc/150?u=${course.courseId}`}
          className="w-6 h-6 rounded-full border border-gray-100"
          alt="Instructor"
        />
        <span className="text-[10px] font-bold text-gray-500">Dr. Smith</span>
      </div>
    </Link>
  );
};

export default CourseCard;
