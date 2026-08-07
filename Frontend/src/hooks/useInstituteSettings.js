import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const useInstituteSettings = () => {
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [allowedEmailDomains, setAllowedEmailDomains] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchInstitute = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/institute");
      setInstitute(res.data);
      setName(res.data.name || "");
      setAddress(res.data.address || "");
      setAllowedEmailDomains(res.data.allowedEmailDomains || "");
    } catch (error) {
      console.error("Failed to load institute settings.", error);
      toast.error("Failed to load institute settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitute();
  }, []);

  const handleCopyCode = async () => {
    if (!institute?.code) return;
    try {
      await navigator.clipboard.writeText(institute.code);
      setCopied(true);
      toast.success("Institute code copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast.error("Couldn't copy — please copy it manually.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Institute name is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/api/admin/institute", {
        name: name.trim(),
        address: address.trim(),
        allowedEmailDomains: allowedEmailDomains.trim(),
      });
      setInstitute(res.data);
      setAllowedEmailDomains(res.data.allowedEmailDomains || "");
      toast.success("Institute settings updated.");
    } catch (error) {
      console.error("Failed to update institute settings.", error);
    } finally {
      setSaving(false);
    }
  };

  return {
    institute,
    loading,
    saving,
    name,
    setName,
    address,
    setAddress,
    allowedEmailDomains,
    setAllowedEmailDomains,
    copied,
    handleCopyCode,
    handleSubmit,
  };
};

export default useInstituteSettings;
