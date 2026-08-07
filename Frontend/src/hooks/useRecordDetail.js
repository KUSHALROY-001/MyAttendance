import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const useRecordDetail = (endpointForRow) => {
  const [detail, setDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const openDetail = async (row) => {
    if (!row?.id) return;
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const res = await api.get(endpointForRow(row));
      setDetail(res.data);
    } catch (error) {
      console.error("Failed to load record detail.", error);
      toast.error("Couldn't load record details.");
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetail = () => setIsDetailOpen(false);

  return {
    detail,
    isDetailOpen,
    isDetailLoading,
    openDetail,
    closeDetail,
    setIsDetailOpen,
  };
};

export default useRecordDetail;
