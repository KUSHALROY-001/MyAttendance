import React from "react";
import { Link } from "react-router-dom";

const TeacherCourses = ({ courses }) => {
  return (
    <div className="flex max-h-[450px] h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          My Courses
        </h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
        {courses.map((course) => (
          <Link
            to={`/teacher/course/${course.id}`}
            key={course.id}
            className="block flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors cursor-pointer group hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-4">
              <div className="mb-1 flex justify-between">
                <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100">
                  {course.name}
                </h3>
                <p className="mt-1 text-base font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  {course.code}
                </p>
              </div>
              <div className="flex justify-between gap-3">
                <p className="text-[14px] font-semibold text-slate-500 dark:text-slate-400">
                  {course.department} • {course.semester} • {course.section}
                </p>
                <p className="rounded-xl bg-slate-200 px-2 py-0.5 text-[14px] font-semibold text-slate-800 transition hover:bg-green-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-green-500/30">
                  Full history {">"}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {courses.length === 0 && (
          <div className="flex h-32 flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-400 dark:border-slate-800 dark:text-slate-500">
            No courses assigned
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
