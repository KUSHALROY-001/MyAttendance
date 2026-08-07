import React from "react";
import AdminTable from "../components/admin/AdminTable";
import AdminModal from "../components/admin/AdminModal";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import AdminToolbar from "../components/admin/AdminToolbar";
import AdminForm from "../components/admin/AdminForm";
import RecordDetailPanel from "../components/admin/RecordDetailPanel";
import { Plus, Trash2, Pencil } from "lucide-react";
import useAdminAllocations from "../hooks/useAdminAllocations";

const columns = [
  {
    header: "Faculty",
    accessor: "teacherName",
    render: (r) => (
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {r.teacherName}
      </span>
    ),
  },
  {
    header: "Course details",
    accessor: "courseName",
    render: (r) => (
      <div>
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">
          {r.courseName}
        </p>
        <p className="text-xs text-slate-500">{r.courseCode}</p>
      </div>
    ),
  },
  {
    header: "Dept / Sem",
    accessor: "department",
    render: (r) => `${r.department} (Sem ${r.semester})`,
  },
  {
    header: "Section",
    accessor: "section",
    render: (r) => (
      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-xs">
        {r.section}
      </span>
    ),
  },
  { header: "Academic Yr", accessor: "academicYear" },
];

const allocationDetailSections = [
  {
    title: "Allocation",
    fields: [
      { label: "Teacher", accessor: "teacherName" },
      { label: "Employee ID", accessor: "teacherEmployeeId" },
      { label: "Course", accessor: "courseName" },
      { label: "Course Code", accessor: "courseCode" },
      { label: "Department", accessor: "department" },
      { label: "Semester", render: (d) => `Semester ${d.semester}` },
      { label: "Section", accessor: "section" },
      { label: "Academic Year", accessor: "academicYear" },
      { label: "Sessions Taken", accessor: "sessionsTaken" },
    ],
  },
];

const AdminAllocations = () => {
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
    allocation_fields,
    handleOpenModal,
    handleSave,
    handleDelete,
    detail,
    isDetailOpen,
    isDetailLoading,
    openDetail,
    closeDetail,
  } = useAdminAllocations();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Allocations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign faculty combinations to subjects and sections.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Assign Course
        </button>
      </div>

      <AdminToolbar
        searchProps={{
          value: search,
          onChange: setSearch,
          placeholder: "Search teacher or course...",
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
        title={detail ? `Allocation: ${detail.courseCode}` : "Allocation Details"}
        detail={detail}
        isLoading={isDetailLoading}
        sections={allocationDetailSections}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRecord ? "Edit Allocation" : "Assign New Course"}
      >
        <AdminForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          submitLabel={currentRecord ? "Update Allocation" : "Assign Course"}
          fields={allocation_fields}
        />
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Remove Allocation"
        message={`Are you sure you want to revoke this course assignment? This will decouple the teacher from this class.`}
      />
    </div>
  );
};

export default AdminAllocations;
