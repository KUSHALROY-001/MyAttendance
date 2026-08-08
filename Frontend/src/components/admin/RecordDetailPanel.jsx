import React from "react";
import {
  X,
  Loader2,
  User,
  Mail,
  CreditCard,
  FileText,
  Building2,
  GraduationCap,
  Users,
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Info,
  Clock,
  MapPin,
  Tag,
  Activity,
} from "lucide-react";
import AdminModal from "./AdminModal";
import { formatDateTimeShort } from "../../utils/formatters";

const EMPTY_VALUE = "Not available";

const getInitials = (name = "") => {
  if (!name) return "DP";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getFieldIcon = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("name")) return User;
  if (l.includes("email")) return Mail;
  if (l.includes("roll")) return CreditCard;
  if (l.includes("enrollment")) return FileText;
  if (l.includes("department") || l.includes("dept")) return Building2;
  if (l.includes("semester") || l.includes("sem")) return GraduationCap;
  if (l.includes("section") || l.includes("sec")) return Users;
  if (l.includes("batch") || l.includes("year")) return Calendar;
  if (l.includes("contact") || l.includes("phone")) return Phone;
  if (l.includes("status") || l.includes("account")) return ShieldCheck;
  if (l.includes("course") || l.includes("subject")) return BookOpen;
  if (l.includes("date") || l.includes("time")) return Clock;
  if (l.includes("room") || l.includes("location")) return MapPin;
  if (l.includes("type") || l.includes("role")) return Tag;
  return Info;
};

export const renderAuditActor = (actor, { isPending, isFounder } = {}) => {
  if (actor) return `${actor.name} (${actor.email})`;
  if (isPending) return "Awaiting approval";
  if (isFounder) return "System / Self-registered";
  return "Unknown (pre-audit record)";
};

const renderValue = (field, detail) => {
  if (field.render) return field.render(detail);
  const value = detail?.[field.accessor];
  if (value === null || value === undefined || value === "") return EMPTY_VALUE;
  return String(value);
};

const AttendanceGauge = ({ percentage = 100 }) => {
  const numericPct =
    typeof percentage === "number" ? percentage : parseFloat(percentage) || 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericPct / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center">
      <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-slate-200 dark:stroke-slate-800"
          strokeWidth="7"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-emerald-500 dark:stroke-emerald-400 transition-all duration-1000 ease-out"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
          {numericPct}%
        </span>
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight px-1">
          Overall <br /> Attendance
        </span>
      </div>
    </div>
  );
};

