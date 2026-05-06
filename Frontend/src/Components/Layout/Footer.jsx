function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <p>&copy; {new Date().getFullYear()} MyAttendance. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#about" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            About
          </a>
          <a href="#features" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Features
          </a>
          <a href="#cta" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Get started
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
