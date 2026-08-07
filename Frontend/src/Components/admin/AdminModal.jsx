import React, { useEffect } from "react";
import { X } from "lucide-react";

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  hideHeader = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 outline-none focus:outline-none">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-3xl bg-transperant border border-slate-200 dark:border-[#1E2638] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E2638] sticky top-0 bg-white/80 dark:bg-[#101010]/90 backdrop-blur-md rounded-t-3xl z-10">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1C1C20] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div
          className={
            hideHeader ? "overflow-y-auto" : "p-2 md:p-6 overflow-y-auto"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