const RecordDetailPanel = ({
  isOpen,
  onClose,
  title = "Record Details",
  detail,
  isLoading,
  sections = [],
}) => {
  const isPending =
    detail?.isPendingApproval || detail?.accountStatus === "PENDING";
  const isFounder =
    detail?.isFounder || (detail?.role === "SUPER_ADMIN" && !detail?.createdBy);

  const displayName = detail?.name || detail?.title || title || "Record";
  const initials = getInitials(displayName);

  const getProfileBadgeLabel = () => {
    if (detail?.role === "STUDENT" || detail?.rollNumber)
      return "Student Profile";
    if (detail?.role === "TEACHER" || detail?.designation)
      return "Teacher Profile";
    if (detail?.role) return `${detail.role} Profile`;
    return "Profile Details";
  };

  const profileSection =
    sections.find(
      (s) =>
        s.title?.toLowerCase().includes("profile") ||
        s.title?.toLowerCase().includes("personal") ||
        s.title?.toLowerCase().includes("detail"),
    ) || sections[0];

  const hasAttendanceData =
    detail?.overallAttendancePercentage !== undefined ||
    detail?.perCourseAttendance?.length > 0;

  const hasEnrolledCourses = detail?.enrolledCourses?.length > 0;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      hideHeader={true}
    >
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          Loading details...
        </div>
      ) : detail ? (
        <div className="flex flex-col bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 dark:from-[#0B132B] dark:via-[#11192E] dark:to-[#0B132B] p-2.5 sm:p-6 text-white border-b border-blue-500/20 dark:border-slate-800/80">
            {/* Graduation Cap Vector Watermark */}
            <svg
              className="pointer-events-none absolute right-2 bottom-0 h-32 w-48 text-white/10 dark:text-blue-500/10 stroke-current"
              viewBox="0 0 100 100"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M50 15 L90 35 L50 55 L10 35 Z" />
              <path d="M25 43 V65 C25 72 75 72 75 65 V43" />
              <path d="M82 39 V68" />
              <circle cx="82" cy="72" r="3" />
            </svg>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 rounded-full bg-white/20 dark:bg-white/10 p-1.5 text-white transition hover:bg-white/30 dark:hover:bg-white/20"
              aria-label="Close detail modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gradient-to-br dark:from-blue-600 dark:to-indigo-600 font-extrabold text-xl text-blue-600 dark:text-white shadow-lg shadow-blue-900/30">
                {initials}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {displayName}
                </h2>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-block rounded-full bg-white/20 dark:bg-blue-600/30 dark:border dark:border-blue-500/30 px-3 py-0.5 text-xs font-semibold text-white dark:text-blue-300 backdrop-blur-md">
                    {getProfileBadgeLabel()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-2.5 sm:p-6 space-y-6">
            {/* Section 1: Personal / Profile Details Grid */}
            {profileSection && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>{profileSection.title || "Personal Details"}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {profileSection.fields.map((field) => {
                    const IconComponent = getFieldIcon(field.label);
                    const value = renderValue(field, detail);
                    const isStatusField = field.label
                      .toLowerCase()
                      .includes("status");
                    const isActive =
                      String(value).toUpperCase() === "ACTIVE" ||
                      String(value).toUpperCase() === "APPROVED" ||
                      String(value).toUpperCase() === "PRESENT";

                    return (
                      <div
                        key={field.label}
                        className={`flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-[#1E2638] dark:bg-[#131313] p-2 sm:p-3.5 transition-all hover:border-slate-200 dark:hover:border-slate-700 ${
                          field.fullWidth ? "sm:col-span-2" : ""
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-[#111927] dark:text-blue-400">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {field.label}
                          </p>
                          {isStatusField && isActive ? (
                            <span className="mt-0.5 inline-block rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {value}
                            </span>
                          ) : (
                            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                              {value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Attendance Overview Card */}
            {hasAttendanceData && (
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-[#0A1612]/60 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Attendance Overview</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
                  <AttendanceGauge
                    percentage={detail.overallAttendancePercentage ?? 100}
                  />

                  <div className="flex-1 w-full space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-900/30 pb-2">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Overall Attendance
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {detail.overallAttendancePercentage !== null &&
                        detail.overallAttendancePercentage !== undefined
                          ? `${detail.overallAttendancePercentage}%`
                          : "100%"}
                      </span>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Course Attendance
                      </p>
                      {detail.perCourseAttendance?.length ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {detail.perCourseAttendance.map((c, i) => (
                            <span
                              key={c.code || i}
                              className="inline-flex items-center gap-1"
                            >
                              <span>{c.code}:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {c.totalAttended}/{c.totalSessions}
                              </span>
                              {i < detail.perCourseAttendance.length - 1 && (
                                <span className="text-slate-300 dark:text-slate-600 ml-1">
                                  •
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          No attendance records yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Enrolled Courses Card */}
            {hasEnrolledCourses && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-[#111726] p-5 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="h-4 w-4 text-indigo-600 dark:text-blue-400" />
                  <span>Enrolled Courses</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {detail.enrolledCourses.map((c, i) => (
                    <span
                      key={c.code || i}
                      className="inline-flex items-center gap-1"
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {c.code}
                      </span>
                      <span>- {c.name}</span>
                      {i < detail.enrolledCourses.length - 1 && (
                        <span className="text-slate-300 dark:text-slate-600 ml-2">
                          •
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Audit Trail Footer Card */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 dark:border-purple-900/30 dark:bg-[#141226]/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Audit Trail</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400/80">
                    Account Created
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>
                      {formatDateTimeShort(
                        detail.accountCreatedAt ||
                          detail.recordCreatedAt ||
                          detail.createdAt,
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400/80">
                    Created By
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <User className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="truncate">
                      {renderAuditActor(detail.createdBy, {
                        isPending,
                        isFounder,
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400/80">
                    Updated By
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <User className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="truncate">
                      {renderAuditActor(detail.updatedBy, {
                        isPending,
                        isFounder,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          No detail available.
        </div>
      )}
    </AdminModal>
  );
};

export default RecordDetailPanel;
