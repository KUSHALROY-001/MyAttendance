import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User, Clock, ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { getEmbedUrl } from "../../utils/libraryHelpers";

export default function LibraryResourceCard({ res, user, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUserId = user?.userId ?? user?.id ?? user?.profile?.id;
  const isOwner = Boolean(
    currentUserId &&
      res?.contributor?.id &&
      Number(currentUserId) === Number(res.contributor.id),
  );
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const canModify = isOwner || isAdmin;

  return (
    <div className="relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500 dark:border-[#222228] dark:bg-[#151518] dark:hover:border-indigo-500 dark:hover:bg-[#1C1C22]">
      <div className="flex-1">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {res.subjectName}
            </span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-[#1C1C20] dark:text-slate-300">
              {res.department}
            </span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-[#1C1C20] dark:text-slate-300">
              Sem {res.semester}
            </span>
          </div>

          {canModify && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#222228] dark:hover:text-slate-200 transition"
                title="Options"
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-[#222228] dark:bg-[#19191D]">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit?.(res);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#222228] transition"
                    >
                      <Pencil size={14} /> Edit Resource
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete?.(res);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 size={14} /> Delete Resource
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <h3 className="mb-1 line-clamp-2 text-lg font-bold text-slate-900 dark:text-slate-50">
          {res.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
          {res.description || "No description provided."}
        </p>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4 dark:border-[#222228]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User className="text-slate-400 dark:text-slate-500" size={14} />
            <span>
              {res.contributor?.name}{" "}
              <span className="text-slate-400 dark:text-slate-500">({res.contributor?.role})</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock size={14} />
            <span>
              {formatDistanceToNow(new Date(res.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {res.driveLink && (
          <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-[#222228] dark:bg-[#19191D]">
            <iframe
              src={getEmbedUrl(res.driveLink)}
              width="100%"
              height="220"
              className="border-0"
              allow="autoplay"
              title={res.title}
            ></iframe>
          </div>
        )}

        <a
          href={res.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-[#222228] dark:bg-[#19191D] dark:text-slate-200 dark:hover:bg-[#26262B] dark:hover:border-indigo-500"
        >
          Open in Google Drive <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
