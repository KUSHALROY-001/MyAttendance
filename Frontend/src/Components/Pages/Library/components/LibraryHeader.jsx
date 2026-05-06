import { BookOpen, Plus } from "lucide-react";

export default function LibraryHeader({ setIsModalOpen }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-slate-900/40 md:flex-row md:items-center">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <BookOpen className="text-indigo-400" /> Community Library
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse and share study materials, notes, and resources.
        </p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400"
      >
        <Plus size={16} /> Share Notes
      </button>
    </div>
  );
}
