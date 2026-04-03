const RecentAttendanceList = ({ records }) => {
  // Flatten the grouped records back into an array to show individual classes
  const allRecords = [];
  Object.keys(records).forEach((date) => {
    records[date].forEach((rec) => {
      allRecords.push({ ...rec, displayDate: date });
    });
  });

  // Sort them descending by date
  allRecords.sort(
    (a, b) =>
      new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime(),
  );

  return (
    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Recent Attendance
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[400px]">
        {allRecords.map((rec, index) => {
          // Status from backend might be mixed case, let's normalize to uppercase
          const status = (rec.status || "NO CLASS").toUpperCase();
          const course = rec.course || null;

          return (
            <div
              key={`${rec.displayDate}-${index}`}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-colors ${
                status === "PRESENT"
                  ? "bg-green-50/50 border-green-100"
                  : status === "LATE"
                    ? "bg-orange-50/50 border-orange-100"
                    : status === "ABSENT"
                      ? "bg-red-50/50 border-red-100"
                      : status === "LEAVE"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === "PRESENT"
                      ? "bg-green-500"
                      : status === "LATE"
                        ? "bg-orange-500"
                        : status === "ABSENT"
                          ? "bg-red-500"
                          : status === "LEAVE"
                            ? "bg-gray-500"
                            : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="text-[1rem] font-bold text-gray-900 leading-tight">
                    {course?.name || "—"}
                  </p>
                  <p className="text-[13px] text-gray-400 uppercase tracking-tighter mt-0.5">
                    {course?.code || ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-[12px] uppercase font-black tracking-widest ${
                    status === "PRESENT"
                      ? "text-green-600"
                      : status === "LATE"
                        ? "text-orange-600"
                        : status === "ABSENT"
                          ? "text-red-600"
                          : status === "LEAVE"
                            ? "text-gray-500"
                            : "text-gray-500"
                  }`}
                >
                  {status}
                </p>
                <p className="text-[12px] font-medium text-gray-400 mt-0.5">
                  {new Date(rec.displayDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        {allRecords.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No recent records.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentAttendanceList;
