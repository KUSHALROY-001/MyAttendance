import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  isValidInstituteCodeFormat,
  normalizeInstituteCode,
} from "../utils/instituteHelpers";

export function useRegisterInstitute() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instituteCode, setInstituteCode] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleInstituteCodeChange = (e) => {
    setInstituteCode(normalizeInstituteCode(e.target.value));
  };

  const isInstituteCodeFormatValid =
    instituteCode.length === 0 || isValidInstituteCodeFormat(instituteCode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());

    const normalizedCode = normalizeInstituteCode(formData.instituteCode);

    if (!isValidInstituteCodeFormat(normalizedCode)) {
      toast.error(
        "Institute code must be 3-20 characters: letters, numbers, or hyphens only.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(
        "/api/auth/institute/register",
        {
          ...formData,
          instituteCode: normalizedCode,
        },
        {
          hideAuthRedirect: true,
          skipAuthRefresh: true,
        },
      );

      toast.success(
        "Institute registered successfully. Please log in as the institute admin.",
        { duration: 5000 },
      );
      navigate("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    instituteCode,
    handleInstituteCodeChange,
    isInstituteCodeFormatValid,
    showPassword,
    toggleShowPassword,
    isSubmitting,
    handleSubmit,
  };
}
