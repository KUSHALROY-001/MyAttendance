import React, { useRef } from "react";
import {
  Download,
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import AdminModal from "./AdminModal";
import useStudentImport from "../../hooks/useStudentImport";

const ACCEPTED_TYPES = ".xlsx,.csv";

const StudentImportModal = ({ isOpen, onClose, onImported }) => {
  const fileInputRef = useRef(null);
  const {
    step,
    file,
    setFile,
    isSubmitting,
    isDownloadingTemplate,
    previewData,
    resultData,
    downloadTemplate,
    handlePreview,
    handleConfirm,
    backToUpload,
    resetAll,
  } = useStudentImport({ onImported });

  const handleClose = () => {
    if (isSubmitting) return;
    resetAll();
    onClose();
  };

  const titleByStep = {
    upload: "Bulk Import Students",
    preview: "Review Import",
    result: "Import Complete",
  };

  return (
    <AdminModal isOpen={isOpen} onClose={handleClose} title={titleByStep[step]}>
      {step === "upload" && (
        <div className="space-y-5">
          <p className="text-sm text-white">
            Upload a spreadsheet of students already on your institute's
            records. Accounts are created immediately — no approval queue —
            since this upload is itself the verification.
          </p>

          <button
            type="button"
            onClick={downloadTemplate}
            disabled={isDownloadingTemplate}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
          >
            {isDownloadingTemplate ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Template
          </button>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-400 dark:border-slate-700 bg-slate-50 px-6 py-10 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileSpreadsheet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-black dark:text-white" />
                <p className="text-sm font-semibold dark:text-white">
                  Click to choose a file
                </p>
                <p className="text-xs dark:text-slate-400">
                  .xlsx or .csv — up to 500 students per import
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePreview}
              disabled={!file || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Preview Import
            </button>
          </div>
        </div>
      )}

      {step === "preview" && previewData && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-200">
            {previewData.validCount} of {previewData.totalRows} rows are ready
            to import.
          </p>

          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-black dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Row</th>
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-4 py-2.5 font-semibold">Email</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewData.results.map((r) => (
                  <tr
                    key={r.rowNumber}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-slate-200">
                      {r.rowNumber}
                    </td>
                    <td className="px-4 py-2.5 text-white">
                      {r.row?.name || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-200">
                      {r.row?.email || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {r.isValid ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ready
                        </span>
                      ) : (
                        <span
                          title={r.errors.join(", ")}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/60 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:text-red-400"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {r.errors.join(", ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={backToUpload}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Upload a different file
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={previewData.validCount === 0 || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Import {previewData.validCount} Student
              {previewData.validCount === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}

      {step === "result" && resultData && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 px-4 py-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {resultData.imported} imported successfully
              {resultData.failed > 0 && `, ${resultData.failed} failed`}.
            </p>
          </div>

          {resultData.failed > 0 && (
            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Row</th>
                    <th className="px-4 py-2.5 font-semibold">Name</th>
                    <th className="px-4 py-2.5 font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.outcomes
                    .filter((o) => !o.success)
                    .map((o) => (
                      <tr
                        key={o.rowNumber}
                        className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">
                          {o.rowNumber}
                        </td>
                        <td className="px-4 py-2.5 text-slate-900 dark:text-slate-200">
                          {o.name || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-red-600 dark:text-red-400">
                          {o.error}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </AdminModal>
  );
};

export default StudentImportModal;
