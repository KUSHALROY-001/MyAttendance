import React, { useEffect, useState } from "react";
import AdminTable from "./Component/AdminTable";
import AdminModal from "./Component/AdminModal";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import AdminForm from "./Component/AdminForm";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api from "../../../api/axios";

const initial_form = {
  name: "",
  employeeId: "",
  email: "",
  department: "BCA",
  designation: "",
  contactNumber: "",
};

const columns = [
  {
    header: "EMPLOYEE ID",
    accessor: "employeeId",
    render: (r) => (
      <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
        {r.employeeId}
      </span>
    ),
  },
  {
    header: "Teacher Details",
    accessor: "name",
    render: (r) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          {r.name}
        </p>
        <p className="text-xs text-slate-500">{r.email}</p>
      </div>
    ),
  },
  { header: "Contact Number", accessor: "contactNumber" },
  { header: "Department", accessor: "department" },
  { header: "Designation", accessor: "designation" },
];

const AdminTeachers = () => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teachers Staff
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage faculty records and department assignments.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Teacher
        </button>
      </div>

      <AdminToolbar
        searchProps={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by name or employee ID...",
        }}
        filters={[
          {
            label: "Dept",
            value: dept,
            onChange: setDept,
            options: departments.map((d) => d.code),
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
        title={currentRecord ? "Edit Teacher" : "Add New Teacher"}
      >
        <AdminForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          submitLabel={currentRecord ? "Update Teacher" : "Save Teacher"}
          fields={teacher_fields}
        />
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Teacher"
        message={`Are you sure you want to remove ${recordToDelete?.name || recordToDelete?.employeeId}? Their course allocations and schedules will be orphaned.`}
      />
    </div>
  );
};

export default AdminTeachers;
