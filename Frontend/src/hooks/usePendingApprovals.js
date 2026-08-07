import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const usePendingApprovals = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/pending-students");
      setPendingStudents(res.data || []);
    } catch (error) {
      console.error("Failed to load pending signups.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId) => {
    setProcessingId(userId);
    try {
      const res = await api.post(`/api/admin/pending-students/${userId}/approve`);
      toast.success(res.data?.message || "Student approved.");
      setPendingStudents((prev) => prev.filter((s) => s.userId !== userId));
    } catch (error) {
      console.error("Failed to approve student.", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId) => {
    setProcessingId(userId);
    try {
      const res = await api.post(`/api/admin/pending-students/${userId}/reject`);
      toast.success(res.data?.message || "Signup rejected.");
      setPendingStudents((prev) => prev.filter((s) => s.userId !== userId));
    } catch (error) {
      console.error("Failed to reject student.", error);
    } finally {
      setProcessingId(null);
    }
  };

  return {
    pendingStudents,
    loading,
    processingId,
    handleApprove,
    handleReject,
  };
};

export default usePendingApprovals;
