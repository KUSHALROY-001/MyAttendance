import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  resolveAvailableSemesters,
  resolveAvailableSections,
  buildSignUpPayload,
} from "../utils/signupHelpers";

export function useSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [academicOptions, setAcademicOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSec, setSelectedSec] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchAcademicOptions = async () => {
      try {
        setLoadingOptions(true);
        const res = await api.get("/api/auth/academic-options", {
          hideAuthRedirect: true,
          skipAuthRefresh: true,
        });
        const depts = res.data?.departments || [];
        setAcademicOptions(depts);
        if (depts.length > 0) {
          const firstDept = depts[0];
          setSelectedDept(firstDept.code);
          const sems = firstDept.semesterDetails || [];
          if (sems.length > 0) {
            setSelectedSem(String(sems[0].semester));
            const secs = sems[0].sections || [];
            if (secs.length > 0) {
              setSelectedSec(secs[0]);
            }
          }
        }
      } catch (_err) {
        toast.error("Failed to load department options.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchAcademicOptions();
  }, []);

  const currentDeptObj = useMemo(() => {
    return academicOptions.find((d) => d.code === selectedDept);
  }, [academicOptions, selectedDept]);

  const availableSemesters = useMemo(() => {
    return resolveAvailableSemesters(currentDeptObj);
  }, [currentDeptObj]);

  const currentSemObj = useMemo(() => {
    if (!currentDeptObj || !currentDeptObj.semesterDetails) return null;
    return currentDeptObj.semesterDetails.find(
      (detail) => String(detail.semester) === String(selectedSem),
    );
  }, [currentDeptObj, selectedSem]);

  const availableSections = useMemo(() => {
    return resolveAvailableSections(currentSemObj);
  }, [currentSemObj]);

  const handleDeptChange = (e) => {
    const nextDeptCode = e.target.value;
    setSelectedDept(nextDeptCode);

    const deptObj = academicOptions.find((d) => d.code === nextDeptCode);
    const sems = deptObj?.semesterDetails || [];
    if (sems.length > 0) {
      const nextSem = String(sems[0].semester);
      setSelectedSem(nextSem);
      const secs = sems[0].sections || [];
      if (secs.length > 0) {
        setSelectedSec(secs[0]);
      } else {
        setSelectedSec("");
      }
    } else {
      setSelectedSem("");
      setSelectedSec("");
    }
  };

  const handleSemChange = (e) => {
    const nextSemStr = e.target.value;
    setSelectedSem(nextSemStr);

    const semObj = currentDeptObj?.semesterDetails?.find(
      (d) => String(d.semester) === String(nextSemStr),
    );
    const secs = semObj?.sections || [];
    if (secs.length > 0) {
      setSelectedSec(secs[0]);
    } else {
      setSelectedSec("");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      setIsSubmitting(true);
      const payload = buildSignUpPayload(
        formData,
        selectedDept,
        selectedSem,
        selectedSec,
      );

      await api.post("/api/auth/signup", payload, {
        hideAuthRedirect: true,
        skipAuthRefresh: true,
      });

      toast.success(
        `${formData.name || "Your"} account has been created successfully. Please log in.`,
        { duration: 4000 },
      );
      navigate("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    academicOptions,
    selectedDept,
    selectedSem,
    selectedSec,
    setSelectedSec,
    loadingOptions,
    availableSemesters,
    availableSections,
    showPassword,
    toggleShowPassword,
    isSubmitting,
    handleDeptChange,
    handleSemChange,
    handleSubmit,
    navigate,
  };
}
