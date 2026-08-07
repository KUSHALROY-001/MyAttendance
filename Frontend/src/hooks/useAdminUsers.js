import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import useRecordDetail from "./useRecordDetail";

export const useAdminUsers = () => {
  const detailState = useRecordDetail(
    (row) => `/api/admin/users/${row.id}/detail`,
  );
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users");
      setData(res.data);
    } catch (error) {
      console.error("Failed to load users.", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = useMemo(
    () =>
      data.filter((user) => {
        const normalizedSearch = search.toLowerCase();
        const matchesSearch =
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch) ||
          (user.profileCode || "").toLowerCase().includes(normalizedSearch);
        const matchesRole = filterRole ? user.role === filterRole : true;

        return matchesSearch && matchesRole;
      }),
    [data, search, filterRole],
  );

  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [userToPromote, setUserToPromote] = useState(null);

  const executeRoleChange = async (id, newRole) => {
    const previousData = data;

    setUpdatingUserId(id);
    setData((current) =>
      current.map((user) =>
        user.id === id ? { ...user, role: newRole.toUpperCase() } : user,
      ),
    );

    try {
      const res = await api.put(`/api/admin/users/${id}/role`, {
        role: newRole,
      });
      setData((current) =>
        current.map((user) => (user.id === id ? res.data : user)),
      );
    } catch (error) {
      console.error("Failed to update user role.", error);
      setData(previousData);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const requestRoleChange = (user, newRole) => {
    if (newRole === "SUPER_ADMIN" && user.role !== "SUPER_ADMIN") {
      setUserToPromote({ id: user.id, name: user.name, email: user.email, newRole });
      setIsPromoteDialogOpen(true);
      return;
    }
    executeRoleChange(user.id, newRole);
  };

  const confirmPromotion = async () => {
    if (userToPromote) {
      await executeRoleChange(userToPromote.id, userToPromote.newRole);
      setUserToPromote(null);
      setIsPromoteDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;

    try {
      await api.delete(`/api/admin/users/${recordToDelete.id}`);
      setData((current) =>
        current.filter((user) => user.id !== recordToDelete.id),
      );
      setRecordToDelete(null);
    } catch (error) {
      console.error("Failed to delete user.", error);
    }
  };

  return {
    data,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    loading,
    updatingUserId,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    recordToDelete,
    setRecordToDelete,
    isPromoteDialogOpen,
    setIsPromoteDialogOpen,
    userToPromote,
    setUserToPromote,
    filteredData,
    handleRoleChange: requestRoleChange,
    confirmPromotion,
    handleDelete,
    ...detailState,
  };
};

export default useAdminUsers;
