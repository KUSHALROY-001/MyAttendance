import { useState, useEffect } from "react";
import api from "../api/axios";
import useRecordDetail from "./useRecordDetail";
import {
  getDepartmentSemesters,
  getSemesterSections,
} from "../utils/adminHelpers";

const initial_form = {
  name: "",
  rollNumber: "",
  enrollmentNumber: "",
  email: "",
  department: "BCA",
  semester: "1",
  section: "A",
  batch: "",
  contactNumber: "",
};

export const useAdminStudents = () => {
  const detailState = useRecordDetail(
    (row) => `/api/admin/students/${row.id}/detail`,
  );
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
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenModal = (record = null) => {
    setCurrentRecord(record);
    setFormData(
      record
        ? {
            name: record.name || "",
            rollNumber: record.rollNumber || "",
            enrollmentNumber: record.enrollmentNumber || "",
            email: record.email || "",
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

  const semOptions = getDepartmentSemesters(departments, dept);
  const secOptions = getSemesterSections(departments, dept, sem);

  const formSemOptions = getDepartmentSemesters(
    departments,
    formData.department,
  );
  const formSecOptions = getSemesterSections(
    departments,
    formData.department,
    formData.semester,
  );

  const student_fields = [
    { name: "name", label: "Full Name", colSpan: 6 },
    {
      name: "rollNumber",
      label: "Roll Number",
      className: "font-mono",
      colSpan: 6,
    },
    {
      name: "enrollmentNumber",
      label: "Enrollment Number",
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
    student_fields,
    handleOpenModal,
    handleSave,
    handleDelete,
    refetch: fetchStudents,
    ...detailState,
  };
};

export default useAdminStudents;
