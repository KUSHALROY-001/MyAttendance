import { BookOpen, Plus } from "lucide-react";

export default function LibraryHeader({ setIsModalOpen }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-700 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-900/40">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="text-indigo-400" /> Community Library
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Browse and share study materials, notes, and resources.
        </p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-indigo-900/40"
      >
        <Plus size={16} /> Share Notes
      </button>
    </div>
  );
}
