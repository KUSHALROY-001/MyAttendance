import React from "react";
import { FolderOpen } from "lucide-react";

export default function LibraryEmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center dark:border-[#222228] dark:bg-[#151518]">
      <FolderOpen className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" />
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">
        No resources found
      </h3>
      <p className="mt-1 text-slate-500 dark:text-slate-500">
        Try adjusting your filters or be the first to share!
      </p>
    </div>
  );
}
