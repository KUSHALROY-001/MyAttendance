import React from "react";
import AdminTable from "../components/admin/AdminTable";
import AdminModal from "../components/admin/AdminModal";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import AdminToolbar from "../components/admin/AdminToolbar";
import AdminForm from "../components/admin/AdminForm";
import RecordDetailPanel from "../components/admin/RecordDetailPanel";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useAdminTeachers from "../hooks/useAdminTeachers";
import { formatDateMedium } from "../utils/formatters";

const columns = [
  {
    header: "EMPLOYEE ID",
    accessor: "employeeId",
    render: (r) => (
      <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
        {r.employeeId}
      </span>
    ),
  },
  {
    header: "Teacher Details",
    accessor: "name",
    render: (r) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          {r.name}
        </p>
        <p className="text-xs text-slate-500">{r.email}</p>
      </div>
    ),
  },
  { header: "Contact Number", accessor: "contactNumber" },
  { header: "Department", accessor: "department" },
  { header: "Designation", accessor: "designation" },
];

const teacherDetailSections = [
  {
    title: "Teacher Profile",
    fields: [
      { label: "Name", accessor: "name" },
      { label: "Email", accessor: "email" },
      { label: "Employee ID", accessor: "employeeId" },
      { label: "Department", accessor: "department" },
      { label: "Designation", accessor: "designation" },
      { label: "Contact", accessor: "contactNumber" },
      {
        label: "Account Created",
        render: (d) => formatDateMedium(d.accountCreatedAt),
      },
    ],
  },
  {
    title: "Allocations",
    fields: [
      { label: "Allocation Count", accessor: "allocationCount" },
      {
        label: "Assigned Courses",
        fullWidth: true,
        render: (d) =>
          d.allocations?.length
            ? d.allocations
                .map(
                  (a) =>
                    `${a.courseCode} - ${a.courseName} (${a.department} Sem ${a.semester}, Sec ${a.section})`,
                )
                .join(", ")
            : "No allocations",
      },
    ],
  },
];

const AdminTeachers = () => {
  const {
    departments,
    search,
    setSearch,
    dept,
    setDept,
    filteredData,
    isModalOpen,
    setIsModalOpen,
    currentRecord,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    recordToDelete,
    setRecordToDelete,
    formData,
    setFormData,
    teacher_fields,
    handleOpenModal,
    handleSave,
    handleDelete,
    detail,
    isDetailOpen,
    isDetailLoading,
    openDetail,
    closeDetail,
  } = useAdminTeachers();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teachers Staff
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage faculty records and department assignments.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Teacher
        </button>
      </div>

      <AdminToolbar
        searchProps={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by name or employee ID...",
        }}
        filters={[
          {
            label: "Dept",
            value: dept,
            onChange: setDept,
            options: departments.map((d) => d.code),
          },
        ]}
      />

      <AdminTable
        columns={columns}
        data={filteredData}
        onRowClick={openDetail}
        actions={(row) => (
          <>
            <button
              onClick={() => handleOpenModal(row)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setRecordToDelete(row);
                setIsDeleteDialogOpen(true);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <RecordDetailPanel
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title={detail ? `Teacher: ${detail.name}` : "Teacher Details"}
        detail={detail}
        isLoading={isDetailLoading}
        sections={teacherDetailSections}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRecord ? "Edit Teacher" : "Add New Teacher"}
      >
        <AdminForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          submitLabel={currentRecord ? "Update Teacher" : "Save Teacher"}
          fields={teacher_fields}
        />
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Teacher"
        message={`Are you sure you want to remove ${recordToDelete?.name || recordToDelete?.employeeId}? Their course allocations and schedules will be orphaned.`}
      />
    </div>
  );
};

export default AdminTeachers;
