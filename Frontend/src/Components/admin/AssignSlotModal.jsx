import React from "react";
import AdminModal from "./AdminModal";
import { Search } from "lucide-react";

const AssignSlotModal = ({
  isOpen,
  onClose,
  activeCell,
  selectedDept,
  selectedSem,
  selectedSec,
  teacherSearch,
  setTeacherSearch,
  filteredAllocations = [],
  selectedAllocationId,
  setSelectedAllocationId,
  slotRoom,
  setSlotRoom,
  slotType,
  setSlotType,
  handleAssignSlot,
  resetModal,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
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
              onClose();
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
  );
};

export default AssignSlotModal;
