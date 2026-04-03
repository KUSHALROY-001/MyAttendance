import React from "react";
import { Link } from "react-router-dom";

const TeacherCourses = ({ courses }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col max-h-[450px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        {courses.map((course) => (
          <Link
            to={`/teacher/course/${course.id}`}
            key={course.id}
            className="flex-1 block bg-white border border-gray-100 shadow-sm rounded-xl p-5 hover:border-indigo-200 transition-colors group cursor-pointer"
          >
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-base font-bold text-gray-600 uppercase tracking-widest mt-1">
                  {course.code}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-[14px] font-semibold text-gray-500">
                  {course.department} • {course.semester} • {course.section}
                </p>
                <p className="text-[14px] font-semibold text-gray-900 bg-gray-300 hover:bg-green-300 rounded-xl px-2 py-0.5">
                  Full history {">"}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {courses.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400 h-32 border-2 border-dashed border-gray-100 rounded-xl">
            No courses assigned
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
