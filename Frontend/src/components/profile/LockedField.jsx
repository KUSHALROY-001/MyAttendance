import { Lock } from "lucide-react";

const labelClass =
  "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

const lockedInputClass =
  "block w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 pr-10 text-sm text-slate-500 dark:border-slate-800 dark:bg-[#151518] dark:text-slate-400";

// A read-only profile field. Shown for details a student can see but not
// change (email, roll number, department, ...).
const LockedField = ({ id, label, value }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        value={value ?? ""}
        disabled
        readOnly
        aria-readonly="true"
        title="Managed by your institute admin"
        className={lockedInputClass}
      />
      <Lock
        size={14}
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />
    </div>
  </div>
);

export default LockedField;
