import React from "react";
import { Info, PencilLine, Save } from "lucide-react";
import StudentProfileFields from "./StudentProfileFields";
import TeacherProfileFields from "./TeacherProfileFields";
import LockedField from "./LockedField";
import ProfileAvatarUploader from "./ProfileAvatarUploader";

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#19191D] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#151518] transition-colors";

const labelClass =
  "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const EditProfileForm = ({
  handleSubmit,
  formData,
  updateField,
  role,
  saving,
  profile,
  savingAvatar,
  handleUploadAvatar,
  handleRemoveAvatar,
}) => {
  const isStudent = role === "STUDENT";
  // Students and teachers can only edit their name and contact number.
  const isRestricted = isStudent || role === "TEACHER";

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <ProfileAvatarUploader
        name={formData.name}
        avatarUrl={profile?.avatarUrl}
        hasCustomAvatar={profile?.hasCustomAvatar}
        savingAvatar={savingAvatar}
        handleUploadAvatar={handleUploadAvatar}
        handleRemoveAvatar={handleRemoveAvatar}
      />
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {isRestricted ? (
          <div className="md:col-span-2 flex items-start gap-3 rounded-lg border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-xs text-indigo-800 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200 sm:text-sm">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              You can edit your name and contact number here. Your other details
              are managed by your institute admin - contact them if something
              needs to be corrected.
            </p>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="name" className={labelClass}>
            Full Name
            <Required />
          </label>
          <input
            id="name"
            value={formData.name}
            onChange={updateField("name")}
            required
            className={inputClass}
          />
        </div>

        {isRestricted ? (
          <LockedField id="email" label="Email" value={formData.email} />
        ) : (
          <div className="space-y-1.5">
            <label htmlFor="email" className={labelClass}>
              Email
              <Required />
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={updateField("email")}
              required
              className={inputClass}
            />
          </div>
        )}

        {isStudent ? (
          <StudentProfileFields formData={formData} updateField={updateField} />
        ) : null}

        {role === "TEACHER" ? (
          <TeacherProfileFields formData={formData} updateField={updateField} />
        ) : null}

        <div className="md:col-span-2 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg sm:bg-indigo-50 text-indigo-600 sm:dark:bg-indigo-500/10 dark:text-indigo-400">
              <PencilLine size={18} />
            </div>
            <p className="text-xs sm:text-sm">
              Your saved changes update your live account profile immediately.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
