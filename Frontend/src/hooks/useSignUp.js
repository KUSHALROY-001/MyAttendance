import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  resolveAvailableSemesters,
  resolveAvailableSections,
  buildSignUpPayload,
} from "../utils/signupHelpers";
import { useInstituteCode } from "./useInstituteCode";

export function useSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    instituteCode,
    handleInstituteCodeChange,
    instituteCodeStatus,
    verifiedInstitute,
  } = useInstituteCode();

  const [academicOptions, setAcademicOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSec, setSelectedSec] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Academic options depend entirely on which institute the student is
  // joining, so this only fires once the institute code has been verified —
  // there's nothing sensible to show before that.
  useEffect(() => {
    if (instituteCodeStatus !== "valid" || !verifiedInstitute?.code) {
      setAcademicOptions([]);
      setSelectedDept("");
      setSelectedSem("");
      setSelectedSec("");
      return undefined;
    }

    let cancelled = false;

    const fetchAcademicOptions = async () => {
      try {
        setLoadingOptions(true);
        const res = await api.get("/api/auth/academic-options", {
          params: { instituteCode: verifiedInstitute.code },
          hideAuthRedirect: true,
          skipAuthRefresh: true,
        });

        if (cancelled) return;

        const depts = res.data?.departments || [];
        setAcademicOptions(depts);
        if (depts.length > 0) {
          const firstDept = depts[0];
          setSelectedDept(firstDept.code);
          const sems = firstDept.semesterDetails || [];
          if (sems.length > 0) {
            setSelectedSem(String(sems[0].semester));
            const secs = (sems[0].sections || []).map((s) =>
              typeof s === "object" && s !== null ? s.name || s.value || String(s) : String(s),
            );
            if (secs.length > 0) {
              setSelectedSec(secs[0]);
            }
          }
        }
      } catch (_err) {
        if (!cancelled) toast.error("Failed to load department options.");
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    fetchAcademicOptions();

    return () => {
      cancelled = true;
    };
  }, [instituteCodeStatus, verifiedInstitute]);

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
      const secs = (sems[0].sections || []).map((s) =>
        typeof s === "object" && s !== null ? s.name || s.value || String(s) : String(s),
      );
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
    const secs = (semObj?.sections || []).map((s) =>
      typeof s === "object" && s !== null ? s.name || s.value || String(s) : String(s),
    );
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

    if (instituteCodeStatus !== "valid" || !verifiedInstitute?.code) {
      toast.error("Please enter a valid institute code first.");
      return;
    }

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );

    try {
      setIsSubmitting(true);
      const payload = {
        ...buildSignUpPayload(formData, selectedDept, selectedSem, selectedSec),
        instituteCode: verifiedInstitute.code,
      };

      await api.post("/api/auth/signup", payload, {
        hideAuthRedirect: true,
        skipAuthRefresh: true,
      });

      toast.success(
        "Your signup request has been submitted. Your institute admin needs to approve your account before you can log in.",
        { duration: 6000 },
      );
      navigate("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    instituteCode,
    handleInstituteCodeChange,
    instituteCodeStatus,
    verifiedInstitute,
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
