import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
            AP
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              MyAttendance
            </p>
            <p className="text-xs text-slate-500">Smart attendance tracking</p>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <Link to="/" href="#features" className="hover:text-indigo-600">
            Features
          </Link>
          <Link to="/" href="#about" className="hover:text-indigo-600">
            About
          </Link>
          <Link to="/student" className="hover:text-indigo-600">
            Get Started
          </Link>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center rounded-full border border-indigo-600 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 sm:text-sm"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
