import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <p>&copy; {new Date().getFullYear()} MyAttendance. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/about" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            About
          </Link>
          <Link to="/features" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Features
          </Link>
          <Link to="/login" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
