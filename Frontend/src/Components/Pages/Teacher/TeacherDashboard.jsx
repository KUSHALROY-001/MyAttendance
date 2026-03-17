import React, { useMemo } from "react";
import TeacherHeader from "./components/TeacherHeader";
import TeacherStats from "./components/TeacherStats";
import TodaysClasses from "./components/TodaysClasses";
import WeeklySchedule from "./components/WeeklySchedule";
import AttendanceSessions from "./components/AttendanceSessions";
import TeacherCourses from "./components/TeacherCourses";
import StartAttendanceModal from "./components/StartAttendanceModal";
import {
  MOCK_TEACHER,
  MOCK_TEACHER_SCHEDULE,
  MOCK_TEACHER_TIMETABLE,
  MOCK_TEACHER_COURSES,
} from "../../../mockData";

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const teacherName = useMemo(() => {
    return MOCK_TEACHER.name ? MOCK_TEACHER.name.replace("Dr. ", "") : "Teacher";
  }, []);

  return (
    <div className="mx-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12 mt-6">
        <TeacherHeader 
          teacherName={teacherName} 
          onStartAttendance={() => setIsModalOpen(true)} 
        />

        <div className="grid grid-cols-1 gap-6">
          <TodaysClasses classes={MOCK_TEACHER_SCHEDULE} />
          <WeeklySchedule timetable={MOCK_TEACHER_TIMETABLE} />
          <TeacherStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AttendanceSessions />
            </div>
            <div className="lg:col-span-2">
              <TeacherCourses courses={MOCK_TEACHER_COURSES} />
            </div>
          </div>
        </div>
      </div>

      <StartAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TeacherDashboard;
