import React from "react";
import AdminTable from "../components/admin/AdminTable";
import AdminModal from "../components/admin/AdminModal";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import AdminToolbar from "../components/admin/AdminToolbar";
import AdminForm from "../components/admin/AdminForm";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useAdminStudents from "../hooks/useAdminStudents";

const columns = [
  {
    header: "Roll Number",
    accessor: "rollNumber",
    render: (r) => (
      <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded">
        {r.rollNumber}
      </span>
    ),
  },
  {
    header: "Name",
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
  {
    header: "Dep/Sem",
    accessor: "department",
    render: (r) => `${r.department} Sem-${r.semester}`,
  },
  { header: "Section", accessor: "section" },
  { header: "Batch", accessor: "batch" },
];

const AdminStudents = () => {
  const {
    departments,
    search,
    setSearch,
    dept,
    setDept,
    sem,
    setSem,
    sec,
    setSec,
    semOptions,
    secOptions,
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
    student_fields,
    handleOpenModal,
    handleSave,
    handleDelete,
  } = useAdminStudents();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Students Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage overall student records and enrollment profiles.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Student
        </button>
      </div>

      <AdminToolbar
        searchProps={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by name or roll...",
        }}
        filters={[
          {
            label: "Dept",
            value: dept,
            onChange: setDept,
            options: departments.map((d) => d.code),
          },
          {
            label: "Sem",
            value: sem,
            onChange: setSem,
            field: "Sem",
            options: semOptions,
          },
          {
            label: "Sec",
            value: sec,
            onChange: setSec,
            field: "Sec",
            options: secOptions,
          },
        ]}
      />

      <AdminTable
        columns={columns}
        data={filteredData}
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

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRecord ? "Edit Student" : "Add New Student"}
      >
        <AdminForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          submitLabel={currentRecord ? "Update Student" : "Save Student"}
          fields={student_fields}
        />
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${recordToDelete?.name || recordToDelete?.rollNumber}? This action cannot be undone and will remove all their attendance records.`}
      />
    </div>
  );
};

export default AdminStudents;
