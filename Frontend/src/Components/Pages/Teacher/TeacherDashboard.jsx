import { useState, useMemo, useEffect } from "react";
import TeacherHeader from "./components/TeacherHeader";
import TeacherStats from "./components/TeacherStats";
import TodaysClasses from "./components/TodaysClasses";
import WeeklySchedule from "./components/WeeklySchedule";
import AttendanceSessions from "./components/AttendanceSessions";
import TeacherCourses from "./components/TeacherCourses";
import StartAttendanceModal from "./components/StartAttendanceModal";
import axios from "../../../api/axios";

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get("/api/teacher/dashboard/EMP-001");
        setTeacherData(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, []);

  const teacherName = useMemo(() => {
    return teacherData?.user?.name
      ? teacherData.user.name.replace("Dr. ", "")
      : "Teacher";
  }, [teacherData]);

  // Derived state from real API
  const { coursesList, totalSessions, thisMonthSessions } = useMemo(() => {
    if (!teacherData?.allocations)
      return { coursesList: [], totalSessions: 0, thisMonthSessions: 0 };

    // Base courses list securely off of the teacher's formal allocations
    // rather than what happens to show up in the recent attendance logs
    const coursesList = teacherData.allocations.map((alloc) => ({
      id: alloc.course?.code || alloc.id,
      name: alloc.course?.name || "Unknown Course",
      code: alloc.course?.code,
      department: alloc.department,
      semester: `Sem ${alloc.semester}`,
      section: alloc.section,
    }));

    // Directly apply backend optimized SQL counts instead of artificially counting limited array size
    return {
      coursesList,
      totalSessions: teacherData.totalSessions || 0,
      thisMonthSessions: teacherData.thisMonthSessions || 0,
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
