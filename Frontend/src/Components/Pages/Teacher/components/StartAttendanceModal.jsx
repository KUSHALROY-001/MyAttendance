import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const StartAttendanceModal = ({ isOpen, onClose, allocations = [] }) => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSec, setSelectedSec] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Step 1: Unique Departments
  const departments = useMemo(() => {
    const depts = new Set(allocations.map((a) => a.department));
    return Array.from(depts).sort();
  }, [allocations]);

  // Step 2: Unique Semesters for selected Department
  const semesters = useMemo(() => {
    if (!selectedDept) return [];
    const sems = new Set(
      allocations
        .filter((a) => a.department === selectedDept && a.semester != null)
        .map((a) => a.semester),
    );
    return Array.from(sems).sort((a, b) => a - b);
  }, [allocations, selectedDept]);

  // Step 3: Unique Sections for selected Department + Semester
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

  // Step 4: Unique Courses for selected Department + Semester + Section
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

  // Handlers to clear dependent downstream fields
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 pr-8">
          Start Attendance Session
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Select department, course, and section to begin taking attendance.
        </p>

        <div className="space-y-4 mb-8">
          {/* 1. Department */}
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2">
              Department
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-gray-300 transition"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 2. Semester */}
          {selectedDept && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-bold text-[#1e293b] mb-2">
                Semester
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-gray-300 transition"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 3. Section */}
          {selectedSem && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-bold text-[#1e293b] mb-2">
                Section
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-gray-300 transition"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 4. Subject */}
          {selectedSec && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-bold text-[#1e293b] mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-gray-300 transition"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select subject
                  </option>
                  {availableCourses.map((alloc) => (
                    <option key={alloc.id} value={alloc.id}>
                      {alloc.course?.name || "Unknown"} (
                      {alloc.course?.code || "N/A"})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
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
              // Persist the session so the dashboard can show it as active
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
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
              selectedCourseId
                ? "bg-[#818cf8] text-white hover:bg-indigo-500 shadow-sm cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartAttendanceModal;
