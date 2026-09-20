import React, { useRef, useState } from "react";
import { Camera, Loader2, Trash2, User } from "lucide-react";

/**
 * Circular profile picture with a camera button to change it and, once a
 * custom one exists, a "Remove" link to go back to initials. Lives above
 * the main details form as its own independent action - picking a file
 * uploads immediately rather than waiting on the form's "Save Changes"
 * button, since a picture change has nothing to do with the rest of that
 * form's fields.
 */
const ProfileAvatarUploader = ({
  name,
  avatarUrl,
  hasCustomAvatar,
  savingAvatar,
  handleUploadAvatar,
  handleRemoveAvatar,
}) => {
  const fileInputRef = useRef(null);
  // Client-side only, so the picture just picked shows immediately
  // instead of waiting on the upload round trip - cleared once the real
  // avatarUrl (from the server response) takes over.
  const [localPreview, setLocalPreview] = useState(null);

  const displayedAvatar = localPreview || avatarUrl;
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  const onFileChosen = (event) => {
    const file = event.target.files?.[0];
    // Always clear the input's own value, chosen or not, so picking the
    // exact same file again still fires a fresh onChange next time.
    event.target.value = "";
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    Promise.resolve(handleUploadAvatar(file)).finally(() => {
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    });
  };

  return (
    <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6 dark:border-slate-800">
      <div className="relative shrink-0">
        {displayedAvatar ? (
          <img
            src={displayedAvatar}
            alt=""
            className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
            {initial || <User size={24} />}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={savingAvatar}
          aria-label="Change profile picture"
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-900"
        >
          {savingAvatar ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Camera size={12} />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onFileChosen}
          className="hidden"
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Profile picture
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          PNG, JPEG, or WEBP - up to 5MB.
        </p>
        {hasCustomAvatar && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={savingAvatar}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:text-red-400"
          >
            <Trash2 size={12} />
            Remove picture
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatarUploader;
