import React from "react";

export default function TakeAttendanceRoster({
  students,
  attendance,
  onStatusChange,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Student Attendance List
        </h3>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {students.map((student) => {
          const status = attendance[student.id];

          let cardBg = "bg-white dark:bg-slate-900";
          if (status === "Present") {
            cardBg = "bg-emerald-50/30 dark:bg-emerald-500/10";
          }
          if (status === "Absent") {
            cardBg = "bg-red-50/30 dark:bg-red-500/10";
          }
          if (status === "Late") {
            cardBg = "bg-amber-50/30 dark:bg-amber-500/10";
          }

          return (
            <div
              key={student.id}
              className={`flex flex-col justify-between px-2 md:px-6 py-2 md:py-4 transition-colors sm:flex-row sm:items-center ${cardBg}`}
            >
              <div className="mb-4 flex items-center space-x-4 sm:mb-0">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-800"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300">
                    {student.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {student.name}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {student.rollNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition ${
                    status === "Present"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    className="hidden"
                    checked={status === "Present"}
                    onChange={() => onStatusChange(student.id, "Present")}
                  />
                  <div
                    className={`h-3 w-3 rounded-full border-[3px] transition-colors ${
                      status === "Present"
                        ? "border-emerald-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  ></div>
                  Present
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition ${
                    status === "Late"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                      : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    className="hidden"
                    checked={status === "Late"}
                    onChange={() => onStatusChange(student.id, "Late")}
                  />
                  <div
                    className={`h-3 w-3 rounded-full border-[3px] transition-colors ${
                      status === "Late"
                        ? "border-amber-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  ></div>
                  Late
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition ${
                    status === "Absent"
                      ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                      : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    className="hidden"
                    checked={status === "Absent"}
                    onChange={() => onStatusChange(student.id, "Absent")}
                  />
                  <div
                    className={`h-3 w-3 rounded-full border-[3px] transition-colors ${
                      status === "Absent"
                        ? "border-red-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  ></div>
                  Absent
                </label>
              </div>
            </div>
          );
        })}

        {students.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-medium text-slate-500 dark:text-slate-400">
              No students found matching this class section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
