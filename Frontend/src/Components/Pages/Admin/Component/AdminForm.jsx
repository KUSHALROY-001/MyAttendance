import React from "react";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white";

const Label = ({ children }) => (
  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
    {children}
  </label>
);

/**
 * A flexible, config-driven form component for all admin pages.
 *
 * @param {Object}   formData    - The current form state object.
 * @param {Function} setFormData - State setter for formData.
 * @param {Function} onSubmit    - Called when the form is submitted.
 * @param {Function} onCancel    - Called when the Cancel button is clicked.
 * @param {string}   submitLabel - Label for the submit button (e.g. "Save Student").
 * @param {Array}    fields      - Array of field config objects OR arrays (for grid rows).
 *
 * Field config shape:
 * {
 *   name:        string,          // key in formData, e.g. "rollNumber"
 *   label:       string,          // display label, e.g. "Roll Number"
 *   type:        string,          // "text" | "email" | "number" | "select" (default: "text")
 *   required:    boolean,         // default: true
 *   placeholder: string,          // optional placeholder text
 *   className:   string,          // optional extra class (e.g. "font-mono")
 *   options:     Array,           // required if type === "select" — [{value, label}] or strings
 *   min:         number,          // optional, for type "number"
 *   max:         number,          // optional, for type "number"
 * }
 *
 * To place multiple fields in a single row, wrap them in a sub-array:
 *   fields={[
 *     [{ name: "name", label: "Full Name" }, { name: "rollNumber", label: "Roll Number" }],
 *     { name: "email", label: "Email", type: "email" },
 *     [{ name: "dept", label: "Dept" }, { name: "sem", label: "Semester", type: "number" }, { name: "sec", label: "Section" }],
 *   ]}
 */
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
            className={`${inputClass} ${extraClass || ""}`}
            value={formData[name] || ""}
            onChange={update(name)}
          >
            <option value="">-- Select --</option>
            {(options || []).map((opt) => {
              const isObj = typeof opt === "object";
              return (
                <option
                  key={isObj ? opt.value : opt}
                  value={isObj ? opt.value : opt}
                >
                  {isObj ? opt.label : opt}
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
          // Backward compatibility: if it's an array (row), give them equal cols out of 12
          if (Array.isArray(fieldOrRow)) {
            const defaultSpan = Math.max(1, Math.floor(12 / fieldOrRow.length));
            return fieldOrRow.map((field) =>
              renderField({ colSpan: defaultSpan, ...field }),
            );
          }
          // Flat structure
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
