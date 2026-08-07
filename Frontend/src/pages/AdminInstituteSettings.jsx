import React from "react";
import { Building2, Copy, Check, Loader2, Lock } from "lucide-react";
import useInstituteSettings from "../hooks/useInstituteSettings";
import { formatDateMedium } from "../utils/formatters";
import { useAuth } from "../contexts/AuthContext";

const inputClass =
  "block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800/60 dark:disabled:text-slate-400";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300";

const AdminInstituteSettings = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const {
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
  } = useInstituteSettings();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading institute
        settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Institute Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your institute's identity and share its join code.
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Lock size={18} />
          </div>
          <div>
            <p className="text-sm font-bold">Read-Only Mode</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              You are viewing as a standard Admin. Only Super Admins are
              authorized to edit institute settings.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={labelClass}>Institute Join Code</p>
            <p className="mt-1.5 font-mono text-2xl font-black tracking-[0.15em] text-indigo-700 dark:text-indigo-300">
              {institute?.code}
            </p>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Share this with students so they can join during signup. It can't
              be changed here.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-white px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400 dark:bg-transparent dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Code"}
          </button>
        </div>
      </div>

      <div
        className={`relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:p-6 transition-all ${
          !isSuperAdmin
            ? "opacity-65 bg-slate-50/80 dark:bg-slate-900/40 cursor-not-allowed group"
            : ""
        }`}
      >
        {!isSuperAdmin && (
          <div
            className="absolute inset-0 z-20 cursor-not-allowed rounded-2xl bg-slate-500/5 backdrop-blur-[0.5px] dark:bg-slate-950/20"
            title="Only Super Admins can modify institute settings"
          />
        )}

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Institute Details
            </h2>
            {institute?.createdAt && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registered on {formatDateMedium(institute.createdAt)}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="instituteName" className={labelClass}>
              Institute Name
            </label>
            <input
              id="instituteName"
              type="text"
              required
              disabled={!isSuperAdmin}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="instituteAddress" className={labelClass}>
              Address
            </label>
            <input
              id="instituteAddress"
              type="text"
              disabled={!isSuperAdmin}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="allowedEmailDomains" className={labelClass}>
              Allowed Email Domains
            </label>
            <input
              id="allowedEmailDomains"
              type="text"
              disabled={!isSuperAdmin}
              value={allowedEmailDomains}
              onChange={(e) => setAllowedEmailDomains(e.target.value)}
              placeholder="e.g., college.edu, alumni.college.edu"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              Comma-separated. Only students signing up with a matching email
              domain will be accepted. Leave blank to allow any email address.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={saving || !isSuperAdmin}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminInstituteSettings;
