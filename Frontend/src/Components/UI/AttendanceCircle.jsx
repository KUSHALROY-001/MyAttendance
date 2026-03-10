import React from "react";

const AttendanceCircle = ({ periods }) => {
  const getColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "#22c55e"; // Green
      case "LATE":
        return "#f59e0b"; // Orange
      case "ABSENT":
        return "#ef4444"; // Red
      default:
        return "#f1f5f9"; // Light Gray
    }
  };

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 100 100"
      className="drop-shadow-sm group-hover:scale-110 transition-transform"
    >
      <path
        d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z"
        fill={getColor(periods[0])}
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z"
        fill={getColor(periods[1])}
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z"
        fill={getColor(periods[2])}
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z"
        fill={getColor(periods[3])}
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="12" fill="white" />
    </svg>
  );
};

export default AttendanceCircle;
