import React, { useState } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import { mockCourses } from "../../../data/adminMockData";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminCourses = () => {
  const [data, setData] = useState(mockCourses);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "",
    semester: "1",
    credits: "3",
  });

  const filteredData = data.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? c.department === filterDept : true;
    const matchesSem = filterSem
      ? c.semester.toString() === filterSem.toString()
      : true;

    return matchesSearch && matchesDept && matchesSem;
  });

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

  const handleOpenModal = (record = null) => {
    setCurrentRecord(record);
    if (record) {
      setFormData(record);
    } else {
      setFormData({
        code: "",
        name: "",
        department: "",
        semester: "1",
        credits: "3",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentRecord) {
      setData(
        data.map((d) =>
          d.id === currentRecord.id
            ? {
                ...d,
                ...formData,
                semester: parseInt(formData.semester),
                credits: parseInt(formData.credits),
              }
            : d,
        ),
      );
    } else {
      setData([
        ...data,
        {
          id: Date.now(),
          ...formData,
          semester: parseInt(formData.semester),
          credits: parseInt(formData.credits),
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setData(data.filter((d) => d.id !== recordToDelete.id));
  };

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
            value: filterDept,
            onChange: setFilterDept,
            options: [...new Set(data.map((d) => d.department))],
          },
          {
            label: "Sem",
            value: filterSem,
            onChange: setFilterSem,
            options: [...new Set(data.map((d) => d.semester))].sort(),
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
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Course Code
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g. CS101"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Credits
              </label>
              <input
                required
                type="number"
                min="1"
                max="6"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.credits}
                onChange={(e) =>
                  setFormData({ ...formData, credits: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Full Course Name
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Department
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Target Semester
              </label>
              <input
                required
                type="number"
                min="1"
                max="10"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Save Course
            </button>
          </div>
        </form>
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
