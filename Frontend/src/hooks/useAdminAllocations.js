import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import useRecordDetail from "./useRecordDetail";
import { getDepartmentSemesters, getSemesterSections } from "../utils/adminHelpers";

const initial_form = {
  teacherId: "",
  courseId: "",
  department: "BCA",
  semester: "1",
  section: "A",
  academicYear: "2023-2024",
};

export const useAdminAllocations = () => {
  const detailState = useRecordDetail(
    (row) => `/api/admin/allocations/${row.id}/detail`,
  );
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

  const semOptions = getDepartmentSemesters(departments, dept);
  const secOptions = getSemesterSections(departments, dept, sem);

  const formSemOptions = getDepartmentSemesters(departments, formData.department);
  const formSecOptions = getSemesterSections(departments, formData.department, formData.semester);

  const formTeachers = useMemo(() => {
    return teachers
      .filter((t) => t.department === formData.department)
      .map((t) => ({ label: t.name, value: t.id }));
  }, [teachers, formData.department]);

  const formCourses = useMemo(() => {
    return courses
      .filter(
        (c) =>
          c.department === formData.department &&
          c.semester.toString() === formData.semester?.toString(),
      )
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

  return {
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
    ...detailState,
  };
};

export default useAdminAllocations;
