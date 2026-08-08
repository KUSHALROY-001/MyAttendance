import React from "react";
import { PlusCircle, XCircle, X } from "lucide-react";
import AdminModal from "../AdminModal";
import SectionInputAdder from "./SectionInputAdder";
import { INPUT_CLASS, LABEL_CLASS } from "../../../utils/academicOptionsHelpers";

const DepartmentModal = ({
  isOpen,
  onClose,
  currentRecord,
  formData,
  setFormData,
  saving,
  onSave,
  onAddSemester,
  onRequestRemoveSemester,
  onAddSection,
  onRemoveSection,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={currentRecord ? "Edit Department Option" : "Add New Department Option"}
    >
      <form onSubmit={onSave} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="deptName" className={LABEL_CLASS}>
            Department Name
          </label>
          <input
            id="deptName"
            type="text"
            required
            placeholder="e.g. Bachelor of Computer Applications"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="deptCode" className={LABEL_CLASS}>
            Department Code
          </label>
          <input
            id="deptCode"
            type="text"
            required
            placeholder="e.g. BCA"
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                code: e.target.value.toUpperCase(),
              }))
            }
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className={LABEL_CLASS}>Configure Semesters & Sections</label>
            <button
              type="button"
              onClick={onAddSemester}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
            >
              <PlusCircle size={14} /> Add Semester
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {formData.semesterDetails.map((semDetail, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Semester {semDetail.semester}
                  </span>
                  {formData.semesterDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRequestRemoveSemester(index, semDetail.semester)}
                      className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition"
                      title="Remove Semester"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Sections
                  </label>

                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-300 bg-white p-2.5 dark:border-slate-600 dark:bg-slate-900/70 min-h-[52px]">
                    {(semDetail.sections || []).map((sec, secIdx) => {
                      const sectionName =
                        typeof sec === "object" && sec !== null
                          ? sec.name || ""
                          : String(sec || "");
                      return (
                        <div
                          key={secIdx}
                          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-white px-3 py-1 text-sm font-bold text-slate-900 shadow-sm dark:border-slate-200 dark:bg-slate-800 dark:text-slate-100 transition-all hover:scale-105"
                        >
                          <span>{sectionName}</span>
                          <button
                            type="button"
                            onClick={() => onRemoveSection(index, secIdx)}
                            className="rounded-full p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title={`Remove Section ${sectionName}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}

                    <SectionInputAdder
                      onAdd={(customName) => onAddSection(index, customName)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : currentRecord ? "Update Option" : "Save Option"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default DepartmentModal;
