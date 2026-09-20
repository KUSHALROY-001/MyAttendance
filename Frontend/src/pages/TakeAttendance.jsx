import React, { useState } from "react";
import TakeAttendanceSkeleton from "../components/common/skeletons/TakeAttendanceSkeleton";
import PremiumErrorState from "../components/common/PremiumErrorState";
import useTakeAttendance from "../hooks/useTakeAttendance";
import TakeAttendanceHeader from "../components/teacher/TakeAttendanceHeader";
import TakeAttendanceStats from "../components/teacher/TakeAttendanceStats";
import TakeAttendanceActions from "../components/teacher/TakeAttendanceActions";
import TakeAttendanceRoster from "../components/teacher/TakeAttendanceRoster";
import TakeAttendanceFooter from "../components/teacher/TakeAttendanceFooter";
import ConfirmDialog from "../components/admin/ConfirmDialog";

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

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50 px-2 py-6 pb-28 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <TakeAttendanceHeader
          allocation={allocation}
          onBack={() => navigate(-1)}
          onCancel={() => setIsCancelConfirmOpen(true)}
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

      <TakeAttendanceFooter stats={stats} />

      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Attendance Session"
        message="Are you sure you want to cancel? Any attendance marks you've made for this session will be lost."
        confirmText="Yes, Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default TakeAttendance;
