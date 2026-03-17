import React, { useState } from "react";

const StartAttendanceModal = ({ isOpen, onClose }) => {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 pr-8">
          Start Attendance Session
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Select department, course, and section to begin taking attendance.
        </p>

        <div className="mb-8">
          <label className="block text-sm font-bold text-[#1e293b] mb-2">
            Department
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none border border-gray-200 text-gray-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-gray-300 transition"
              defaultValue=""
            >
              <option value="" disabled hidden>
                Select department
              </option>
              <option value="bca">BCA</option>
              <option value="mca">MCA</option>
              <option value="btech">B.Tech</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-[#a5b4fc] text-white text-sm font-bold flex items-center gap-2 hover:bg-indigo-400 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartAttendanceModal;
