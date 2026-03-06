function Footer() {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <p>© {new Date().getFullYear()} MyAttendance. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#about" className="hover:text-indigo-600">
            About
          </a>
          <a href="#features" className="hover:text-indigo-600">
            Features
          </a>
          <a href="#cta" className="hover:text-indigo-600">
            Get started
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

