import React from "react";
import StatCard from "../common/StatCard";
import { Users, CheckCircle, XCircle, Clock } from "lucide-react";

export default function TakeAttendanceStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total"
        value={stats.total}
        icon={
          <Users className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        }
        iconBg="bg-slate-50 dark:bg-slate-800"
      />

      <StatCard
        title="Present"
        value={stats.present}
        icon={
          <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
        }
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
      />

      <StatCard
        title="Absent"
        value={stats.absent}
        icon={
          <XCircle className="h-5 w-5 text-red-500 dark:text-red-300" />
        }
        iconBg="bg-red-50 dark:bg-red-500/10"
      />

      <StatCard
        title="Late"
        value={stats.late}
        icon={
          <Clock className="h-5 w-5 text-amber-500 dark:text-amber-300" />
        }
        iconBg="bg-amber-50 dark:bg-amber-500/10"
      />
    </div>
  );
}
