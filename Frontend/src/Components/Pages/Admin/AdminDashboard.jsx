import React, { useState, useEffect } from "react";
import AdminStatCard from "./Component/AdminStatCard";
import LoadingAnimation from "../../UI/LoadingAnimation";
import StatCard from "../../UI/StatCard";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import api from "../../../api/axios";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    student: 0,
    teacher: 0,
    department: 0,
    recentSessions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/admin/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

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
        <StatCard
          title="Total Students"
          value={dashboardData.student?.toString()}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Total Teachers"
          value={dashboardData.teacher?.toString()}
          icon={<GraduationCap className="w-6 h-6  text-indigo-500" />}
          iconBg="bg-indigo-500/10"
        />
        <StatCard
          title="Total Departments"
          value={dashboardData.department?.toString()}
          icon={<BookOpen className="w-6 h-6 text-violet-500" />}
          iconBg="bg-violet-500/10"
        />
      </div>

      {/* Dash Data */}
      <div>
        {/* Recent Sessions Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              10 Recent Sessions
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
                {dashboardData.recentSessions?.length > 0 ? (
                  dashboardData.recentSessions?.map((session) => (
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
                            (
                            {session.total > 0
                              ? Math.round(
                                  (session.present / session.total) * 100,
                                )
                              : 0}
                            %)
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-slate-500 block sm:table-cell"
                    >
                      No recent sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
