import React, { useState, useEffect, useMemo } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import AdminForm from "./Component/AdminForm";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../../api/axios";

const initial_form = {
  code: "",
  name: "",
  department: "BCA",
  semester: "1",
  credits: "3",
};

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
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("BCA");
  const [sem, setSem] = useState("1");
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState(initial_form);

  useEffect(() => {
    api.get("/api/admin/departments").then((res) => setDepartments(res.data));
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("/api/admin/courses");
    setData(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredData = data.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = dept ? c.department === dept : true;
    const matchesSem = sem ? c.semester.toString() === sem.toString() : true;

    return matchesSearch && matchesDept && matchesSem;
  });

  const handleOpenModal = (record = null) => {
    setCurrentRecord(record);
    setFormData(
      record
        ? {
            code: record.code || "",
            name: record.name || "",
            department: record.department || "BCA",
            semester: record.semester?.toString() || "1",
            credits: record.credits?.toString() || "3",
          }
        : initial_form,
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        await api.put(`/api/admin/courses/${currentRecord.id}`, formData);
      } else {
        await api.post("/api/admin/courses", formData);
      }
      setIsModalOpen(false);
      await fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/courses/${recordToDelete.id}`);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course!");
    }
  };

  const currentDept = departments.find((d) => d.code === dept);
  const semOptions = currentDept?.semesterDetails.map((s) => s.semester) || [];

  const formCurrentDept = departments.find(
    (d) => d.code === formData.department,
  );
  const formSemOptions =
    formCurrentDept?.semesterDetails.map((s) => s.semester) || [];

  const course_fields = useMemo(
    () => [
      {
        name: "code",
        label: "Course Code",
        className: "font-mono uppercase",
        placeholder: "e.g. CS101",
        colSpan: 6,
      },
      {
        name: "credits",
        label: "Credits",
        type: "number",
        min: 1,
        max: 6,
        colSpan: 6,
      },
      { name: "name", label: "Full Course Name", colSpan: 12 },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: departments.map((d) => d.code),
        colSpan: 6,
      },
      {
        name: "semester",
        label: "Target Semester",
        type: "select",
        options: formSemOptions,
        colSpan: 6,
      },
    ],
    [departments, formSemOptions],
  );

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
