import React from "react";
import { Loader2 } from "lucide-react";
import useAdminAcademicOptions from "../hooks/useAdminAcademicOptions";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import RecordDetailPanel from "../components/admin/RecordDetailPanel";
import { useAuth } from "../contexts/AuthContext";

import AcademicOptionsHeader from "../components/admin/academic-options/AcademicOptionsHeader";
import ReadOnlyAlert from "../components/admin/academic-options/ReadOnlyAlert";
import DepartmentCardGrid from "../components/admin/academic-options/DepartmentCardGrid";
import DepartmentModal from "../components/admin/academic-options/DepartmentModal";

const departmentDetailSections = [
  {
    title: "Department",
    fields: [
      { label: "Code", accessor: "code" },
      { label: "Name", accessor: "name" },
      {
        label: "Semesters",
        render: (d) => d.semesterDetails?.length || 0,
      },
      {
        label: "Sections",
        render: (d) =>
          d.semesterDetails?.reduce(
            (total, sem) => total + (sem.sections?.length || 0),
            0,
          ) || 0,
      },
    ],
  },
  {
    title: "Configured Structure",
    fields: [
      {
        label: "Semesters & Sections",
        fullWidth: true,
        render: (d) =>
          d.semesterDetails?.length
            ? d.semesterDetails
                .map(
                  (sem) =>
                    `Sem ${sem.semester}: ${(sem.sections || [])
                      .map((sec) => (typeof sec === "object" ? sec.name : sec))
                      .join(", ")}`,
                )
                .join(" | ")
            : "No semester details configured",
      },
    ],
  },
];

const AdminAcademicOptions = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const {
    departments,
    loading,
    saving,
    isModalOpen,
    setIsModalOpen,
    currentRecord,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    recordToDelete,
    setRecordToDelete,
    isDeleteSemesterDialogOpen,
    setIsDeleteSemesterDialogOpen,
    semesterToDelete,
    formData,
    setFormData,
    handleOpenModal,
    handleAddSemester,
    requestRemoveSemester,
    confirmRemoveSemester,
    handleAddSection,
    handleRemoveSection,
    handleSave,
    handleDelete,
    departmentDetails,
    detail,
    isDetailOpen,
    isDetailLoading,
    closeDetail,
    openDepartmentDetail,
    activeSemesterAudit,
    setActiveSemesterAudit,
    openSemesterAudit,
  } = useAdminAcademicOptions();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading academic options...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <AcademicOptionsHeader
        isSuperAdmin={isSuperAdmin}
        onAddDepartment={() => handleOpenModal()}
      />

      {!isSuperAdmin && <ReadOnlyAlert />}

      <DepartmentCardGrid
        departments={departments}
        isSuperAdmin={isSuperAdmin}
        onEditDepartment={(dept) => handleOpenModal(dept)}
        onDeleteDepartment={(dept) => {
          setRecordToDelete(dept);
          setIsDeleteDialogOpen(true);
        }}
        onOpenDepartmentDetail={openDepartmentDetail}
        onOpenSemesterAudit={openSemesterAudit}
        activeSemesterAudit={activeSemesterAudit}
        setActiveSemesterAudit={setActiveSemesterAudit}
        departmentDetails={departmentDetails}
      />

      <RecordDetailPanel
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title={detail ? `Department: ${detail.code}` : "Department Details"}
        detail={detail}
        isLoading={isDetailLoading}
        sections={departmentDetailSections}
      />

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentRecord={currentRecord}
        formData={formData}
        setFormData={setFormData}
        saving={saving}
        onSave={handleSave}
        onAddSemester={handleAddSemester}
        onRequestRemoveSemester={requestRemoveSemester}
        onAddSection={handleAddSection}
        onRemoveSection={handleRemoveSection}
      />

      {/* Delete Department Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Academic Option"
        message={`Are you sure you want to delete department ${recordToDelete?.code} (${recordToDelete?.name})? This cannot be undone.`}
      />

      {/* Delete Semester Dialog */}
      <ConfirmDialog
        isOpen={isDeleteSemesterDialogOpen}
        onClose={() => setIsDeleteSemesterDialogOpen(false)}
        onConfirm={confirmRemoveSemester}
        title="Confirm Semester Deletion"
        message={`Are you sure you want to delete Semester ${semesterToDelete?.semesterNumber}${formData.code ? ` from ${formData.code}` : ""}? This will remove all configured sections for this semester.`}
        confirmText="Delete Semester"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AdminAcademicOptions;
