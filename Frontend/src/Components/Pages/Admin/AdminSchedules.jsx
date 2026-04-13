import React, { useState } from "react";
import AdminModal from "./Component/AdminModal";
import { mockSchedules, mockTeachers } from "../../../data/adminMockData";
import { Plus, X } from "lucide-react";

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    mockTeachers[0]?.id || "",
  );

  const allDepts = [...new Set(mockTeachers.map((t) => t.department))];

  const filteredTeachers = selectedDept
    ? mockTeachers.filter((t) => t.department === selectedDept)
    : mockTeachers;

  const handleDeptChange = (e) => {
    const newDept = e.target.value;
    setSelectedDept(newDept);
    const newFiltered = newDept
      ? mockTeachers.filter((t) => t.department === newDept)
      : mockTeachers;
    if (newFiltered.length > 0) {
      setSelectedTeacherId(newFiltered[0].id.toString());
    } else {
      setSelectedTeacherId("");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: "Monday",
    slots: "1,2",
    subject: "",
    department: "BCA",
    semester: "1",
    section: "A",
    room: "",
    classType: "class",
  });

  const activeTeacherData = schedules.filter(
    (s) => s.teacherId.toString() === selectedTeacherId.toString(),
  );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Create a 2D map for the timetable rendering [Day][SlotIndex]
  const slotsConfig = [
    { name: "Slot 1", time: "9:00 - 10:00" },
    { name: "Slot 2", time: "10:00 - 11:00" },
    { name: "Slot 3", time: "11:00 - 12:00" },
    { name: "LUNCH", time: "12:00 - 1:00" },
    { name: "Slot 4", time: "1:00 - 2:00" },
    { name: "Slot 5", time: "2:00 - 3:00" },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSchedules([
      ...schedules,
      {
        id: Date.now(),
        teacherId: selectedTeacherId,
        ...formData,
      },
    ]);
    setIsModalOpen(false);
  };

  const activeTeacher = mockTeachers.find(
    (t) => t.id.toString() === selectedTeacherId.toString(),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Timetables & Schedule
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage weekly periods and room assignments per faculty.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-full max-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Department
              </label>
              <select
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                value={selectedDept}
                onChange={handleDeptChange}
              >
                <option value="">All Departments</option>
                {allDepts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-sm">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Select Faculty Schedule
              </label>
              <select
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
              >
                {filteredTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            disabled={!selectedTeacherId}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto mt-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Slot
          </button>
        </div>

        {/* Timetable Grid */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
              {/* Header Row */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 font-semibold text-sm text-slate-700 dark:text-slate-300 text-center flex items-center justify-center shadow-sm">
                Time / Day
              </div>
              {slotsConfig.map((slot, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-900/50 p-3 pb-2 text-center shadow-sm"
                >
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {slot.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                    {slot.time}
                  </div>
                </div>
              ))}

              {/* Grid Body */}
              {days.map((dayText) => (
                <React.Fragment key={dayText}>
                  {/* Day Header */}
                  <div className="bg-white dark:bg-slate-900 p-4 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-200">
                    {dayText}
                  </div>

                  {/* Slots for this day */}
                  {slotsConfig.map((slot, slotIndex) => {
                    if (slot.name === "LUNCH") {
                      return (
                        <div
                          key={`${dayText}-lunch`}
                          className="bg-slate-100 dark:bg-slate-800/80 p-2 flex items-center justify-center"
                        >
                          <span className="text-xs text-slate-400 italic">
                            Lunch
                          </span>
                        </div>
                      );
                    }

                    // Slot matching logic
                    // The slotIndex in our config corresponds to numerical slots like "1", "2", "3" natively
                    // (since LUNCH is index 3, slot 4 is index 4... wait, let's just map logic simply)
                    const trueSlotNum = slot.name.replace("Slot ", "");

                    const slotData = activeTeacherData.find(
                      (s) =>
                        s.day === dayText &&
                        s.slots.split(",").includes(trueSlotNum),
                    );

                    return (
                      <div
                        key={`${dayText}-${slotIndex}`}
                        className="bg-white dark:bg-slate-900 p-2 border-l border-t border-transparent relative group"
                      >
                        {slotData ? (
                          <div
                            className={`h-full w-full rounded p-2 border-l-2 text-left shadow-sm ${slotData.classType === "lab" ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500" : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500"}`}
                          >
                            <p className="font-bold text-[11px] leading-tight text-slate-900 dark:text-white line-clamp-1">
                              {slotData.subject}
                            </p>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                              {slotData.department} {slotData.section} (
                              {slotData.semester})
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 font-mono">
                              {slotData.room}
                            </p>

                            <button
                              onClick={() =>
                                setSchedules(
                                  schedules.filter((s) => s.id !== slotData.id),
                                )
                              }
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="h-full w-full border border-dashed border-slate-200 dark:border-slate-800 rounded p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs text-slate-400"
                            onClick={() => {
                              setIsModalOpen(true);
                              setFormData({
                                ...formData,
                                day: dayText,
                                slots: trueSlotNum,
                              });
                            }}
                          >
                            +
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Slot for ${activeTeacher?.name || ""}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Day
              </label>
              <select
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Slot Num(s) comma separated
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.slots}
                onChange={(e) =>
                  setFormData({ ...formData, slots: e.target.value })
                }
                placeholder="e.g. 1,2 for Lab"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Subject
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Dept
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Sem
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Sec
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Room/Venue
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Type
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none text-slate-900 dark:text-white"
                value={formData.classType}
                onChange={(e) =>
                  setFormData({ ...formData, classType: e.target.value })
                }
              >
                <option value="class">Theory (Class)</option>
                <option value="lab">Practical (Lab)</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Save to Grid
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminSchedules;
