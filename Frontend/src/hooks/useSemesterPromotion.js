import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const useSemesterPromotion = () => {
  const [preview, setPreview] = useState([]);
  const [previewWarnings, setPreviewWarnings] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [department, setDepartment] = useState(""); // "" = all departments

  const [running, setRunning] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);

  const [activeBatch, setActiveBatch] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchPreview = useCallback(async () => {
    setLoadingPreview(true);
    try {
      const res = await api.get("/api/admin/promotions/preview", {
        params: department ? { department } : undefined,
      });
      setPreview(res.data?.departments || []);
      setPreviewWarnings(res.data?.warnings || []);
    } catch (error) {
      console.error("Failed to load promotion preview.", error);
    } finally {
      setLoadingPreview(false);
    }
  }, [department]);

  const fetchBatches = useCallback(async () => {
    setLoadingBatches(true);
    try {
      const res = await api.get("/api/admin/promotions");
      setBatches(res.data || []);
    } catch (error) {
      console.error("Failed to load promotion history.", error);
    } finally {
      setLoadingBatches(false);
    }
  }, []);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const totalEligible = preview.reduce(
    (sum, d) => sum + (d.eligibleCount || 0),
    0,
  );
  const totalSkipped = preview.reduce(
    (sum, d) => sum + (d.atFinalSemesterCount || 0),
    0,
  );

  const requestRunPromotion = () => {
    if (totalEligible === 0) {
      toast.error("No students are eligible for promotion right now.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const runPromotion = async () => {
    setRunning(true);
    try {
      const res = await api.post("/api/admin/promotions/run", {
        department: department || undefined,
      });
      setLastResult(res.data);
      const { promotedCount, skippedCount, failedCount } =
        res.data?.batch || {};
      if (failedCount > 0) {
        toast.error(
          `Promoted ${promotedCount}, but ${failedCount} student(s) failed — check the batch details.`,
        );
      } else {
        toast.success(
          `Promoted ${promotedCount} student(s). ${skippedCount} were already at their final semester.`,
        );
      }
      await Promise.all([fetchPreview(), fetchBatches()]);
    } catch (error) {
      console.error("Promotion run failed.", error);
    } finally {
      setRunning(false);
    }
  };

  const openBatchDetail = async (batchId) => {
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/api/admin/promotions/${batchId}`);
      setActiveBatch(res.data);
    } catch (error) {
      console.error("Failed to load batch detail.", error);
      toast.error("Couldn't load this promotion batch.");
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return {
    preview,
    previewWarnings,
    loadingPreview,
    department,
    setDepartment,
    totalEligible,
    totalSkipped,
    running,
    isConfirmOpen,
    setIsConfirmOpen,
    requestRunPromotion,
    runPromotion,
    lastResult,
    batches,
    loadingBatches,
    activeBatch,
    isDetailOpen,
    isDetailLoading,
    closeDetail: () => setIsDetailOpen(false),
    openBatchDetail,
  };
};

export default useSemesterPromotion;
