import React from "react";
import TakeAttendanceSkeleton from "../components/common/skeletons/TakeAttendanceSkeleton";
import PremiumErrorState from "../components/common/PremiumErrorState";
import useTakeAttendance from "../hooks/useTakeAttendance";
import TakeAttendanceHeader from "../components/teacher/TakeAttendanceHeader";
import TakeAttendanceStats from "../components/teacher/TakeAttendanceStats";
import TakeAttendanceActions from "../components/teacher/TakeAttendanceActions";
import TakeAttendanceRoster from "../components/teacher/TakeAttendanceRoster";

const TakeAttendance = () => {
  const {
    allocation,
    students,
    loading,
    attendance,
    saving,
    stats,
    navigate,
    handleMarkAll,
    handleCancel,
    handleSave,
    setStudentStatus,
  } = useTakeAttendance();

  if (loading) {
    return <TakeAttendanceSkeleton />;
  }

  if (!allocation) {
    return (
      <PremiumErrorState
        title="Class Roster Not Found"
        message="We couldn't locate the class roster for this session."
        errorCode="404"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 pb-28 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <TakeAttendanceHeader
          allocation={allocation}
          onBack={() => navigate(-1)}
          onCancel={handleCancel}
          onSave={handleSave}
          saving={saving}
          disabled={students.length === 0}
        />

        <TakeAttendanceStats stats={stats} />

        <TakeAttendanceActions onMarkAll={handleMarkAll} />

        <TakeAttendanceRoster
          students={students}
          attendance={attendance}
          onStatusChange={setStudentStatus}
        />
      </div>
    </div>
  );
};

export default TakeAttendance;
