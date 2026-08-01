import React from "react";
import AdminToolbar from "../components/admin/AdminToolbar";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import ScheduleHeader from "../components/admin/ScheduleHeader";
import ScheduleGrid from "../components/admin/ScheduleGrid";
import AssignSlotModal from "../components/admin/AssignSlotModal";
import { Plus } from "lucide-react";
import useAdminSchedules from "../hooks/useAdminSchedules";

const AdminSchedules = () => {
  const {
    selectedDept,
    setSelectedDept,
    selectedSem,
    setSelectedSem,
    selectedSec,
    setSelectedSec,
    departments,
    periods,
    semOptions,
    secOptions,
    filteredAllocations,
    isAddingColumn,
    setIsAddingColumn,
    newStartTime,
    setNewStartTime,
    newEndTime,
    setNewEndTime,
    newPeriodType,
    setNewPeriodType,
    isModalOpen,
    setIsModalOpen,
    activeCell,
    teacherSearch,
    setTeacherSearch,
    selectedAllocationId,
    setSelectedAllocationId,
    slotRoom,
    setSlotRoom,
    slotType,
    setSlotType,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    recordToDelete,
    setRecordToDelete,
    isDeleteColumnDialogOpen,
    setIsDeleteColumnDialogOpen,
    columnToDelete,
    setColumnToDelete,
    handleAddColumn,
    handleDeletePeriod,
    handleAssignSlot,
    handleDeleteEntry,
    resetModal,
    openAssignModal,
    getEntry,
    handleInlineTimeEdit,
  } = useAdminSchedules();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ScheduleHeader />

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

      <ScheduleGrid
        selectedDept={selectedDept}
        selectedSem={selectedSem}
        selectedSec={selectedSec}
        periods={periods}
        isAddingColumn={isAddingColumn}
        setIsAddingColumn={setIsAddingColumn}
        newStartTime={newStartTime}
        setNewStartTime={setNewStartTime}
        newEndTime={newEndTime}
        setNewEndTime={setNewEndTime}
        newPeriodType={newPeriodType}
        setNewPeriodType={setNewPeriodType}
        handleAddColumn={handleAddColumn}
        setColumnToDelete={setColumnToDelete}
        setIsDeleteColumnDialogOpen={setIsDeleteColumnDialogOpen}
        handleInlineTimeEdit={handleInlineTimeEdit}
        getEntry={getEntry}
        openAssignModal={openAssignModal}
        setRecordToDelete={setRecordToDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />

      <AssignSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeCell={activeCell}
        selectedDept={selectedDept}
        selectedSem={selectedSem}
        selectedSec={selectedSec}
        teacherSearch={teacherSearch}
        setTeacherSearch={setTeacherSearch}
        filteredAllocations={filteredAllocations}
        selectedAllocationId={selectedAllocationId}
        setSelectedAllocationId={setSelectedAllocationId}
        slotRoom={slotRoom}
        setSlotRoom={setSlotRoom}
        slotType={slotType}
        setSlotType={setSlotType}
        handleAssignSlot={handleAssignSlot}
        resetModal={resetModal}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteEntry}
        title="Delete Schedule Slot"
        message="Are you sure you want to remove this class assignment? The corresponding teacher schedule entry will also be removed."
      />

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
