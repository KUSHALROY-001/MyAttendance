import React from "react";
import { Outlet } from "react-router-dom";
import useAdminLayout from "../hooks/useAdminLayout";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    theme,
    toggleTheme,
    navigate,
    user,
    handleLogout,
  } = useAdminLayout();

  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0D0D0F] dark:text-slate-100">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          navigate={navigate}
          theme={theme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader
            theme={theme}
            toggleTheme={toggleTheme}
            onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          />

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
