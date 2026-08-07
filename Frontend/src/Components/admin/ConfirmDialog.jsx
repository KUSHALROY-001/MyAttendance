import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  confirmVariant = "danger",
}) => {
  if (!isOpen) return null;

  const btnColorClass =
    confirmVariant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : confirmVariant === "warning"
      ? "bg-amber-600 hover:bg-amber-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white";

  const iconBgClass =
    confirmVariant === "primary"
      ? "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
      : confirmVariant === "warning"
      ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 text-center animate-in fade-in zoom-in duration-200">
        <div className={`mx-auto w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center mb-4`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition ${btnColorClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
