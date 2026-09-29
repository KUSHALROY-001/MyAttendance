import { useState, useMemo, useCallback } from "react";

/**
 * Custom hook to manage calendar state (month navigation, days grid generation)
 * @param {Object} attendanceByDate - Dictionary of attendance records keyed by "YYYY-MM-DD"
 * @returns {Object} { calendarMonth, calendarDays, goToPreviousMonth, goToNextMonth }
 */
export const useCalendar = (attendanceByDate = {}) => {
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    // Monday-anchored week start/end
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const endOffset = 5 - ((lastOfMonth.getDay() + 6) % 7);
    const startDate = new Date(year, month, 1 - startOffset);
    const endDate = new Date(year, month, lastOfMonth.getDate() + endOffset);

    const days = [];
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1)
    ) {
      if (dt.getDay() === 0) continue; // skip Sundays

      const d = new Date(dt);
      // Consistent local "YYYY-MM-DD" formatting to prevent timezone shift issues
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const dayRecords = attendanceByDate[key] ?? [];
      // One slice per actual class that day — no longer capped/padded to 4.
      // Sorted by course code so the same course lands in the same visual
      // position across days, instead of whatever order the API returned.
      const periods = dayRecords
        .slice()
        .sort((a, b) =>
          (a.course?.code || "").localeCompare(b.course?.code || ""),
        )
        .map((r) => ({
          status: r.status ? r.status.toUpperCase() : null,
          courseCode: r.course?.code || "",
          courseName: r.course?.name || "",
        }));

      days.push({
        date: d,
        periods,
        isCurrentMonth: d.getMonth() === month,
      });
    }
    return days;
  }, [attendanceByDate, calendarMonth]);

  const goToPreviousMonth = useCallback(
    () =>
      setCalendarMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)),
    [],
  );

  const goToNextMonth = useCallback(
    () =>
      setCalendarMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)),
    [],
  );

  return {
    calendarMonth,
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
  };
};
