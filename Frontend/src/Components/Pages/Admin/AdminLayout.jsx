import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  LayoutDashboard,
  Users,
  IdCard,
  Link,
  BookMarked,
  CalendarDays,
  ChartColumn,
  Settings,
  LogOut,
  Moon,
  Sun,
  TableOfContents,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: () => <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Students",
    path: "/admin/students",
    icon: () => <Users className="w-5 h-5" />,
  },
  {
    name: "Teachers",
    path: "/admin/teachers",
    icon: () => <IdCard className="w-5 h-5" />,
  },
  {
    name: "Courses",
    path: "/admin/courses",
    icon: () => <BookMarked className="w-5 h-5" />,
  },
  {
    name: "Allocations",
    path: "/admin/allocations",
    icon: () => <Link size={20} />,
  },
  {
    name: "Schedules",
    path: "/admin/schedules",
    icon: () => <CalendarDays className="w-5 h-5" />,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: () => <ChartColumn className="w-5 h-5" />,
  },
  {
    name: "Users & Roles",
    path: "/admin/users",
    icon: () => <Settings className="w-5 h-5" />,
  },
];

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} h-screen w-full`}>
      <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
              A
            </div>
            <span className="font-bold text-lg tracking-tight">AdminPanel</span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }
              `}
            >
              <div className="shrink-0">{item.icon()}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
          >
            {theme === "dark" ? (
              <>
                <Sun size={21} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={21} /> Dark Mode
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
          >
            <LogOut className="w-5 h-5" /> Back to App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Mobile */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
              A
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {/* Small theme toggle for mobile top bar (optional duplicate) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-md text-slate-700 dark:text-slate-300"
            >
              <TableOfContents size={20} />
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          id="admin-scroll-container"
        >
          <Outlet />
        </div>
      </main>
    </div>
    </div>
  );
};

export default AdminLayout;
