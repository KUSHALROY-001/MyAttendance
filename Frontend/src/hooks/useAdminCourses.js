import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import useRecordDetail from "./useRecordDetail";
import { getDepartmentSemesters } from "../utils/adminHelpers";

const initial_form = {
  code: "",
  name: "",
  department: "BCA",
  semester: "1",
  credits: "3",
};

export const useAdminCourses = () => {
  const detailState = useRecordDetail(
    (row) => `/api/admin/courses/${row.id}/detail`,
  );
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

  const semOptions = getDepartmentSemesters(departments, dept);
  const formSemOptions = getDepartmentSemesters(departments, formData.department);

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

  return {
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
    ...detailState,
  };
};

export default useAdminCourses;
