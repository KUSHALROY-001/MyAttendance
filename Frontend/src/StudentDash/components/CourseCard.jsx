import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, to }) => {
  const isLow = course.percentage < 75;

  return (
    <Link
      to={to}
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeWidth="2"
              />
            </svg>
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
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeWidth="2"
              />
            </svg>
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
