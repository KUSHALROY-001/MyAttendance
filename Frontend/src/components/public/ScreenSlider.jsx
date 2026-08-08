import React, { useState, useEffect, useCallback } from "react";
import PublicVisuals from "./PublicVisuals";

const SLIDES = [
  {
    visual: "student",
    tone: "indigo",
    caption: "Student Dashboard",
    label: "Attendance overview & class routine",
  },
  {
    visual: "teacher",
    tone: "amber",
    caption: "Teacher Workflow",
    label: "Live attendance marking & schedule",
  },
  {
    visual: "admin",
    tone: "emerald",
    caption: "Admin Panel",
    label: "Courses, allocations & reports",
  },
];

/**
 * ScreenSlider
 * Auto-advancing carousel of app screenshots (PublicVisuals).
 * @param {number} startAt - which slide index to start at (0=student, 1=teacher, 2=admin)
 */
function ScreenSlider({ startAt = 0 }) {
  const [current, setCurrent] = useState(startAt % SLIDES.length);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback(
    (index) => {
      if (index === current) return;
      setVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setVisible(true);
      }, 280);
    },
    [current],
  );

  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, 3800);
    return () => clearInterval(id);
  }, [current, goTo]);

  const slide = SLIDES[current];

  return (
    <div className="flex flex-col gap-4">
      {/* Slide */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.28s ease",
        }}
      >
        <PublicVisuals visual={slide.visual} tone={slide.tone} />
      </div>

      {/* Caption bar */}
      <div className="flex items-center justify-between px-1">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.28s ease",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {slide.caption}
          </span>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {slide.label}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                i === current
                  ? "w-6 bg-indigo-500 dark:bg-indigo-400"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScreenSlider;
