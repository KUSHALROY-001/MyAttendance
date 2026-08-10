import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

// Drives the 3-state bulk student import flow (upload -> preview -> result).
// Kept separate from useAdminStudents since this is a self-contained modal
// flow with its own lifecycle — the only thing it needs from the students
// page is a way to ask for a re-fetch once an import actually writes data.
export const useStudentImport = ({ onImported } = {}) => {
  const [step, setStep] = useState("upload"); // "upload" | "preview" | "result"
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [previewData, setPreviewData] = useState(null); // { previewToken, totalRows, validCount, results }
  const [resultData, setResultData] = useState(null); // { imported, failed, outcomes }

  const downloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const res = await api.get("/api/admin/students/import/template", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "student-import-template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (_err) {
      // Global axios interceptor already surfaces a toast for the failure.
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error("Please choose a file first.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Deliberately NOT setting a Content-Type header here — axios needs
      // to compute the multipart boundary itself from the FormData object
      // and append it to the header (e.g. "multipart/form-data;
      // boundary=..."). Setting Content-Type manually overrides that and
      // omits the boundary, which means the server (multer) can't parse
      // the request body at all. Let axios auto-detect FormData and set
      // the correct header itself.
      const res = await api.post(
        "/api/admin/students/import/preview",
        formData,
      );
      setPreviewData(res.data);
      setStep("preview");
    } catch (_err) {
      // Global axios interceptor already surfaces a toast for the failure —
      // stay on the upload step so the admin can pick a different file.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData?.previewToken) return;
    setIsSubmitting(true);
    try {
      const res = await api.post("/api/admin/students/import/confirm", {
        previewToken: previewData.previewToken,
      });
      setResultData(res.data);
      setStep("result");
      onImported?.();
    } catch (_err) {
      // Global axios interceptor already surfaces a toast (e.g. expired
      // preview token) — the admin can re-upload from here.
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToUpload = () => {
    setFile(null);
    setPreviewData(null);
    setStep("upload");
  };

  const resetAll = () => {
    setFile(null);
    setPreviewData(null);
    setResultData(null);
    setStep("upload");
  };

  return {
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
  };
};

export default useStudentImport;
