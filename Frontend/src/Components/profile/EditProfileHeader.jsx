import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EditProfileHeader = ({ dashboardPath }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edit and update your account details.
        </p>
      </div>

      <Link
        to={dashboardPath}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#151518] dark:text-slate-300 dark:hover:bg-[#1E1E26]"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default EditProfileHeader;
