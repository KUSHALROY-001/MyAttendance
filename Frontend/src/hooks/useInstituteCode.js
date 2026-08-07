import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import {
  isValidInstituteCodeFormat,
  normalizeInstituteCode,
} from "../utils/instituteHelpers";

// Statuses:
//  "idle"     — nothing entered yet, or format is invalid
//  "checking" — a verify request is in flight
//  "valid"    — code resolved to a real, active institute
//  "invalid"  — code was well-formed but the server rejected it (404)
export function useInstituteCode() {
  const [instituteCode, setInstituteCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [institute, setInstitute] = useState(null); // { id, name, code }
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const handleInstituteCodeChange = (e) => {
    setInstituteCode(e.target.value);
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const code = normalizeInstituteCode(instituteCode);

    if (!code || !isValidInstituteCodeFormat(code)) {
      setStatus("idle");
      setInstitute(null);
      return undefined;
    }

    setStatus("checking");
    const thisRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/api/auth/institute/verify", {
          params: { code },
          hideAuthRedirect: true,
          skipAuthRefresh: true,
          hideGlobalToast: true,
        });

        // Ignore stale responses if the user kept typing
        if (thisRequestId !== requestIdRef.current) return;

        setInstitute(res.data);
        setStatus("valid");
      } catch (_err) {
        if (thisRequestId !== requestIdRef.current) return;
        setInstitute(null);
        setStatus("invalid");
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [instituteCode]);

  return {
    instituteCode,
    handleInstituteCodeChange,
    instituteCodeStatus: status,
    verifiedInstitute: institute,
  };
}
