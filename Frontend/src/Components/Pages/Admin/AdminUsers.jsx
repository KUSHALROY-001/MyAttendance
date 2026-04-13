import React, { useState } from "react";
import AdminTable from "./Component/AdminTable";
import ConfirmDialog from "./Component/ConfirmDialog";
import AdminToolbar from "./Component/AdminToolbar";
import { mockUsers } from "../../../data/adminMockData";
import { Trash2 } from "lucide-react";

const AdminUsers = () => {
  const [data, setData] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const filteredData = data.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole ? u.role === filterRole : true;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (id, newRole) => {
    setData(data.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const roleStyles = {
    STUDENT:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    TEACHER:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    ADMIN:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const columns = [
    {
      header: "User Profile",
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
    {
      header: "Created Date",
      accessor: "createdAt",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      header: "Current Role",
      accessor: "role",
      render: (r) => (
        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-full border ${roleStyles[r.role]}`}
        >
          {r.role}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          User Access & Roles
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage system accounts and their permission levels.
        </p>
      </div>

      <AdminToolbar
        searchProps={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by name or email...",
        }}
        filters={[
          {
            label: "Role",
            value: filterRole,
            onChange: setFilterRole,
            options: [...new Set(data.map((d) => d.role))],
          },
        ]}
      />

      <AdminTable
        columns={columns}
        data={filteredData}
        actions={(row) => (
          <div className="flex items-center gap-3">
            <select
              value={row.role}
              onChange={(e) => handleRoleChange(row.id, e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              onClick={() => {
                setRecordToDelete(row);
                setIsDeleteDialogOpen(true);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() =>
          setData(data.filter((d) => d.id !== recordToDelete.id))
        }
        title="Delete User"
        message={`Warning: You are about to permanently delete the account for ${recordToDelete?.name}. This will prevent them from logging in.`}
      />
    </div>
  );
};

export default AdminUsers;
