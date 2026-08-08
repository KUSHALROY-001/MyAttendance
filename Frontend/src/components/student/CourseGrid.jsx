import CourseCard from "./CourseCard";

const CourseGrid = ({ summaries, openCourseModal }) => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
        My Courses
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaries.map((course) => (
          <CourseCard
            key={course.courseCode}
            course={course}
            onClick={openCourseModal}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
