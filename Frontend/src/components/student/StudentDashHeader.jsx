import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

const StudentDashHeader = ({ safeUserName, enrollmentNo, department, semester }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {safeUserName}
        </h1>
        <Link
          to="/profile/edit"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-[#222228] dark:bg-[#151518] dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-[#1C1C20] dark:hover:text-indigo-400"
          aria-label="Edit profile"
        >
          <Pencil size={16} />
        </Link>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
        Enrollment: {enrollmentNo} • {department} • {semester}
      </p>
    </div>
  );
};

export default StudentDashHeader;
