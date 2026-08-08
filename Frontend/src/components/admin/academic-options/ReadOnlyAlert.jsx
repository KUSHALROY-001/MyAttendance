import React from "react";
import { Lock } from "lucide-react";

const ReadOnlyAlert = () => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
        <Lock size={18} />
      </div>
      <div>
        <p className="text-sm font-bold">Read-Only Mode</p>
        <p className="text-xs text-amber-700 dark:text-amber-400">
          You are viewing as a standard Admin. Only Super Admins are authorized to create, update, or delete academic options.
        </p>
      </div>
    </div>
  );
};

export default ReadOnlyAlert;
