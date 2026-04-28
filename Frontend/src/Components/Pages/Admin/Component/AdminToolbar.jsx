import React, { useState, useRef } from "react";
import { Search } from "lucide-react";

const AdminToolbar = ({ searchProps, filters = [] }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const inputRef = useRef(null);

  const expandSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBlur = () => {
    if (!searchProps.value) {
      setIsSearchExpanded(false);
    }
  };

  return (
    <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-full shadow-sm w-full overflow-x-auto hide-scrollbar">
      <div className="flex items-center min-w-max px-2">
        {/* Search Section */}
        <div
          className={`flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded || searchProps.value ? "bg-slate-50 dark:bg-slate-800 rounded-full px-3 py-1.5" : "p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full cursor-pointer"}`}
          onClick={!isSearchExpanded ? expandSearch : undefined}
        >
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={searchProps.placeholder || "Search..."}
            value={searchProps.value}
            onChange={(e) => searchProps.onChange(e.target.value)}
            onBlur={handleBlur}
            className={`bg-transparent outline-none text-sm text-slate-900 dark:text-white transition-all duration-300 ease-in-out placeholder-slate-400 ${isSearchExpanded || searchProps.value ? "w-32 lg:w-48 ml-2 opacity-100" : "w-0 opacity-0 pointer-events-none m-0"}`}
          />
        </div>

        {/* Dividers & Filters */}
        {filters.map((filter) => (
          <React.Fragment key={filter.label}>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-2 md:mx-3 shrink-0" />
            <div className="relative flex items-center">
              {filter.field && (
                <span className="text-base font-semibold text-slate-400 dark:text-slate-500 mr-1 select-none">
                  {filter.field}:
                </span>
              )}
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="appearance-none bg-transparent outline-none text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer pr-6 pl-1 py-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <option value="" className="text-slate-500">
                  {filter.label}
                </option>
                {filter.options.map((opt) => {
                  const isPrimitive =
                    typeof opt === "string" || typeof opt === "number";
                  return (
                    <option
                      className="text-slate-900 dark:text-slate-900"
                      key={isPrimitive ? opt : opt.value}
                      value={isPrimitive ? opt : opt.value}
                    >
                      {isPrimitive ? opt : opt.label}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-1 pointer-events-none text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AdminToolbar;
