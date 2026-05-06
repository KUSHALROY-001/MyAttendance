import { X } from "lucide-react";

export default function LibraryModal({
  isModalOpen,
  setIsModalOpen,
  handleCreateSubmit,
  isSubmitting,
  departments,
  semesters,
  inputClass,
  labelClass,
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm md:p-4">
      <div className="flex h-full w-full max-w-lg flex-col rounded-none border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 md:h-auto md:max-h-[90vh] md:rounded-2xl max-h-[100dvh]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Share a Resource
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleCreateSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4 text-slate-900 dark:text-slate-50 md:p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className={labelClass}>Resource Title</label>
              <input
                name="title"
                required
                className={inputClass}
                placeholder="e.g., Unit 1-3 Handwritten Notes"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className={labelClass}>Subject Name</label>
              <input
                name="subjectName"
                required
                className={inputClass}
                placeholder="e.g., Operating Systems"
              />
            </div>

            <div className="col-span-2 space-y-1.5 md:col-span-1">
              <label className={labelClass}>Department</label>
              <select name="department" required className={inputClass}>
                <option value="">Select Dept</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5 md:col-span-1">
              <label className={labelClass}>Semester</label>
              <select name="semester" required className={inputClass}>
                <option value="">Select Sem</option>
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className={labelClass}>Google Drive Link</label>
              <input
                name="driveLink"
                type="url"
                required
                pattern=".*drive\\.google\\.com.*"
                title="Must be a valid Google Drive link"
                className={inputClass}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className={labelClass}>Description (Optional)</label>
              <textarea
                name="description"
                rows="3"
                className={inputClass}
                placeholder="Any extra context about these notes..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              ) : (
                "Share Resource"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
