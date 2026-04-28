import React, { useEffect, useState } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import AdminForm from "./Component/AdminForm";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../../api/axios";

const initial_form = {
  name: "",
  rollNumber: "",
  email: "",
  department: "BCA",
  semester: "1",
  section: "A",
  batch: "",
  contactNumber: "",
};

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
          {r.user?.name}
        </p>
        <p className="text-xs text-slate-500">{r.user?.email}</p>
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
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("BCA");
  const [sem, setSem] = useState("1");
  const [sec, setSec] = useState("");
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState(initial_form);

  useEffect(() => {
    api.get("/api/admin/departments").then((res) => setDepartments(res.data));
  }, []);

  const fetchStudents = async () => {
    const res = await api.get(
      `/api/admin/students?department=${dept}&semester=${sem}&section=${sec}`,
    );
    setData(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, [dept, sem, sec]);

  const filteredData = data.filter(
    (s) =>
      s.user.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenModal = (record = null) => {
    setCurrentRecord(record);
    setFormData(
      record
        ? {
            name: record.user?.name || "",
            rollNumber: record.rollNumber || "",
            email: record.user?.email || "",
            department: record.department || "BCA",
            semester: record.semester?.toString() || "1",
            section: record.section || "A",
            batch: record.batch || "",
            contactNumber: record.contactNumber || "",
          }
        : initial_form,
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        await api.put(`/api/admin/students/${currentRecord.id}`, formData);
      } else {
        await api.post("/api/admin/students", formData);
      }
      setIsModalOpen(false);
      await fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/students/${recordToDelete.id}`);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete student!");
    }
  };

  const currentDept = departments.find((d) => d.code === dept);
  const semOptions = currentDept?.semesterDetails.map((s) => s.semester) || [];
  const secOptions =
    currentDept?.semesterDetails.find(
      (s) => s.semester.toString() === sem.toString(),
    )?.sections || [];

  const formCurrentDept = departments.find(
    (d) => d.code === formData.department,
  );
  const formSemOptions =
    formCurrentDept?.semesterDetails.map((s) => s.semester) || [];
  const formSecOptions =
    formCurrentDept?.semesterDetails.find(
      (s) => s.semester.toString() === formData.semester?.toString(),
    )?.sections || [];

  const student_fields = [
    { name: "name", label: "Full Name", colSpan: 6 },
    {
      name: "rollNumber",
      label: "Roll Number",
      className: "font-mono",
      colSpan: 6,
    },
    { name: "email", label: "Email Address", type: "email", colSpan: 12 },
    {
      name: "department",
      label: "Dept",
      type: "select",
      options: departments.map((d) => d.code),
      colSpan: 6,
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      options: formSemOptions,
      colSpan: 3,
    },
    {
      name: "section",
      label: "Section",
      type: "select",
      options: formSecOptions,
      colSpan: 3,
    },
    {
      name: "batch",
      label: "Batch Year",
      required: false,
      placeholder: "e.g. 2023-26",
      colSpan: 6,
    },
    { name: "contactNumber", label: "Contact", required: false, colSpan: 6 },
  ];

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
        message={`Are you sure you want to delete ${recordToDelete?.user?.name || recordToDelete?.rollNumber}? This action cannot be undone and will remove all their attendance records.`}
      />
    </div>
  );
};

export default AdminStudents;
