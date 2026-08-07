import React from "react";

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#19191D] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#151518] transition-colors";

const labelClass =
  "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const StudentProfileFields = ({
  formData,
  updateField,
  academicOptions,
  handleDeptChange,
  availableSemesters,
  handleSemChange,
  availableSections,
}) => {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="rollNumber" className={labelClass}>
          Roll Number
          <Required />
        </label>
        <input
          id="rollNumber"
          value={formData.rollNumber}
          onChange={updateField("rollNumber")}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="enrollmentNumber" className={labelClass}>
          Enrollment Number
          <Required />
        </label>
        <input
          id="enrollmentNumber"
          value={formData.enrollmentNumber}
          onChange={updateField("enrollmentNumber")}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="department" className={labelClass}>
          Department
          <Required />
        </label>
        {academicOptions.length > 0 ? (
          <select
            id="department"
            value={formData.department}
            onChange={handleDeptChange}
            required
            className={inputClass}
          >
            {academicOptions.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.code} {dept.name ? `- ${dept.name}` : ""}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="department"
            value={formData.department}
            onChange={updateField("department")}
            required
            className={inputClass}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="semester" className={labelClass}>
          Semester
          <Required />
        </label>
        {availableSemesters.length > 0 ? (
          <select
            id="semester"
            value={formData.semester}
            onChange={handleSemChange}
            required
            className={inputClass}
          >
            {availableSemesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="semester"
            type="number"
            min="1"
            value={formData.semester}
            onChange={updateField("semester")}
            required
            className={inputClass}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="section" className={labelClass}>
          Section
          <Required />
        </label>
        {availableSections.length > 0 ? (
          <select
            id="section"
            value={formData.section}
            onChange={updateField("section")}
            required
            className={inputClass}
          >
            {availableSections.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="section"
            value={formData.section}
            onChange={updateField("section")}
            required
            className={inputClass}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="batch" className={labelClass}>
          Batch
          <Required />
        </label>
        <input
          id="batch"
          value={formData.batch}
          onChange={updateField("batch")}
          required
          className={inputClass}
        />
      </div>

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
