import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
            AP
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              MyAttendance
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart attendance tracking
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300 md:flex">
          <Link to="/" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <Link to="/" href="#features" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Features
          </Link>
          <Link to="/" href="#about" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            About
          </Link>
          <Link to="/student" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Get Started
          </Link>
          <Link to="/library" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Library
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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
            className="inline-flex items-center rounded-full border border-indigo-600 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500/10 sm:text-sm"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
