import { useState, useEffect } from "react";
import api from "../api/axios";

const initial_form = {
  name: "",
  employeeId: "",
  email: "",
  department: "BCA",
  designation: "",
  contactNumber: "",
};

export const useAdminTeachers = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("BCA");
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState(initial_form);

  useEffect(() => {
    api
      .get("/api/admin/departments?deptOnly=true")
      .then((res) => setDepartments(res.data));
  }, []);

  const fetchTeachers = async () => {
    const res = await api.get(`/api/admin/teachers?department=${dept}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchTeachers();
  }, [dept]);

  const filteredData = data.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.employeeId?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenModal = (record = null) => {
    setCurrentRecord(record);
    setFormData(
      record
        ? {
            name: record.name || "",
            employeeId: record.employeeId || "",
            email: record.email || "",
            department: record.department || "BCA",
            designation: record.designation || "",
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
        await api.put(`/api/admin/teachers/${currentRecord.id}`, formData);
      } else {
        await api.post("/api/admin/teachers", formData);
      }
      setIsModalOpen(false);
      await fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/teachers/${recordToDelete.id}`);
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete teacher!");
    }
  };

  const teacher_fields = [
    { name: "name", label: "Full Name", colSpan: 6 },
    {
      name: "employeeId",
      label: "Employee ID",
      className: "font-mono",
      colSpan: 6,
    },
    { name: "email", label: "Email Address", type: "email", colSpan: 12 },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: departments.map((d) => d.code),
      colSpan: 4,
    },
    { name: "designation", label: "Designation", colSpan: 4 },
    {
      name: "contactNumber",
      label: "Contact",
      required: false,
      colSpan: 4,
    },
  ];

  return {
    departments,
    search,
    setSearch,
    dept,
    setDept,
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
    teacher_fields,
    handleOpenModal,
    handleSave,
    handleDelete,
  };
};

export default useAdminTeachers;
