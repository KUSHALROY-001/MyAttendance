import React from "react";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-300 bg-[#ffffff] dark:bg-[#000000] text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white appearance-none";

const selectClass =
  "w-full px-3 py-2 rounded-lg border border-slate-300 bg-[#ffffff] dark:bg-[#000000] text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer";

const Label = ({ children }) => (
  <label className="text-xs font-semibold text-white dark:text-slate-300/70 uppercase">
    {children}
  </label>
);

const AdminForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  fields = [],
}) => {
  const update = (fieldName) => (e) =>
    setFormData({ ...formData, [fieldName]: e.target.value });

  const renderField = (field) => {
    const {
      name,
      label,
      type = "text",
      required = true,
      placeholder,
      className: extraClass,
      options,
      min,
      max,
      colSpan = 12,
    } = field;

    const spanClass =
      {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
        4: "md:col-span-4",
        5: "md:col-span-5",
        6: "md:col-span-6",
        7: "md:col-span-7",
        8: "md:col-span-8",
        9: "md:col-span-9",
        10: "md:col-span-10",
        11: "md:col-span-11",
        12: "md:col-span-12",
      }[colSpan] || "md:col-span-12";

    return (
      <div key={name} className={`space-y-1 ${spanClass}`}>
        <Label>{label}</Label>

        {type === "select" ? (
          <select
            required={required}
            className={`${selectClass} ${extraClass || ""}`}
            value={formData[name] || ""}
            onChange={update(name)}
          >
            <option
              value=""
              className="text-slate-900 bg-[#ffffff] dark:bg-[#000000] dark:text-[#ffffff]"
            >
              -- Select --
            </option>
            {(options || []).map((opt, idx) => {
              const isObj = typeof opt === "object" && opt !== null;
              const optValue = isObj ? (opt.value ?? opt.name ?? opt) : opt;
              const optLabel = isObj
                ? (opt.label ?? opt.name ?? opt.value ?? opt)
                : opt;
              return (
                <option
                  key={`${name}-${idx}-${optValue}`}
                  value={optValue}
                  className="text-slate-900 bg-[#ffffff] dark:bg-[#000000] dark:text-[#ffffff]"
                >
                  {optLabel}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            required={required}
            type={type}
            className={`${inputClass} ${extraClass || ""}`}
            value={formData[name] || ""}
            onChange={update(name)}
            placeholder={placeholder}
            {...(min !== undefined && { min })}
            {...(max !== undefined && { max })}
          />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {fields.map((fieldOrRow, idx) => {
          if (Array.isArray(fieldOrRow)) {
            const defaultSpan = Math.max(1, Math.floor(12 / fieldOrRow.length));
            return fieldOrRow.map((field) =>
              renderField({ colSpan: defaultSpan, ...field }),
            );
          }
          return renderField(fieldOrRow);
        })}
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;
