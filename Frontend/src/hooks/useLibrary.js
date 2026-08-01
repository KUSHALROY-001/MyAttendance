import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  formatDriveLink,
  resolveContributorId,
  buildLibraryQueryParams,
} from "../utils/libraryHelpers";

export const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-50 dark:placeholder:text-slate-500";

export const labelClass =
  "block text-xs font-medium text-slate-700 dark:text-slate-200";

export const useLibrary = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    department: "BCA",
    semester: "1",
    subjectName: "",
  });

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const queryStr = buildLibraryQueryParams(filters);
      const response = await api.get(`/api/library${queryStr}`);
      setResources(response.data.resources || []);
      setDepartments(response.data.filters?.departments || []);
      setSemesters(response.data.filters?.semesters || []);
      setSubjects(response.data.filters?.subjects || []);
    } catch (error) {
      console.error("Error fetching library", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [filters.department, filters.semester, filters.subjectName]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      if (name === "department") {
        return {
          ...prev,
          department: value,
          semester: "",
          subjectName: "",
        };
      }

      if (name === "semester") {
        return {
          ...prev,
          semester: value,
          subjectName: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const clearFilters = () => {
    setFilters({ department: "", semester: "", subjectName: "" });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    data.driveLink = formatDriveLink(data.driveLink);
    const contributorId = resolveContributorId(user);

    try {
      setIsSubmitting(true);
      await api.post("/api/library", {
        ...data,
        contributorId,
      });
      toast.success("Resource shared successfully!");
      setIsModalOpen(false);
      fetchLibrary();
    } catch (error) {
      console.error("Error creating resource", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRequestLogin = () => {
    navigate("/login");
  };

  return {
    isAuthenticated,
    user,
    resources,
    departments,
    semesters,
    subjects,
    loading,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    filters,
    handleFilterChange,
    clearFilters,
    handleCreateSubmit,
    onRequestLogin,
  };
};

export default useLibrary;
