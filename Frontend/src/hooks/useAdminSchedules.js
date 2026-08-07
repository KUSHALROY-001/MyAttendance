import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import useRecordDetail from "./useRecordDetail";

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const useAdminSchedules = () => {
  const detailState = useRecordDetail(
    (entry) => `/api/admin/schedule-entries/${entry.id}/detail`,
  );
  const [selectedDept, setSelectedDept] = useState("BCA");
  const [selectedSem, setSelectedSem] = useState("1");
  const [selectedSec, setSelectedSec] = useState("A");

  const [departments, setDepartments] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [entries, setEntries] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newPeriodType, setNewPeriodType] = useState("class");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedAllocationId, setSelectedAllocationId] = useState("");
  const [slotRoom, setSlotRoom] = useState("");
  const [slotType, setSlotType] = useState("class");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);

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
    const rawSecs = sem?.sections || ["A"];
    return rawSecs.map((s) => (typeof s === "object" && s !== null ? s.name || s.value || String(s) : String(s)));
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

  useEffect(() => {
    api.get("/api/admin/departments").then((res) => setDepartments(res.data));
  }, []);

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

  useEffect(() => {
    fetchClassData();
  }, [selectedDept, selectedSem, selectedSec]);

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

  return {
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
    allocations,
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
    ...detailState,
  };
};

export default useAdminSchedules;
