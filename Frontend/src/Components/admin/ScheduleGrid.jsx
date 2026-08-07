import React from "react";
import { Clock, Plus, X } from "lucide-react";
import { days } from "../../hooks/useAdminSchedules";

const ScheduleGrid = ({
  selectedDept,
  selectedSem,
  selectedSec,
  periods = [],
  isAddingColumn,
  setIsAddingColumn,
  newStartTime,
  setNewStartTime,
  newEndTime,
  setNewEndTime,
  newPeriodType,
  setNewPeriodType,
  handleAddColumn,
  setColumnToDelete,
  setIsDeleteColumnDialogOpen,
  handleInlineTimeEdit,
  getEntry,
  openAssignModal,
  openEntryDetail,
  setRecordToDelete,
  setIsDeleteDialogOpen,
}) => {
  const colCount = periods.length + (isAddingColumn ? 1 : 0) + 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 space-y-6">
      {/* Class badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            {selectedDept}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedDept} — Semester {selectedSem}, Section {selectedSec}
            </p>
            <p className="text-xs text-slate-500">
              {periods.filter((p) => p.type !== "lunch").length} periods ·{" "}
              {periods.filter((p) => p.type === "lunch").length} break
              {periods.filter((p) => p.type === "lunch").length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {periods.length === 0 && !isAddingColumn ? (
        <div className="text-center py-16">
          <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            No periods defined yet. Start by adding columns to build the
            timetable.
          </p>
          <button
            onClick={() => setIsAddingColumn(true)}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Column
          </button>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-4">
          <div style={{ minWidth: `${colCount * 130}px` }}>
            <div
              className="grid gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800"
              style={{
                gridTemplateColumns: `120px repeat(${periods.length}, minmax(120px, 1fr))${isAddingColumn ? " minmax(160px, 1fr)" : ""}`,
              }}
            >
              {/* ═══ HEADER ROW ═══ */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 font-semibold text-sm text-slate-700 dark:text-slate-300 text-center flex items-center justify-center">
                Day
              </div>

              {/* Existing period headers */}
              {periods.map((period) => (
                <div
                  key={period.period}
                  className={`${period.type === "lunch" ? "bg-amber-50 dark:bg-amber-900/20" : "bg-slate-50 dark:bg-slate-900/50"} p-3 text-center relative group`}
                >
                  {period.type === "lunch" ? (
                    <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                      BREAK
                    </div>
                  ) : (
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      Period {period.period}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <input
                      type="time"
                      value={period.startTime}
                      onChange={(e) =>
                        handleInlineTimeEdit(
                          period.period,
                          "startTime",
                          e.target.value,
                        )
                      }
                      className="w-[70px] text-[10px] font-mono bg-transparent text-slate-500 dark:text-slate-400 text-center outline-none border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-400">-</span>
                    <input
                      type="time"
                      value={period.endTime}
                      onChange={(e) =>
                        handleInlineTimeEdit(
                          period.period,
                          "endTime",
                          e.target.value,
                        )
                      }
                      className="w-[70px] text-[10px] font-mono bg-transparent text-slate-500 dark:text-slate-400 text-center outline-none border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setColumnToDelete(period.period);
                      setIsDeleteColumnDialogOpen(true);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 text-red-400 hover:text-red-600 rounded transition-opacity"
                    title="Delete column"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* New column input header */}
              {isAddingColumn && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 text-center space-y-2">
                  <select
                    value={newPeriodType}
                    onChange={(e) => setNewPeriodType(e.target.value)}
                    className="w-full text-xs px-2 py-1 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
                  >
                    <option value="class">Period</option>
                    <option value="lunch">Break</option>
                  </select>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full text-xs font-mono px-2 py-1 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
                    placeholder="Start"
                  />
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full text-xs font-mono px-2 py-1 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
                    placeholder="End"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleAddColumn}
                      disabled={!newStartTime || !newEndTime}
                      className="flex-1 text-xs font-semibold px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewStartTime("");
                        setNewEndTime("");
                      }}
                      className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ BODY ROWS (one per day) ═══ */}
              {days.map((dayText) => (
                <React.Fragment key={dayText}>
                  {/* Day label */}
                  <div className="bg-white dark:bg-slate-900 p-4 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-200">
                    {dayText}
                  </div>

                  {/* Cells for each period */}
                  {periods.map((period) => {
                    if (period.type === "lunch") {
                      return (
                        <div
                          key={`${dayText}-${period.period}`}
                          className="bg-amber-50/50 dark:bg-amber-900/10 p-2 flex items-center justify-center"
                        >
                          <span className="text-xs text-amber-500 italic">
                            Break
                          </span>
                        </div>
                      );
                    }

                    const entry = getEntry(dayText, period.period);

                    return (
                      <div
                        key={`${dayText}-${period.period}`}
                        className="bg-white dark:bg-slate-900 p-2 relative group min-h-[70px]"
                      >
                        {entry ? (
                          <div
                            onClick={() => openEntryDetail(entry)}
                            className={`h-full w-full rounded p-2 border-l-2 text-left shadow-sm cursor-pointer ${entry.classType === "lab" ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500" : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500"}`}
                          >
                            <p className="font-bold text-[11px] leading-tight text-slate-900 dark:text-white line-clamp-1">
                              {entry.courseName}
                            </p>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                              {entry.teacherName}
                            </p>
                            <p className="text-[9px] text-slate-500 mt-0.5 font-mono">
                              {entry.room || "No Room"}
                            </p>
                            {entry.updatedBy && (
                              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                                Updated by {entry.updatedBy.name}
                              </p>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRecordToDelete(entry);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="h-full w-full border border-dashed border-slate-200 dark:border-slate-800 rounded p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs text-slate-400"
                            onClick={() =>
                              openAssignModal(dayText, period.period)
                            }
                          >
                            +
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Empty cell for the "adding column" area */}
                  {isAddingColumn && (
                    <div className="bg-indigo-50/30 dark:bg-indigo-900/5 p-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;
