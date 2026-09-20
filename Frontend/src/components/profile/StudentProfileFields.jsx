import React from "react";
import LockedField from "./LockedField";

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#19191D] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#151518] transition-colors";

const labelClass =
  "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

// Students can only edit their contact number here. Every other academic
// detail is read-only and managed by the institute admin (the backend
// enforces this too).
const StudentProfileFields = ({ formData, updateField }) => {
  return (
    <>
      <LockedField
        id="rollNumber"
        label="Roll Number"
        value={formData.rollNumber}
      />

      <LockedField
        id="enrollmentNumber"
        label="Enrollment Number"
        value={formData.enrollmentNumber}
      />

      <LockedField
        id="department"
        label="Department"
        value={formData.department}
      />

      <LockedField
        id="semester"
        label="Semester"
        value={formData.semester ? `Semester ${formData.semester}` : ""}
      />

      <LockedField
        id="section"
        label="Section"
        value={formData.section ? `Section ${formData.section}` : ""}
      />

      <LockedField id="batch" label="Batch" value={formData.batch} />

      <div className="space-y-1.5">
        <label htmlFor="contactNumber" className={labelClass}>
          Contact Number
          <Required />
        </label>
        <input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={updateField("contactNumber")}
          required
          className={inputClass}
        />
      </div>
    </>
  );
};

export default StudentProfileFields;
