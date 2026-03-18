import React from "react";

const TeacherCourses = ({ courses }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col max-h-[450px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex-1 bg-white border border-gray-100 shadow-sm rounded-xl p-5 hover:border-indigo-100 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-[12px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                  {course.code}
                </p>
                <p className="text-[12px] font-semibold text-gray-500">
                  {course.department} • {course.semester} • {course.section}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">
                  {course.classesConducted}
                </span>
                <p className="text-[12px] font-bold text-gray-400 -mt-1 uppercase tracking-widest">
                  Classes
                </p>
              </div>
            </div>
          </div>
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
