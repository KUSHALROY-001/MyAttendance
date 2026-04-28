import { formatDistanceToNow } from "date-fns";
import { User, Clock, ExternalLink } from "lucide-react";

// Helper function to convert Google Drive links to embeddable preview URLs
const getEmbedUrl = (url) => {
  if (!url) return "";
  try {
    if (url.includes("/file/d/")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    if (url.includes("/folders/")) {
      // Extract the folder ID
      const parts = url.split("/folders/");
      const folderId = parts[1]?.split("?")[0]?.split("/")[0];
      if (folderId) {
        return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
      }
    }
    return url;
  } catch (err) {
    return url;
  }
};

export default function LibraryResourceCard({ res }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col h-full hover:border-indigo-500/50 transition duration-300">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {res.subjectName}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            {res.department}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            Sem {res.semester}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-50 line-clamp-2 mb-1">
          {res.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-3 mb-4">
          {res.description || "No description provided."}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-700/50 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <User className="text-slate-500" size={14} />
            <span>
              {res.contributor?.name}{" "}
              <span className="text-slate-500">({res.contributor?.role})</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={14} />
            <span>
              {formatDistanceToNow(new Date(res.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Inline Google Drive Preview */}
        {res.driveLink && (
          <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
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
          className="flex w-full items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Open in Google Drive <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
