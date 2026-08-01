import React from "react";
import AdminTable from "../components/admin/AdminTable";
import AdminModal from "../components/admin/AdminModal";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import AdminToolbar from "../components/admin/AdminToolbar";
import AdminForm from "../components/admin/AdminForm";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useAdminCourses from "../hooks/useAdminCourses";

const columns = [
  {
    header: "Code",
    accessor: "code",
    render: (r) => (
      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
        {r.code}
      </span>
    ),
  },
  {
    header: "Course Name",
    accessor: "name",
    render: (r) => (
      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
        {r.name}
      </span>
    ),
  },
  { header: "Department", accessor: "department" },
  {
    header: "Semester",
    accessor: "semester",
    render: (r) => `Sem ${r.semester}`,
  },
  {
    header: "Credits",
    accessor: "credits",
    render: (r) => (
      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
        {r.credits} CR
      </span>
    ),
  },
];

const AdminCourses = () => {
  const {
    departments,
    search,
    setSearch,
    dept,
    setDept,
    sem,
    setSem,
    semOptions,
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
    course_fields,
    handleOpenModal,
    handleSave,
    handleDelete,
  } = useAdminCourses();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage the catalog of academic subjects / courses.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Course
        </button>
      </div>

      <AdminToolbar
        searchProps={{
          value: search,
          onChange: setSearch,
          placeholder: "Search course name or code...",
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
        title={currentRecord ? "Edit Course" : "Add New Course"}
      >
        <AdminForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          submitLabel={currentRecord ? "Update Course" : "Save Course"}
          fields={course_fields}
        />
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to permanently delete ${recordToDelete?.code}?`}
      />
    </div>
  );
};

export default AdminCourses;
