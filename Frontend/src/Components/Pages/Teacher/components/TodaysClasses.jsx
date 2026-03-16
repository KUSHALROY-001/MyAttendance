import React from "react";

const TodaysClasses = ({ classes }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <svg
          className="w-5 h-5 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h2 className="text-lg font-bold text-gray-900">
          Today's Classes (Monday)
        </h2>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
              cls.type === "free"
                ? "bg-gray-50 border-gray-100 border-dashed"
                : "bg-white border-gray-100 shadow-sm"
            }`}
          >
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <div className="flex items-center text-gray-400">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-semibold">{cls.time}</span>
              </div>

              {cls.type !== "free" && (
                <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              )}

              <div>
                <h3
                  className={`text-sm font-bold ${
                    cls.type === "free" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {cls.type === "free" ? "OFF / Free Period" : cls.courseName}
                </h3>
                {cls.type !== "free" && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {cls.section}
                  </p>
                )}
              </div>
            </div>

            {cls.type !== "free" && (
              <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 self-start sm:self-auto">
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-xs font-bold">{cls.room}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysClasses;
