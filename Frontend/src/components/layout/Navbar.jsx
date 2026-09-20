import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmDialog from "../admin/ConfirmDialog";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, getDefaultRouteForRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
    {
      to: isAuthenticated ? getDefaultRouteForRole(user?.role) : "/login",
      label: isAuthenticated ? "Dashboard" : "Get Started",
    },
    { to: "/library", label: "Library" },
  ];

  // Highlight the link for the page the user is currently on. `end` keeps
  // "Home" from matching every route; the other links also stay highlighted
  // on their sub-pages (e.g. Dashboard while taking attendance).
  const desktopLinkClass = ({ isActive }) =>
    `relative py-1 transition ${
      isActive
        ? "text-indigo-600 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-indigo-600 dark:text-indigo-400 dark:after:bg-indigo-400"
        : "hover:text-indigo-600 dark:hover:text-indigo-400"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-[#1C1C20] dark:hover:text-indigo-400"
    }`;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };
  const requestLogout = () => setIsLogoutConfirmOpen(true);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-colors dark:border-[#222228] dark:bg-[#161619]/80">
      <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
              AP
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                MyAttendance
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart attendance tracking
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={desktopLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-[#222228] dark:bg-[#151518] dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-[#1C1C20] dark:hover:text-indigo-400 md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-[#222228] dark:bg-[#151518] dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-[#1C1C20] dark:hover:text-indigo-400"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={requestLogout}
                className="inline-flex items-center rounded-md border border-red-500 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="inline-flex items-center rounded-full border border-indigo-600 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500/10 sm:text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="animate-in fade-in slide-in-from-top-2 mt-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-[#222228] dark:bg-[#151518]/95 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={requestLogout}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Request Access
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </nav>

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </header>
  );
}

export default Navbar;
