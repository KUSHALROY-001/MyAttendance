import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  INITIAL_ACADEMIC_FORM,
  generateNextSectionLetter,
  reindexSemesters,
  validateDepartmentForm,
  sanitizeDepartmentPayload,
  normalizeSectionName,
} from "../utils/academicOptionsHelpers";

export const useAdminAcademicOptions = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [isDeleteSemesterDialogOpen, setIsDeleteSemesterDialogOpen] =
    useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);

  const [formData, setFormData] = useState(INITIAL_ACADEMIC_FORM);
  const [departmentDetails, setDepartmentDetails] = useState({});
  const [detail, setDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeSemesterAudit, setActiveSemesterAudit] = useState(null);

  const fetchDepartmentDetail = useCallback(
    async (departmentId, { force = false } = {}) => {
      if (!departmentId) return null;
      if (!force && departmentDetails[departmentId]) {
        return departmentDetails[departmentId];
      }

      const res = await api.get(`/api/admin/academic-options/${departmentId}/detail`);
      setDepartmentDetails((current) => ({
        ...current,
        [departmentId]: res.data,
      }));
      return res.data;
    },
    [departmentDetails],
  );

  const openDepartmentDetail = async (department) => {
    if (!department?.id) return;
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const loadedDetail = await fetchDepartmentDetail(department.id);
      setDetail(loadedDetail);
    } catch (error) {
      console.error("Failed to load department detail.", error);
      toast.error("Couldn't load department details.");
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openSemesterAudit = async (department, semester) => {
    if (!department?.id) return;
    try {
      await fetchDepartmentDetail(department.id);
      setActiveSemesterAudit({
        departmentId: department.id,
        semester: Number(semester),
      });
    } catch (error) {
      console.error("Failed to load semester audit.", error);
      toast.error("Couldn't load semester audit.");
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/academic-options");
      setDepartments(res.data || []);
    } catch (error) {
      console.error("Failed to load academic options.", error);
      toast.error("Failed to load academic options.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (record = null) => {
    if (record) {
      setCurrentRecord(record);
      setFormData({
        name: record.name || "",
        code: record.code || "",
        semesterDetails: Array.isArray(record.semesterDetails)
          ? record.semesterDetails.map((s) => ({
              semester: s.semester,
              sections: Array.isArray(s.sections)
                ? s.sections.map(normalizeSectionName).filter(Boolean)
                : [],
            }))
          : [{ semester: 1, sections: ["A"] }],
      });
    } else {
      setCurrentRecord(null);
      setFormData(INITIAL_ACADEMIC_FORM);
    }
    setIsModalOpen(true);
  };

  const handleAddSemester = () => {
    setFormData((prev) => {
      const nextSemNum = prev.semesterDetails.length + 1;
      return {
        ...prev,
        semesterDetails: [
          ...prev.semesterDetails,
          { semester: nextSemNum, sections: ["A", "B"] },
        ],
      };
    });
  };

  const handleRemoveSemester = (index) => {
    setFormData((prev) => {
      const updated = prev.semesterDetails.filter((_, i) => i !== index);
      return { ...prev, semesterDetails: reindexSemesters(updated) };
    });
  };

  const requestRemoveSemester = (index, semesterNumber) => {
    setSemesterToDelete({ index, semesterNumber });
    setIsDeleteSemesterDialogOpen(true);
  };

  const confirmRemoveSemester = () => {
    if (semesterToDelete !== null) {
      handleRemoveSemester(semesterToDelete.index);
      setSemesterToDelete(null);
      setIsDeleteSemesterDialogOpen(false);
    }
  };

  const handleSectionsChange = (index, sectionsStr) => {
    const sectionList = sectionsStr
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    setFormData((prev) => {
      const updated = [...prev.semesterDetails];
      updated[index] = { ...updated[index], sections: sectionList };
      return { ...prev, semesterDetails: updated };
    });
  };

  const handleAddSection = (index, customSectionName = null) => {
    setFormData((prev) => {
      const updated = [...prev.semesterDetails];
      const rawSections = updated[index]?.sections || [];
      const currentSections = rawSections.map(normalizeSectionName).filter(Boolean);

      let newSec = (customSectionName || "").trim().toUpperCase();
      if (!newSec) {
        newSec = generateNextSectionLetter(currentSections);
      }

      if (currentSections.includes(newSec)) {
        toast.error(`Section "${newSec}" already exists in this semester.`);
        return prev;
      }

      updated[index] = {
        ...updated[index],
        sections: [...currentSections, newSec],
      };
      return { ...prev, semesterDetails: updated };
    });
  };

  const handleRemoveSection = (semIndex, secIndex) => {
    setFormData((prev) => {
      const updated = [...prev.semesterDetails];
      const currentSections = updated[semIndex]?.sections || [];
      const updatedSections = currentSections.filter((_, i) => i !== secIndex);
      updated[semIndex] = { ...updated[semIndex], sections: updatedSections };
      return { ...prev, semesterDetails: updated };
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const { isValid, message } = validateDepartmentForm(formData);
    if (!isValid) {
      toast.error(message);
      return;
    }

    setSaving(true);
    try {
      const payload = sanitizeDepartmentPayload(formData);

      if (currentRecord) {
        await api.put(
          `/api/admin/academic-options/${currentRecord.id}`,
          payload,
        );
        toast.success("Department updated successfully.");
      } else {
        await api.post("/api/admin/academic-options", payload);
        toast.success("Department added successfully.");
      }

      setIsModalOpen(false);
      setDepartmentDetails({});
      fetchData();
    } catch (error) {
      console.error("Failed to save department option.", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      await api.delete(`/api/admin/academic-options/${recordToDelete.id}`);
      toast.success("Department deleted successfully.");
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
      setDepartmentDetails({});
      fetchData();
    } catch (error) {
      console.error("Failed to delete department option.", error);
    }
  };

  return {
    departments,
    loading,
    saving,
    isModalOpen,
    setIsModalOpen,
    currentRecord,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    recordToDelete,
    setRecordToDelete,
    isDeleteSemesterDialogOpen,
    setIsDeleteSemesterDialogOpen,
    semesterToDelete,
    formData,
    setFormData,
    handleOpenModal,
    handleAddSemester,
    handleRemoveSemester,
    requestRemoveSemester,
    confirmRemoveSemester,
    handleSectionsChange,
    handleAddSection,
    handleRemoveSection,
    handleSave,
    handleDelete,
    departmentDetails,
    detail,
    isDetailOpen,
    isDetailLoading,
    closeDetail: () => setIsDetailOpen(false),
    openDepartmentDetail,
    activeSemesterAudit,
    setActiveSemesterAudit,
    openSemesterAudit,
  };
};

export default useAdminAcademicOptions;
