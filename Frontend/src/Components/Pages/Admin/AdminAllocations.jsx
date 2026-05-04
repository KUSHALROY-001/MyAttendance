import React, { useState, useEffect, useMemo } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import AdminForm from "./Component/AdminForm";
import { Plus, Trash2, Pencil } from "lucide-react";
import api from "../../../api/axios";

const initial_form = {
  teacherId: "",
  courseId: "",
  department: "BCA",
  semester: "1",
  section: "A",
  academicYear: "2023-2024",
};

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

const AdminAllocations = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("BCA");
  const [sem, setSem] = useState("1");
  const [sec, setSec] = useState("");
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState(initial_form);

  useEffect(() => {
    api.get("/api/admin/departments").then((res) => setDepartments(res.data));
    api.get("/api/admin/courses").then((res) => setCourses(res.data));
    api.get("/api/admin/teachers").then((res) => setTeachers(res.data));
  }, []);

  const fetchAllocations = async () => {
    const res = await api.get("/api/admin/allocations");
    setData(res.data);
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const filteredData = data.filter((a) => {
    const matchesSearch =
      a.teacherName?.toLowerCase().includes(search.toLowerCase()) ||
      a.courseName?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = dept ? a.department === dept : true;
    const matchesSem = sem ? a.semester.toString() === sem.toString() : true;
    const matchesSec = sec ? a.section === sec : true;

    return matchesSearch && matchesDept && matchesSem && matchesSec;
  });

  const handleOpenModal = (record = null) => {
    // Check if record is actually a data object and not a click event
    const isEdit = record && record.id && typeof record.id === "number";
    
    if (isEdit) {
      setCurrentRecord(record);
      setFormData({
        teacherId: record.teacherId?.toString() || "",
        courseId: record.courseId?.toString() || "",
        department: record.department || "BCA",
        semester: record.semester?.toString() || "1",
        section: record.section || "A",
        academicYear: record.academicYear || "2023-2024",
      });
    } else {
      setCurrentRecord(null);
      setFormData(initial_form);
    }
    setIsModalOpen(true);
  };

  // Reset dependent fields when department changes
  useEffect(() => {
    if (isModalOpen && !currentRecord) {
      setFormData((prev) => ({
        ...prev,
        teacherId: "",
        courseId: "",
        semester: "1",
        section: "A",
      }));
    }
  }, [formData.department, isModalOpen, currentRecord]);

  // Reset course when semester changes
  useEffect(() => {
    if (isModalOpen && !currentRecord) {
      setFormData((prev) => ({
        ...prev,
        courseId: "",
      }));
    }
  }, [formData.semester, isModalOpen, currentRecord]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        await api.put(`/api/admin/allocations/${currentRecord.id}`, formData);
      } else {
        await api.post("/api/admin/allocations", formData);
      }
      setIsModalOpen(false);
      await fetchAllocations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save allocation!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/allocations/${recordToDelete.id}`);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchAllocations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete allocation!");
    }
  };

  const currentDept = departments.find((d) => d.code === dept);
  const semOptions = currentDept?.semesterDetails.map((s) => s.semester) || [];
  const secOptions = currentDept?.semesterDetails.find(
      (s) => s.semester.toString() === sem.toString(),
  )?.sections || [];

  const formCurrentDept = departments.find(
    (d) => d.code === formData.department,
  );
  const formSemOptions =
    formCurrentDept?.semesterDetails.map((s) => s.semester) || [];
  const formSecOptions = formCurrentDept?.semesterDetails.find(
      (s) => s.semester.toString() === formData.semester?.toString(),
  )?.sections || [];

  // Filter teachers and courses for dropdown based on selected form department
  const formTeachers = useMemo(() => {
    return teachers
      .filter((t) => t.department === formData.department)
      .map((t) => ({ label: t.name, value: t.id }));
  }, [teachers, formData.department]);

  const formCourses = useMemo(() => {
    return courses
      .filter((c) => c.department === formData.department && c.semester.toString() === formData.semester?.toString())
      .map((c) => ({ label: `${c.name} (${c.code})`, value: c.id }));
  }, [courses, formData.department, formData.semester]);

  const allocation_fields = useMemo(
    () => [
      {
        name: "department",
        label: "Department",
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
        name: "teacherId",
        label: "Select Teacher",
        type: "select",
        options: formTeachers,
        colSpan: 6,
      },
      {
        name: "courseId",
        label: "Select Course",
        type: "select",
        options: formCourses,
        colSpan: 6,
      },
      {
        name: "academicYear",
        label: "Academic Year",
        colSpan: 12,
      },
    ],
    [departments, formSemOptions, formSecOptions, formTeachers, formCourses],
  );

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
