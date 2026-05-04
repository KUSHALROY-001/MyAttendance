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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-none md:rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-full md:h-auto max-h-[100dvh] md:max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 shrink-0">
          <h2 className="text-xl font-semibold text-slate-50">
            Share a Resource
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleCreateSubmit}
          className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1 text-slate-50"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className={labelClass}>Resource Title</label>
              <input
                name="title"
                required
                className={inputClass}
                placeholder="e.g., Unit 1-3 Handwritten Notes"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className={labelClass}>Subject Name</label>
              <input
                name="subjectName"
                required
                className={inputClass}
                placeholder="e.g., Operating Systems"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
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

            <div className="space-y-1.5 col-span-2 md:col-span-1">
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

            <div className="space-y-1.5 col-span-2">
              <label className={labelClass}>Google Drive Link</label>
              <input
                name="driveLink"
                type="url"
                required
                pattern=".*drive\.google\.com.*"
                title="Must be a valid Google Drive link"
                className={inputClass}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className={labelClass}>Description (Optional)</label>
              <textarea
                name="description"
                rows="3"
                className={inputClass}
                placeholder="Any extra context about these notes..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-indigo-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full"></span>
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
