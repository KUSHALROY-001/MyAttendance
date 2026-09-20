import React from "react";
import { Users } from "lucide-react";

const LOW_ATTENDANCE_THRESHOLD = 75; // matches the student-side warning
const WARNING_ATTENDANCE_THRESHOLD = 85;

// The three options a teacher can pick. `active` styles the selected pill and
// `ring` styles the radio dot.
const STATUS_OPTIONS = [
  {
    value: "Present",
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    ring: "border-emerald-500",
  },
  {
    value: "Late",
    active:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    ring: "border-amber-500",
  },
  {
    value: "Absent",
    active: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    ring: "border-red-500",
  },
];

// Row tint is desktop-only (md:) - on mobile each student is its own white card.
const ROW_TINT = {
  Present: "md:bg-emerald-50/40 md:dark:bg-emerald-500/10",
  Late: "md:bg-amber-50/40 md:dark:bg-amber-500/10",
  Absent: "md:bg-red-50/40 md:dark:bg-red-500/10",
};

const getPercentageTone = (percentage) => {
  if (percentage < LOW_ATTENDANCE_THRESHOLD) {
    return {
      badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
      box: "border-red-100 bg-red-50/70 dark:border-red-500/20 dark:bg-red-500/10",
    };
  }
  if (percentage < WARNING_ATTENDANCE_THRESHOLD) {
    return {
      badge:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      box: "border-amber-100 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10",
    };
  }
  return {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    box: "border-emerald-100 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10",
  };
};

const PREVIOUS_STATUS_TEXT = {
  Present: "text-emerald-600 dark:text-emerald-400",
  Late: "text-amber-600 dark:text-amber-400",
  Absent: "text-red-600 dark:text-red-400",
};

// Middle column: percentage badge + "18/18 classes", then the previous-class hint.
function StudentAttendanceStats({ student }) {
  const {
    attendancePercentage: percentage,
    totalClasses = 0,
    attendedClasses = 0,
    previousClass,
  } = student;

  const hasPercentage = percentage !== null && percentage !== undefined;
  const tone = hasPercentage ? getPercentageTone(percentage) : null;

  return (
    <div className="space-y-1.5">
      {hasPercentage ? (
        <div
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-1.5 py-1.5 md:gap-x-3 md:border-transparent md:bg-transparent md:p-0 md:dark:border-transparent md:dark:bg-transparent ${tone.box}`}
          title={`Attended ${attendedClasses} of ${totalClasses} classes`}
        >
          <span
            className={`rounded-lg px-2 py-0.5 text-[13px] font-bold md:px-2.5 md:py-1 md:text-sm ${tone.badge}`}
          >
            {percentage}%
          </span>
          <span className="whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400 md:text-sm">
            {attendedClasses}/{totalClasses} classes
          </span>
        </div>
      ) : (
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          No classes held yet
        </p>
      )}

      {previousClass && (
        <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 md:text-[13px]">
          Previous class:{" "}
          <span
            className={`font-semibold ${
              PREVIOUS_STATUS_TEXT[previousClass.status] ||
              "text-slate-600 dark:text-slate-300"
            }`}
          >
            {previousClass.status}
            {previousClass.courseCode && (
              <span className="whitespace-nowrap">
                {" "}
                ({previousClass.courseCode})
              </span>
            )}
          </span>
        </p>
      )}
    </div>
  );
}

// Present / Late / Absent. Stacked list on mobile, segmented control on desktop.
function StatusPicker({ studentId, status, onStatusChange }) {
  return (
    <div
      role="radiogroup"
      className="flex flex-col gap-1 md:flex-row md:gap-0 md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-1 md:shadow-sm md:dark:border-slate-700 md:dark:bg-slate-950"
    >
      {STATUS_OPTIONS.map((option) => {
        const selected = status === option.value;

        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-indigo-400 md:gap-2 md:px-4 md:py-1.5 md:text-xs ${
              selected
                ? option.active
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <input
              type="radio"
              name={`status-${studentId}`}
              className="sr-only"
              checked={selected}
              onChange={() => onStatusChange(studentId, option.value)}
            />
            <span
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 rounded-full border-[3px] transition-colors md:h-3.5 md:w-3.5 ${
                selected
                  ? option.ring
                  : "border-slate-300 dark:border-slate-600"
              }`}
            />
            {option.value}
          </label>
        );
      })}
    </div>
  );
}

function StudentInfo({ student }) {
  return (
    <div className="flex min-w-0 items-center gap-3 md:gap-4">
      {student.avatar ? (
        <img
          src={student.avatar}
          alt={student.name}
          className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-800 md:h-12 md:w-12"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300 md:h-12 md:w-12">
          {student.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0">
        <p className="break-words text-sm font-bold text-slate-900 dark:text-slate-100 md:text-base">
          {student.name}
        </p>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 md:text-xs">
          {student.rollNumber}
        </p>
      </div>
    </div>
  );
}

export default function TakeAttendanceRoster({
  students,
  attendance,
  onStatusChange,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-4 dark:border-slate-800 dark:bg-slate-800/50 md:px-6">
        <Users className="hidden h-5 w-5 text-slate-500 dark:text-slate-400 md:block" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 md:text-sm">
          Student Attendance List
        </h3>
      </div>

      {/* Mobile: one card per student. Desktop: one divided row per student. */}
      <div className="space-y-3 p-1 md:space-y-0 md:divide-y md:divide-slate-100 md:p-0 md:dark:divide-slate-800">
        {students.map((student) => {
          const status = attendance[student.id];

          return (
            <div
              key={student.id}
              className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-2 rounded-2xl border border-slate-200 bg-white p-2 transition-colors dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-center md:gap-x-4 md:rounded-none md:border-0 md:px-6 md:py-4 ${
                ROW_TINT[status] || ""
              }`}
            >
              {/* Student info: full-width top section on mobile, left column on desktop */}
              <div className="col-span-2 col-start-1 row-start-1 pb-3 md:col-span-1 md:pb-0">
                <StudentInfo student={student} />
              </div>

              {/* Attendance marking: bottom-left on mobile, right column on desktop */}
              <div className="col-start-1 row-start-2 md:col-start-3 md:row-start-1">
                <StatusPicker
                  studentId={student.id}
                  status={status}
                  onStatusChange={onStatusChange}
                />
              </div>

              {/* Attendance stats: bottom-right on mobile, middle column on desktop */}
              <div className="col-start-2 row-start-2 border-l border-slate-200 pl-2 dark:border-slate-700 md:row-start-1 md:border-x md:px-6">
                <StudentAttendanceStats student={student} />
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
