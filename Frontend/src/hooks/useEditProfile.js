import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import {
  getInitialForm,
  resolveAvailableSemesters,
  resolveAvailableSections,
  formatProfileUpdatePayload,
} from "../utils/profileHelpers";

export function useEditProfile() {
  const navigate = useNavigate();
  const { user, refreshCurrentUser, getDefaultRouteForRole } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(getInitialForm(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [academicOptions, setAcademicOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, academicRes] = await Promise.all([
          api.get("/api/auth/profile", { hideGlobalToast: true }),
          api.get("/api/auth/academic-options", { hideGlobalToast: true }),
        ]);

        const nextProfile = profileRes.data?.profile || null;
        setProfile(nextProfile);
        setFormData(getInitialForm(nextProfile));

        const depts = academicRes.data?.departments || [];
        setAcademicOptions(depts);
      } catch (_error) {
        toast.error("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const role = profile?.role || user?.role || "STUDENT";
  const dashboardPath = useMemo(() => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin";
    return getDefaultRouteForRole(role);
  }, [getDefaultRouteForRole, role]);

  const currentDeptObj = useMemo(() => {
    return academicOptions.find((d) => d.code === formData.department);
  }, [academicOptions, formData.department]);

  const availableSemesters = useMemo(() => {
    return resolveAvailableSemesters(currentDeptObj);
  }, [currentDeptObj]);

  const currentSemObj = useMemo(() => {
    if (!currentDeptObj || !currentDeptObj.semesterDetails) return null;
    return currentDeptObj.semesterDetails.find(
      (detail) => String(detail.semester) === String(formData.semester),
    );
  }, [currentDeptObj, formData.semester]);

  const availableSections = useMemo(() => {
    return resolveAvailableSections(currentSemObj);
  }, [currentSemObj]);

  const handleDeptChange = (event) => {
    const nextDeptCode = event.target.value;
    const deptObj = academicOptions.find((d) => d.code === nextDeptCode);
    const sems = deptObj?.semesterDetails || [];
    const nextSem = sems.length > 0 ? String(sems[0].semester) : "";
    const rawSecs = sems.length > 0 ? sems[0].sections || [] : [];
    const secs = rawSecs.map((s) => (typeof s === "object" && s !== null ? s.name || s.value || String(s) : String(s)));
    const nextSec = secs.length > 0 ? secs[0] : "";

    setFormData((current) => ({
      ...current,
      department: nextDeptCode,
      semester: nextSem,
      section: nextSec,
    }));
  };

  const handleSemChange = (event) => {
    const nextSemStr = event.target.value;
    const semObj = currentDeptObj?.semesterDetails?.find(
      (d) => String(d.semester) === String(nextSemStr),
    );
    const rawSecs = semObj?.sections || [];
    const secs = rawSecs.map((s) => (typeof s === "object" && s !== null ? s.name || s.value || String(s) : String(s)));
    const nextSec = secs.length > 0 ? secs[0] : "";

    setFormData((current) => ({
      ...current,
      semester: nextSemStr,
      section: nextSec,
    }));
  };

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const payload = formatProfileUpdatePayload(formData, role);
      await api.put("/api/auth/profile", payload, {
        hideAuthRedirect: true,
      });
      await refreshCurrentUser();
      toast.success("Profile updated successfully.");
      navigate(dashboardPath);
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    formData,
    loading,
    saving,
    academicOptions,
    role,
    dashboardPath,
    availableSemesters,
    availableSections,
    handleDeptChange,
    handleSemChange,
    updateField,
    handleSubmit,
  };
}
