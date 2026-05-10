import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
    { to: "/student", label: "Get Started" },
    { to: "/library", label: "Library" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-950/80">
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
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800 dark:hover:text-indigo-400 md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="inline-flex items-center rounded-full border border-indigo-600 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500/10 sm:text-sm"
            >
              Login
            </Link>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="animate-in fade-in slide-in-from-top-2 mt-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/signup"
                onClick={closeMobileMenu}
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

export default Navbar;
