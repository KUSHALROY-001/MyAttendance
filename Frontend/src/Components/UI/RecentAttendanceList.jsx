import React from "react";

const getStatus = (records) => {
  if (records.some((r) => r.status === "Absent")) return "ABSENT";
  if (records.some((r) => r.status === "Present" || r.status === "Late"))
    return "PRESENT";
  return "NO CLASS";
};

const RecentAttendanceList = ({ records }) => {
  const sortedDates = Object.keys(records).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Recent Attendance
      </h2>
      <div className="space-y-4">
        {sortedDates.slice(0, 10).map((date) => {
          const dateRecords = records[date] || [];
          const status = getStatus(dateRecords);
          const course = dateRecords[0]?.course || null;

          return (
            <div key={date} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === "PRESENT"
                      ? "bg-green-500"
                      : status === "ABSENT"
                        ? "bg-red-500"
                        : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="text-[1rem] font-bold text-gray-900">
                    {course?.name || "—"}
                  </p>
                  <p className="text-[13px] text-gray-400 uppercase tracking-tighter">
                    {course?.code || ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-[15px] font-black ${
                    status === "PRESENT"
                      ? "text-green-600"
                      : status === "ABSENT"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {status}
                </p>
                <p className="text-[13px] text-gray-400">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAttendanceList;
