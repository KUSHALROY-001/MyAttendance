import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500";

const labelClass =
  "block text-xs font-medium text-slate-700 dark:text-slate-200";

// PasswordField — a labeled input with a show/hide toggle, factored out
// since this page needs the same control three times.
const PasswordField = ({ id, label, value, onChange, autoComplete }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const ChangePasswordRequired = () => {
  const navigate = useNavigate();
  const { user, refreshCurrentUser, getDefaultRouteForRole } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation don't match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(
        "/api/auth/change-password",
        { newPassword },
        // This is an expected-401-on-wrong-password endpoint, not a stale
        // session — skip the refresh-token dance the response interceptor
        // would otherwise try first.
        { hideAuthRedirect: true, skipAuthRefresh: true },
      );

      // Pulls the fresh user object (mustChangePassword: false) so the
      // RequirePasswordChange gate stops redirecting here.
      const updatedUser = await refreshCurrentUser();
      toast.success("Password changed successfully.");
      navigate(getDefaultRouteForRole(updatedUser?.role), { replace: true });
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Couldn't change your password. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#0D0D0F] transition-colors duration-300">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 dark:border-[#222228] dark:bg-[#151518] dark:shadow-black/50">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {user?.name ? `Welcome, ${user.name}` : "Welcome"}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Set a new password
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your account was created with a default password. Choose a new one
              to continue — you can't access the rest of the app until this is
              done.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* No "current password" field on purpose — see the comment on
                the backend's changePassword handler. Getting to this page
                already required logging in with the real current password,
                so re-asking for it here just invites the browser-autofill
                trap (a password manager sees several stacked password
                fields and "helpfully" overwrites this one with a random
                generated suggestion). */}
            <PasswordField
              id="newPassword"
              label="New password"
              value={newPassword}
              onChange={(e) => {
                setErrorMessage("");
                setNewPassword(e.target.value);
              }}
              autoComplete="new-password"
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setErrorMessage("");
                setConfirmPassword(e.target.value);
              }}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-[#151518]"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordRequired;
