import React from "react";
import AdminTable from "../components/admin/AdminTable";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import AdminToolbar from "../components/admin/AdminToolbar";
import RecordDetailPanel from "../components/admin/RecordDetailPanel";
import { Trash2 } from "lucide-react";
import useAdminUsers from "../hooks/useAdminUsers";
import { formatDateMedium } from "../utils/formatters";

const roleStyles = {
  STUDENT:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  TEACHER:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  ADMIN:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  SUPER_ADMIN:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

const profileStyles = {
  STUDENT:
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  TEACHER:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  ADMIN:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

const columns = [
  {
    header: "User Profile",
    accessor: "name",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          {row.name}
        </p>
        <p className="text-xs text-slate-500">{row.email}</p>
      </div>
    ),
  },
  {
    header: "Account Type",
    accessor: "profileType",
    render: (row) => (
      <div>
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${profileStyles[row.profileType] || profileStyles.ADMIN}`}
        >
          {row.profileType}
        </span>
        <p className="text-xs text-slate-500 mt-1">
          {row.profileCode || "Direct admin account"}
        </p>
      </div>
    ),
  },
  {
    header: "Created Date",
    accessor: "createdAt",
    render: (row) => formatDateMedium(row.createdAt),
  },
  {
    header: "Current Role",
    accessor: "role",
    render: (row) => (
      <span
        className={`px-2.5 py-1 text-xs font-bold rounded-full border ${roleStyles[row.role]}`}
      >
        {row.role}
      </span>
    ),
  },
];

const userDetailSections = [
  {
    title: "Account",
    fields: [
      { label: "Name", accessor: "name" },
      { label: "Email", accessor: "email" },
      { label: "Role", accessor: "role" },
      { label: "Status", accessor: "status" },
      { label: "Profile Type", accessor: "profileType" },
    ],
  },
  {
    title: "Linked Profile",
    fields: [
      {
        label: "Student Profile",
        fullWidth: true,
        render: (d) =>
          d.studentProfile
            ? `${d.studentProfile.rollNumber} / ${d.studentProfile.enrollmentNumber} - ${d.studentProfile.department} Sem ${d.studentProfile.semester}, Sec ${d.studentProfile.section}`
            : "No linked student profile",
      },
      {
        label: "Teacher Profile",
        fullWidth: true,
        render: (d) =>
          d.teacherProfile
            ? `${d.teacherProfile.employeeId} - ${d.teacherProfile.department}, ${d.teacherProfile.designation}`
            : "No linked teacher profile",
      },
      {
        label: "Allowed Roles",
        fullWidth: true,
        render: (d) => d.allowedRoles?.join(", ") || "No role changes allowed",
      },
    ],
  },
];

const AdminUsers = () => {
  const {
    data,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    loading,
    updatingUserId,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    recordToDelete,
    setRecordToDelete,
    isPromoteDialogOpen,
    setIsPromoteDialogOpen,
    userToPromote,
    filteredData,
    handleRoleChange,
    confirmPromotion,
    handleDelete,
    detail,
    isDetailOpen,
    isDetailLoading,
    openDetail,
    closeDetail,
  } = useAdminUsers();

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
          placeholder: "Search by name, email, or profile code...",
        }}
        filters={[
          {
            label: "Role",
            value: filterRole,
            onChange: setFilterRole,
            options: [...new Set(data.map((user) => user.role))],
          },
        ]}
      />

      <AdminTable
        columns={columns}
        data={loading ? [] : filteredData}
        emptyMessage={loading ? "Loading users..." : "No users found."}
        onRowClick={openDetail}
        actions={(row) => (
          <div className="flex items-center gap-3">
            <select
              value={row.role}
              disabled={updatingUserId === row.id}
              onChange={(e) => handleRoleChange(row, e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-60"
            >
              {row.allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
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

      <RecordDetailPanel
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title={detail ? `User: ${detail.name}` : "User Details"}
        detail={detail}
        isLoading={isDetailLoading}
        sections={userDetailSections}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Warning: You are about to permanently delete the account for ${recordToDelete?.name}. This will prevent them from logging in and may remove linked profile data.`}
      />

      <ConfirmDialog
        isOpen={isPromoteDialogOpen}
        onClose={() => setIsPromoteDialogOpen(false)}
        onConfirm={confirmPromotion}
        title="Confirm Super Admin Promotion"
        message={`Are you sure you want to promote ${userToPromote?.name} (${userToPromote?.email}) to SUPER_ADMIN? This will grant them unrestricted administrative privileges across the institute.`}
        confirmText="Promote to Super Admin"
        confirmVariant="warning"
      />
    </div>
  );
};

export default AdminUsers;
