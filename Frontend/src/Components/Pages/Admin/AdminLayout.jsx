import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
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
  Pencil,
  Home,
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
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0D0D0F] dark:text-slate-100">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white
            transition-transform duration-300 ease-in-out dark:border-[#222228] dark:bg-[#151518]
            lg:relative lg:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-[#222228] dark:bg-[#161619]">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-lg font-bold shadow-lg shadow-indigo-500/20">
                A
              </div>
              <span className="text-lg font-bold tracking-tight">AdminPanel</span>
            </div>
            <button
              className="text-slate-400 transition hover:text-slate-700 dark:hover:text-white lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X />
            </button>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-l-4 dark:border-indigo-500"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#1E1E26] dark:hover:text-slate-100"
                  }
                `}
              >
                <div className="shrink-0">{item.icon()}</div>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 border-t border-slate-200 p-4 dark:border-[#222228]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-[#222228] dark:bg-[#19191D]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
                <NavLink
                  to="/admin/profile/edit"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-[#222228] dark:bg-[#151518] dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-[#1E1E26] dark:hover:text-indigo-400"
                  aria-label="Edit profile"
                >
                  <Pencil size={15} />
                </NavLink>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate("/")}
                title="Home Page"
                aria-label="Home Page"
                className="flex flex-1 items-center justify-center h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-200 hover:!bg-indigo-50 hover:!text-indigo-600 hover:!border-indigo-200 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-400 dark:hover:!bg-[#1E1E26] dark:hover:!text-indigo-400 dark:hover:!border-indigo-500/40"
              >
                <Home size={19} />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
                className="flex flex-1 items-center justify-center h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-200 hover:!bg-slate-100 hover:!text-slate-900 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-400 dark:hover:!bg-[#1E1E26] dark:hover:!text-slate-100"
              >
                {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                title="Logout"
                aria-label="Logout"
                className="flex flex-1 items-center justify-center h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-200 hover:!bg-rose-500 hover:!text-white hover:!border-rose-500 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-400 dark:hover:!bg-rose-600 dark:hover:!text-white dark:hover:!border-rose-600"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-[#222228] dark:bg-[#161619] lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
                A
              </div>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-[#1C1C20]">
              <button
                onClick={toggleTheme}
                className="rounded-md p-1.5 text-slate-500 dark:text-slate-400"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-md p-1.5 text-slate-700 dark:text-slate-300"
              >
                <TableOfContents size={20} />
              </button>
            </div>
          </header>

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
