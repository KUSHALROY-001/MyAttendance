import React from "react";
import AdminDashboardSkeleton from "../components/common/skeletons/AdminDashboardSkeleton";
import StatCard from "../components/common/StatCard";
import AdminTable from "../components/admin/AdminTable";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import useAdminDashboard from "../hooks/useAdminDashboard";
import { formatDateTimeShort, calculateAttendancePercent } from "../utils/formatters";

const recentSessionColumns = [
  {
    header: "Course",
    accessor: "course",
    render: (session) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {session.course}
        </p>
        <p className="text-xs text-slate-500">
          {formatDateTimeShort(session.date)}
        </p>
      </div>
    ),
  },
  {
    header: "Teacher",
    accessor: "teacher",
  },
  {
    header: "Class Info",
    accessor: "department",
    render: (session) => (
      <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
        {session.department} • Sem {session.semester}
        {session.section ? ` • Sec ${session.section}` : ""}
      </span>
    ),
  },
  {
    header: "Attendance",
    accessor: "present",
    render: (session) => (
      <div className="text-left sm:text-right">
        <p className="font-semibold text-slate-900 dark:text-white">
          {session.present}/{session.total}
        </p>
        <p className="text-xs text-slate-500">
          {calculateAttendancePercent(session.present, session.total)}%
        </p>
      </div>
    ),
  },
];

const AdminDashboard = () => {
  const { dashboardData, loading } = useAdminDashboard();

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Institution-wide analytics and today&apos;s activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <StatCard
          title="Total Students"
          value={dashboardData.student?.toString()}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Total Teachers"
          value={dashboardData.teacher?.toString()}
          icon={<GraduationCap className="w-6 h-6 text-indigo-500" />}
          iconBg="bg-indigo-500/10"
        />
        <StatCard
          title="Total Departments"
          value={dashboardData.department?.toString()}
          icon={<BookOpen className="w-6 h-6 text-violet-500" />}
          iconBg="bg-violet-500/10"
        />
      </div>

      <div className="space-y-0 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            10 Recent Sessions
          </h2>
        </div>

        <AdminTable
          columns={recentSessionColumns}
          data={dashboardData.recentSessions || []}
          emptyMessage="No recent sessions found."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
