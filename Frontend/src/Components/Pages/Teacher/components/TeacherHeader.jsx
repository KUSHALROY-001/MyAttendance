import React from "react";

const TeacherHeader = ({ teacherName, onStartAttendance }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {teacherName}
        </h1>
        <p className="text-gray-500 font-medium text-sm mt-1">
          Manage your classes and track attendance
        </p>
      </div>
      <button 
        onClick={onStartAttendance}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Start Attendance
      </button>
    </div>
  );
};

export default TeacherHeader;
