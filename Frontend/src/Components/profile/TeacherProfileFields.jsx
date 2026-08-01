import React from "react";

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#19191D] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#151518] transition-colors";

const labelClass =
  "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const TeacherProfileFields = ({ formData, updateField }) => {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="employeeId" className={labelClass}>
          Employee ID
          <Required />
        </label>
        <input
          id="employeeId"
          value={formData.employeeId}
          onChange={updateField("employeeId")}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="teacherDepartment" className={labelClass}>
          Department
          <Required />
        </label>
        <input
          id="teacherDepartment"
          value={formData.department}
          onChange={updateField("department")}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="designation" className={labelClass}>
          Designation
          <Required />
        </label>
        <input
          id="designation"
          value={formData.designation}
          onChange={updateField("designation")}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="teacherContactNumber" className={labelClass}>
          Contact Number
          <Required />
        </label>
        <input
          id="teacherContactNumber"
          value={formData.contactNumber}
          onChange={updateField("contactNumber")}
          required
          className={inputClass}
        />
      </div>
    </>
  );
};

export default TeacherProfileFields;
