import React from "react";
import FolderStructureDiagram from "./FolderStructureDiagram";

export default function FolderStructureGuide() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500 dark:hover:border-indigo-500 dark:border-[#222228] dark:bg-[#151518] dark:hover:bg-[#1C1C22]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-400">
          How to organise your Drive
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Recommended folder structure for sharing resources
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Create this structure in your Google Drive, then share the Subject
          folder link (or Unit sub-folder link) when contributing to the
          library.
        </p>
      </div>
      <FolderStructureDiagram />
    </div>
  );
}
