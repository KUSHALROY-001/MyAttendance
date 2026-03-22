import React, { useMemo } from "react";
import TeacherHeader from "./components/TeacherHeader";
import TeacherStats from "./components/TeacherStats";
import TodaysClasses from "./components/TodaysClasses";
import WeeklySchedule from "./components/WeeklySchedule";
import AttendanceSessions from "./components/AttendanceSessions";
import TeacherCourses from "./components/TeacherCourses";
import StartAttendanceModal from "./components/StartAttendanceModal";
import axios from "axios";


const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [teacherData, setTeacherData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get("/api/teacher/dashboard/EMP-001");
        setTeacherData(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, []);

  const teacherName = React.useMemo(() => {
    return teacherData?.user?.name
      ? teacherData.user.name.replace("Dr. ", "")
      : "Teacher";
  }, [teacherData]);

  // Derived state from real API
  const { coursesList, totalSessions, thisMonthSessions } =
    React.useMemo(() => {
      if (!teacherData?.recentAttendance)
        return { coursesList: [], totalSessions: 0, thisMonthSessions: 0 };

      const unique = {};
      let currentMonthCount = 0;
      const currentMonth = new Date().getMonth();

      teacherData.recentAttendance.forEach((att) => {
        const code = att.code || "UNKNOWN";

        // Count unique courses
        if (!unique[code]) {
          unique[code] = {
            id: code,
            name: att.name || "Unknown Course",
            code: code,
            department: att.department,
            semester: `Sem ${att.semester}`,
            section: att.section,
            classesConducted: 0,
          };
        }
        unique[code].classesConducted += 1;

        // Count this month's sessions
        if (new Date(att.date).getMonth() === currentMonth) {
          currentMonthCount += 1;
        }
      });

      return {
        coursesList: Object.values(unique),
        totalSessions: teacherData.recentAttendance.length,
        thisMonthSessions: currentMonthCount,
      };
    }, [teacherData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12 mt-6">
        <TeacherHeader
          teacherName={teacherName}
          onStartAttendance={() => setIsModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-6">
          <TodaysClasses schedule={teacherData?.schedule || []} />
          <WeeklySchedule schedule={teacherData?.schedule || []} />
          <TeacherStats
            totalCourses={coursesList.length}
            totalSessions={totalSessions}
            thisMonthSessions={thisMonthSessions}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col">
              <TeacherCourses courses={coursesList} />
            </div>
            <div className="lg:col-span-2 flex flex-col">
              <AttendanceSessions
                sessions={teacherData?.recentAttendance || []}
              />
            </div>
          </div>
        </div>
      </div>

      <StartAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allocations={teacherData?.allocations || []}
      />
    </div>
  );
};

export default TeacherDashboard;
