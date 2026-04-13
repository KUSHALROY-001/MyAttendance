import React from "react";
import AdminStatCard from "./Component/AdminStatCard";
import {
  mockSessions,
  mockDefaulters,
  mockStudents,
  mockTeachers,
  mockCourses,
} from "../../../data/adminMockData";

import {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Institution-wide analytics and today's activity.
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <AdminStatCard
          title="Total Students"
          value={mockStudents.length.toString()}
          icon={<Users className="w-6 h-6" />}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <AdminStatCard
          title="Total Teachers"
          value={mockTeachers.length.toString()}
          icon={<GraduationCap className="w-6 h-6" />}
          iconColor="text-indigo-500"
          bgColor="bg-indigo-500/10"
        />
        <AdminStatCard
          title="Total Courses"
          value={mockCourses.length.toString()}
          icon={<BookOpen className="w-6 h-6" />}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
        <AdminStatCard
          title="Sessions Today"
          value="4"
          icon={<CheckCircle className="w-6 h-6" />}
          subtitle="3 pending"
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <AdminStatCard
          title="Avg Attendance"
          value="84%"
          icon={<TrendingUp className="w-6 h-6" />}
          subtitle="+2% from last week"
          iconColor="text-amber-500"
          bgColor="bg-amber-500/10"
        />
        <AdminStatCard
          title="Defaulters Alert"
          value={mockDefaulters.length.toString()}
          icon={<AlertTriangle className="w-6 h-6" />}
          subtitle="Students < 75%"
          iconColor="text-red-500"
          bgColor="bg-red-500/10"
        />
      </div>

      {/* Two Column Layout for Dash Data */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Sessions
            </h2>
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-medium text-slate-500 dark:text-slate-500 hidden sm:table-header-group border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Teacher</th>
                  <th className="px-5 py-3">Class Info</th>
                  <th className="px-5 py-3 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 block sm:table-row-group">
                {mockSessions.slice(0, 4).map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 block sm:table-row"
                  >
                    <td className="px-4 py-3 sm:px-5 block sm:table-cell border-b sm:border-0 border-slate-100 dark:border-slate-800">
                      <span className="sm:hidden font-semibold text-xs uppercase text-slate-400 block mb-1">
                        Course
                      </span>
                      <p className="font-medium text-slate-900 dark:text-slate-200">
                        {session.course}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(session.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-5 block sm:table-cell border-b sm:border-0 border-slate-100 dark:border-slate-800">
                      <span className="sm:hidden font-semibold text-xs uppercase text-slate-400 block mb-1">
                        Teacher
                      </span>
                      {session.teacher}
                    </td>
                    <td className="px-4 py-3 sm:px-5 block sm:table-cell border-b sm:border-0 border-slate-100 dark:border-slate-800">
                      <span className="sm:hidden font-semibold text-xs uppercase text-slate-400 block mb-1">
                        Class Info
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                        {session.department} •{" "}
                        {session.semester
                          ? `Sem ${session.semester}`
                          : `Sec ${session.section}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-5 block sm:table-cell text-left sm:text-right">
                      <span className="sm:hidden font-semibold text-xs uppercase text-slate-400 block mb-1">
                        Attendance
                      </span>
                      <div className="flex items-center sm:justify-end gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {session.present}/{session.total}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({Math.round((session.present / session.total) * 100)}
                          %)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Defaulters Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-red-100 dark:border-red-900/30 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              Critical Defaulters
            </div>
          </div>
          <div className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {mockDefaulters.slice(0, 5).map((def) => (
              <div
                key={def.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">
                    {def.name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {def.rollNumber} • {def.course}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-bold text-xs ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20">
                    {def.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 mt-auto">
            <button className="w-full text-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1">
              View Full Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
