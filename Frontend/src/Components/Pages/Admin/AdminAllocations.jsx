import React, { useState } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import {
  mockAllocations,
  mockTeachers,
  mockCourses,
} from "../../../data/adminMockData";
import { Plus, Trash2 } from "lucide-react";

const AdminAllocations = () => {
  const [data, setData] = useState(mockAllocations);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [filterSec, setFilterSec] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [formData, setFormData] = useState({
    teacherId: "",
    courseCode: "",
    department: "BCA",
    semester: "1",
    section: "A",
    academicYear: "2023-2024",
  });

  const filteredData = data.filter((a) => {
    const matchesSearch =
      a.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      a.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? a.department === filterDept : true;
    const matchesSem = filterSem
      ? a.semester.toString() === filterSem.toString()
      : true;
    const matchesSec = filterSec ? a.section === filterSec : true;

    return matchesSearch && matchesDept && matchesSem && matchesSec;
  });

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

  const handleOpenModal = () => {
    setFormData({
      teacherId: "",
      courseCode: "",
      department: "BCA",
      semester: "1",
      section: "A",
      academicYear: "2023-2024",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Lookup teacher name and course name from the selected IDs for mock rendering
    const teacher = mockTeachers.find(
      (t) => t.id.toString() === formData.teacherId.toString(),
    );
    const course = mockCourses.find((c) => c.code === formData.courseCode);

    if (!teacher || !course)
      return alert("Please select valid teacher and course.");

    setData([
      ...data,
      {
        id: Date.now(),
        teacherId: teacher.id,
        teacherName: teacher.name,
        courseCode: course.code,
        courseName: course.name,
        department: formData.department,
        semester: parseInt(formData.semester),
        section: formData.section,
        academicYear: formData.academicYear,
      },
    ]);
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
            Course Allocations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign faculty combinations to subjects and sections.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
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
          {
            label: "Sec",
            value: filterSec,
            onChange: setFilterSec,
            options: [...new Set(data.map((d) => d.section))].sort(),
          },
        ]}
      />

      <AdminTable
        columns={columns}
        data={filteredData}
        actions={(row) => (
          <button
            onClick={() => {
              setRecordToDelete(row);
              setIsDeleteDialogOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign New Course"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Select Teacher
            </label>
            <select
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              value={formData.teacherId}
              onChange={(e) =>
                setFormData({ ...formData, teacherId: e.target.value })
              }
            >
              <option value="">-- Choose Faculty --</option>
              {mockTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Select Course
            </label>
            <select
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              value={formData.courseCode}
              onChange={(e) =>
                setFormData({ ...formData, courseCode: e.target.value })
              }
            >
              <option value="">-- Choose Subject --</option>
              {mockCourses.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
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
                Semester
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Section
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Academic Year
              </label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.academicYear}
                onChange={(e) =>
                  setFormData({ ...formData, academicYear: e.target.value })
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
              Assign Course
            </button>
          </div>
        </form>
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
