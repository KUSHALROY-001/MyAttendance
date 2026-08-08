import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { LABEL_CLASS } from "../../../utils/academicOptionsHelpers";
import { formatDateTimeShort } from "../../../utils/formatters";

const getSectionName = (section) =>
  typeof section === "object" ? section.name : section;

const findAuditedSemester = (detail, semester) =>
  detail?.semesterDetails?.find(
    (item) => Number(item.semester) === Number(semester),
  );

const SemesterAuditPopover = ({ semester }) => {
  if (!semester) return null;
  return (
    <div className="absolute left-3 right-3 top-full z-40 mt-2 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-xl dark:border-slate-700 dark:bg-slate-950">
      <p className="font-bold text-slate-900 dark:text-white">
        Semester {semester.semester}
      </p>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Last touched item: Semester {semester.semester}
      </p>
      <p className="mt-2 font-medium text-slate-700 dark:text-slate-200">
        {semester.updatedBy
          ? `${semester.updatedBy.name} (${semester.updatedBy.email})`
          : "Awaiting first update"}
      </p>
      <p className="mt-1 text-slate-500">
        {formatDateTimeShort(semester.updatedAt)}
      </p>
    </div>
  );
};

const SectionChip = ({ section }) => {
  const label = getSectionName(section);
  const message = section?.updatedBy
    ? `Last updated by ${section.updatedBy.name} (${section.updatedBy.email})`
    : "Awaiting first update";

  return (
    <span className="relative inline-flex group/section">
      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono font-semibold text-[10px] text-indigo-600 dark:text-indigo-300">
        {label}
      </span>
      <span className="pointer-events-none absolute bottom-full right-0 z-50 mb-1 hidden w-56 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 shadow-lg group-hover/section:block dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
        {message}
      </span>
    </span>
  );
};

const DepartmentCard = ({
  dept,
  isSuperAdmin,
  onEdit,
  onDelete,
  onOpenDetail,
  onOpenSemesterAudit,
  activeSemesterAudit,
  setActiveSemesterAudit,
  detail,
}) => {
  const semesters = Array.isArray(dept.semesterDetails)
    ? dept.semesterDetails
    : [];

  return (
    <div
      onClick={() => onOpenDetail(dept)}
      className={`relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all ${
        !isSuperAdmin
          ? "opacity-65 bg-slate-50/80 dark:bg-slate-900/40 cursor-pointer group"
          : "hover:border-indigo-200 dark:hover:border-indigo-500/30 cursor-pointer"
      }`}
    >
      {!isSuperAdmin && (
        <div
          className="absolute inset-0 z-20 cursor-not-allowed rounded-2xl bg-slate-500/5 backdrop-blur-[0.5px] dark:bg-slate-950/20"
          title="Only Super Admins can modify academic options"
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-black font-mono text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 mb-1.5">
            {dept.code}
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
            {dept.name}
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0 z-30">
          <button
            type="button"
            disabled={!isSuperAdmin}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(dept);
            }}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition disabled:cursor-not-allowed disabled:opacity-40"
            title="Edit Department"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!isSuperAdmin}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(dept);
            }}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition disabled:cursor-not-allowed disabled:opacity-40"
            title="Delete Department"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2">
        <p className={LABEL_CLASS}>Semesters & Sections</p>
        {semesters.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No semester details configured
          </p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {semesters.map((s, idx) => (
              <div
                key={idx}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenSemesterAudit(dept, s.semester);
                }}
                className="relative flex items-center justify-between text-xs rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
              >
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Sem {s.semester}
                </span>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {(findAuditedSemester(detail, s.semester)?.sections ||
                    s.sections ||
                    []).map((sec, sIdx) => (
                    <SectionChip key={sIdx} section={sec} />
                  ))}
                </div>
                {activeSemesterAudit?.departmentId === dept.id &&
                  activeSemesterAudit?.semester === Number(s.semester) && (
                    <div onClick={(event) => event.stopPropagation()}>
                      <SemesterAuditPopover
                        semester={findAuditedSemester(detail, s.semester) || s}
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      {activeSemesterAudit?.departmentId === dept.id && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setActiveSemesterAudit(null);
          }}
          className="absolute bottom-2 right-2 z-40 text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          Close audit
        </button>
      )}
    </div>
  );
};

export default DepartmentCard;
