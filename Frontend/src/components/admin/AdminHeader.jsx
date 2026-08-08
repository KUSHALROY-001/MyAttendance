import React from "react";
import { Sun, Moon, TableOfContents } from "lucide-react";

const AdminHeader = ({ theme, toggleTheme, onMobileMenuOpen }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-[#222228] dark:bg-[#161619] lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
          A
        </div>
      </div>
      <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-[#1C1C20]">
        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-slate-500 dark:text-slate-400"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={onMobileMenuOpen}
          className="rounded-md p-1.5 text-slate-700 dark:text-slate-300"
        >
          <TableOfContents size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
