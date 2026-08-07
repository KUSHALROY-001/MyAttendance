import { useState, useEffect } from "react";
import api from "../api/axios";

export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    student: 0,
    teacher: 0,
    department: 0,
    recentSessions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/admin/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
  };
};

export default useAdminDashboard;
