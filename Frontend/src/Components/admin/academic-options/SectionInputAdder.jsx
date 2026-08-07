import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const SectionInputAdder = ({ onAdd }) => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleOpen = () => {
    setIsInputOpen(true);
    setInputValue("");
  };

  const handleAdd = () => {
    onAdd(inputValue.trim());
    setInputValue("");
    setIsInputOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      setIsInputOpen(false);
      setInputValue("");
    }
  };

  if (isInputOpen) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-lg border-2 border-indigo-600 bg-indigo-50/60 p-1 dark:border-indigo-400 dark:bg-indigo-950/40">
        <input
          type="text"
          autoFocus
          placeholder="e.g. C"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          className="w-20 bg-transparent px-1 text-xs font-bold uppercase text-slate-900 focus:outline-none dark:text-white"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-700 transition"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsInputOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="inline-flex items-center gap-1 rounded-lg border-2 border-slate-900 bg-white px-3.5 py-1 text-sm font-bold text-slate-900 shadow-sm hover:border-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition-all cursor-pointer"
      title="Add new section"
    >
      <Plus size={15} />
      <span>Add</span>
    </button>
  );
};

export default SectionInputAdder;
