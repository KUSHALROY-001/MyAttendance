import React, { useState, useEffect, useMemo } from "react";
import AdminModal from "./Component/AdminModal";
import AdminToolbar from "./Component/AdminToolbar";
import ConfirmDialog from "./Component/ConfirmDialog";
import { Plus, X, Clock, Search } from "lucide-react";
import api from "../../../api/axios";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AdminSchedules = () => {
  // ── Filter state ──
  const [selectedDept, setSelectedDept] = useState("BCA");
  const [selectedSem, setSelectedSem] = useState("1");
  const [selectedSec, setSelectedSec] = useState("A");

  // ── Data state ──
  const [departments, setDepartments] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [entries, setEntries] = useState([]);
  const [allocations, setAllocations] = useState([]);

  // ── Add column state ──
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newPeriodType, setNewPeriodType] = useState("class");

  // ── Assign slot modal ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedAllocationId, setSelectedAllocationId] = useState("");
  const [slotRoom, setSlotRoom] = useState("");
  const [slotType, setSlotType] = useState("class");

  // ── Delete state ──
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);

  // ── Derived ──
  const periods = useMemo(
    () => (Array.isArray(timetable?.periods) ? timetable.periods : []),
    [timetable],
  );

  const currentDept = useMemo(
    () => departments.find((d) => d.code === selectedDept),
    [departments, selectedDept],
  );

  const semOptions = useMemo(() => {
    if (!currentDept?.semesterDetails) return [];
    return currentDept.semesterDetails.map((s) => s.semester.toString());
  }, [currentDept]);

  const secOptions = useMemo(() => {
    if (!currentDept?.semesterDetails) return ["A"];
    const sem = currentDept.semesterDetails.find(
      (s) => s.semester.toString() === selectedSem,
    );
    return sem?.sections || ["A"];
  }, [currentDept, selectedSem]);

  const filteredAllocations = useMemo(() => {
    if (!teacherSearch) return allocations;
    const q = teacherSearch.toLowerCase();
    return allocations.filter(
      (a) =>
        a.teacherName?.toLowerCase().includes(q) ||
        a.courseName?.toLowerCase().includes(q),
    );
  }, [allocations, teacherSearch]);

  // ── Fetch departments on mount ──
  useEffect(() => {
    api.get("/api/admin/departments").then((res) => setDepartments(res.data));
  }, []);

  // ── Fetch class data when selection changes ──
  useEffect(() => {
    fetchClassData();
  }, [selectedDept, selectedSem, selectedSec]);

  const fetchClassData = async () => {
    try {
      const q = `department=${selectedDept}&semester=${selectedSem}&section=${selectedSec}`;
      const [ttRes, allocRes] = await Promise.all([
        api.get(`/api/admin/class-timetable?${q}`),
        api.get(`/api/admin/allocations?${q}`),
      ]);
      setTimetable(ttRes.data.timetable);
      setEntries(ttRes.data.entries);
      setAllocations(allocRes.data);
    } catch (err) {
      console.error("Failed to fetch class data:", err);
    }
  };

  // ── Add column handler ──
  const handleAddColumn = async () => {
    if (!newStartTime || !newEndTime) return;
    try {
      await api.post("/api/admin/class-timetable/period", {
        department: selectedDept,
        semester: selectedSem,
        section: selectedSec,
        startTime: newStartTime,
        endTime: newEndTime,
        type: newPeriodType,
      });
      setIsAddingColumn(false);
      setNewStartTime("");
      setNewEndTime("");
      setNewPeriodType("class");
      await fetchClassData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add period");
    }
  };

  // ── Delete period column ──
  const handleDeletePeriod = async () => {
    if (!columnToDelete) return;
    try {
      await api.delete("/api/admin/class-timetable/period", {
        data: {
          department: selectedDept,
          semester: selectedSem,
          section: selectedSec,
          periodNumber: columnToDelete,
        },
      });
      setIsDeleteColumnDialogOpen(false);
      setColumnToDelete(null);
      await fetchClassData();
    } catch (err) {
      alert("Failed to delete period");
    }
  };

  // ── Assign slot ──
  const handleAssignSlot = async (e) => {
    e.preventDefault();
    if (!selectedAllocationId || !activeCell) return;
    try {
      await api.post("/api/admin/class-schedule", {
        classTimetableId: timetable.id,
        periodNumber: activeCell.periodNumber,
        day: activeCell.day,
        courseAllocationId: selectedAllocationId,
        room: slotRoom,
        classType: slotType,
      });
      setIsModalOpen(false);
      resetModal();
      await fetchClassData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign slot");
    }
  };

  // ── Delete entry ──
  const handleDeleteEntry = async () => {
    try {
      await api.delete(`/api/admin/class-schedule/${recordToDelete.id}`);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchClassData();
    } catch (err) {
      alert("Failed to delete entry");
    }
  };

  const resetModal = () => {
    setActiveCell(null);
    setTeacherSearch("");
    setSelectedAllocationId("");
    setSlotRoom("");
    setSlotType("class");
  };

  const openAssignModal = (day, periodNumber) => {
    resetModal();
    setActiveCell({ day, periodNumber });
    setIsModalOpen(true);
  };

  const getEntry = (day, periodNumber) => {
    return entries.find(
      (e) => e.day === day && e.periodNumber === periodNumber,
    );
  };

  // ── Inline edit period times ──
  const handleInlineTimeEdit = async (periodNumber, field, value) => {
    const period = periods.find((p) => p.period === periodNumber);
    if (!period) return;
    try {
      await api.put("/api/admin/class-timetable/period", {
        department: selectedDept,
        semester: selectedSem,
        section: selectedSec,
        periodNumber,
        startTime: field === "startTime" ? value : period.startTime,
        endTime: field === "endTime" ? value : period.endTime,
      });
      await fetchClassData();
    } catch (err) {
      alert("Failed to update time");
    }
  };

  const colCount = periods.length + (isAddingColumn ? 1 : 0) + 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Class Timetable
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build weekly schedules for each class section.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <AdminToolbar
        filters={[
          {
            label: "Dept",
            value: selectedDept,
            onChange: (v) => {
              setSelectedDept(v);
              setSelectedSem("1");
              setSelectedSec("A");
            },
            options: departments.map((d) => d.code),
          },
          {
            label: "Semester",
            value: selectedSem,
            onChange: (v) => {
              setSelectedSem(v);
              setSelectedSec("A");
            },
            options: semOptions,
          },
          {
            label: "Section",
            value: selectedSec,
            onChange: setSelectedSec,
            options: secOptions,
          },
        ]}
        actions={
          <button
            onClick={() => setIsAddingColumn(true)}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Column
          </button>
        }
      />

      {/* Timetable Card */}
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
                      // Lunch / break cells
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
                                className={`h-full w-full rounded p-2 border-l-2 text-left shadow-sm ${entry.classType === "lab" ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500" : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500"}`}
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
                              <button
                                onClick={() => {
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

      {/* ═══ ASSIGN SLOT MODAL ═══ */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetModal();
        }}
        title={`Assign Class — ${activeCell?.day || ""}, Period ${activeCell?.periodNumber || ""}`}
      >
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {selectedDept} / Sem {selectedSem} / Sec {selectedSec}
        </p>

        <form onSubmit={handleAssignSlot} className="space-y-4">
          {/* Teacher search */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Select Teacher (Allocated)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search teacher by name..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAllocations.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No teachers allocated to this class.
                </div>
              ) : (
                filteredAllocations.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedAllocationId === a.id.toString() ? "bg-indigo-50 dark:bg-indigo-900/20" : ""}`}
                  >
                    <input
                      type="radio"
                      name="allocationId"
                      value={a.id}
                      checked={selectedAllocationId === a.id.toString()}
                      onChange={() => setSelectedAllocationId(a.id.toString())}
                      className="accent-indigo-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {a.teacherName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {a.courseName} ({a.courseCode})
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Room + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Room / Venue
              </label>
              <input
                type="text"
                value={slotRoom}
                onChange={(e) => setSlotRoom(e.target.value)}
                placeholder="e.g. Room 301"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Type
              </label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="class">Theory (Class)</option>
                <option value="lab">Practical (Lab)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetModal();
              }}
              className="px-4 py-2 font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedAllocationId}
              className="px-4 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
            >
              Assign Slot
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ═══ DELETE SLOT CONFIRM ═══ */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteEntry}
        title="Delete Schedule Slot"
        message="Are you sure you want to remove this class assignment? The corresponding teacher schedule entry will also be removed."
      />

      {/* ═══ DELETE COLUMN CONFIRM ═══ */}
      <ConfirmDialog
        isOpen={isDeleteColumnDialogOpen}
        onClose={() => {
          setIsDeleteColumnDialogOpen(false);
          setColumnToDelete(null);
        }}
        onConfirm={handleDeletePeriod}
        title="Delete Period Column"
        message="Delete this entire column? All assignments across all days in this period will be permanently removed."
      />
    </div>
  );
};

export default AdminSchedules;
