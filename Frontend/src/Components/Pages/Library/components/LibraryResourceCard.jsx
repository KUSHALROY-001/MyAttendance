import { formatDistanceToNow } from "date-fns";
import { User, Clock, ExternalLink } from "lucide-react";

const getEmbedUrl = (url) => {
  if (!url) return "";
  try {
    if (url.includes("/file/d/")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    if (url.includes("/folders/")) {
      const parts = url.split("/folders/");
      const folderId = parts[1]?.split("?")[0]?.split("/")[0];
      if (folderId) {
        return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
      }
    }
    return url;
  } catch (_err) {
    return url;
  }
};

export default function LibraryResourceCard({ res }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500 dark:border-[#222228] dark:bg-[#151518] dark:hover:border-indigo-500 dark:hover:bg-[#1C1C22]">
      <div className="flex-1">
        <div className="mb-3 flex flex-wrap gap-2">
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
