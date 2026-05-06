import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CloseSVG, ChevronDownSVG, PlayCircleSVG } from "../../../UI/SVG";

const selectClass =
  "w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600";

const StartAttendanceModal = ({ isOpen, onClose, allocations = [] }) => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSec, setSelectedSec] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const departments = useMemo(() => {
    const depts = new Set(allocations.map((a) => a.department));
    return Array.from(depts).sort();
  }, [allocations]);

  const semesters = useMemo(() => {
    if (!selectedDept) return [];
    const sems = new Set(
      allocations
        .filter((a) => a.department === selectedDept && a.semester != null)
        .map((a) => a.semester),
    );
    return Array.from(sems).sort((a, b) => a - b);
  }, [allocations, selectedDept]);

  const sections = useMemo(() => {
    if (!selectedDept || !selectedSem) return [];
    const secs = new Set(
      allocations
        .filter(
          (a) =>
            a.department === selectedDept &&
            a.semester?.toString() === selectedSem &&
            a.section != null,
        )
        .map((a) => a.section),
    );
    return Array.from(secs).sort();
  }, [allocations, selectedDept, selectedSem]);

  const availableCourses = useMemo(() => {
    if (!selectedDept || !selectedSem || !selectedSec) return [];
    return allocations.filter(
      (a) =>
        a.department === selectedDept &&
        a.semester?.toString() === selectedSem &&
        a.section === selectedSec &&
        a.course,
    );
  }, [allocations, selectedDept, selectedSem, selectedSec]);

  const handleDeptChange = (e) => {
    setSelectedDept(e.target.value);
    setSelectedSem("");
    setSelectedSec("");
    setSelectedCourseId("");
  };

  const handleSemChange = (e) => {
    setSelectedSem(e.target.value);
    setSelectedSec("");
    setSelectedCourseId("");
  };

  const handleSecChange = (e) => {
    setSelectedSec(e.target.value);
    setSelectedCourseId("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="relative w-full max-w-md animate-slideUp rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
        >
          <CloseSVG className="h-5 w-5" />
        </button>

        <h2 className="pr-8 text-xl font-bold text-slate-900 dark:text-slate-100">
          Start Attendance Session
        </h2>
        <p className="mb-6 mt-1 text-sm text-slate-500 dark:text-slate-400">
          Select department, course, and section to begin taking attendance.
        </p>

        <div className="mb-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">
              Department
            </label>
            <div className="relative">
              <select
                className={selectClass}
                value={selectedDept}
                onChange={handleDeptChange}
              >
                <option value="" disabled hidden>
                  Select department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
                <ChevronDownSVG className="h-4 w-4" />
              </div>
            </div>
          </div>

          {selectedDept && (
            <div className="animate-fadeIn">
              <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">
                Semester
              </label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={selectedSem}
                  onChange={handleSemChange}
                >
                  <option value="" disabled hidden>
                    Select semester
                  </option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem?.toString()}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
                  <ChevronDownSVG className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          {selectedSem && (
            <div className="animate-fadeIn">
              <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">
                Section
              </label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={selectedSec}
                  onChange={handleSecChange}
                >
                  <option value="" disabled hidden>
                    Select section
                  </option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
                  <ChevronDownSVG className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          {selectedSec && (
            <div className="animate-fadeIn">
              <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">
                Subject
              </label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select subject
                  </option>
                  {availableCourses.map((alloc) => (
                    <option key={alloc.id} value={alloc.id}>
                      {alloc.course?.name || "Unknown"} ({alloc.course?.code || "N/A"})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
                  <ChevronDownSVG className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            disabled={!selectedCourseId}
            onClick={() => {
              if (!selectedCourseId) return;
              const alloc = availableCourses.find(
                (a) => a.id.toString() === selectedCourseId.toString(),
              );
              localStorage.setItem(
                "activeSession",
                JSON.stringify({
                  allocationId: alloc.id,
                  courseName: alloc.course?.name || "Unknown Subject",
                  courseCode: alloc.course?.code || "N/A",
                  department: alloc.department,
                  semester: alloc.semester,
                  section: alloc.section,
                  startedAt: new Date().toISOString(),
                }),
              );
              navigate(`/teacher/attendance/live/${alloc.id}`);
              onClose();
            }}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${
              selectedCourseId
                ? "cursor-pointer bg-[#818cf8] text-white shadow-sm hover:bg-indigo-500"
                : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            <PlayCircleSVG className="h-4 w-4" />
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartAttendanceModal;
