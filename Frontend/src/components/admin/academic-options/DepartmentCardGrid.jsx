import React from "react";
import { BookOpen } from "lucide-react";
import DepartmentCard from "./DepartmentCard";

const DepartmentCardGrid = ({
  departments,
  isSuperAdmin,
  onEditDepartment,
  onDeleteDepartment,
  onOpenDepartmentDetail,
  onOpenSemesterAudit,
  activeSemesterAudit,
  setActiveSemesterAudit,
  departmentDetails,
}) => {
  if (!Array.isArray(departments) || departments.length === 0) {
    return (
      <div className="col-span-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
        <BookOpen className="mx-auto h-10 w-10 text-slate-400 mb-3" />
        <p className="font-semibold text-base">No departments found</p>
        <p className="text-xs mt-1">
          {isSuperAdmin
            ? "Click 'Add Department' above to configure your first academic option."
            : "No academic options configured for this institute yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.id}
          dept={dept}
          isSuperAdmin={isSuperAdmin}
          onEdit={onEditDepartment}
          onDelete={onDeleteDepartment}
          onOpenDetail={onOpenDepartmentDetail}
          onOpenSemesterAudit={onOpenSemesterAudit}
          activeSemesterAudit={activeSemesterAudit}
          setActiveSemesterAudit={setActiveSemesterAudit}
          detail={departmentDetails?.[dept.id]}
        />
      ))}
    </div>
  );
};

export default DepartmentCardGrid;
