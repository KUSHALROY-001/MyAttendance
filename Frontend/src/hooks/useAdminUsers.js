import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";

export const useAdminUsers = () => {
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

  const handleRoleChange = async (id, newRole) => {
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
    filteredData,
    handleRoleChange,
    handleDelete,
  };
};

export default useAdminUsers;
