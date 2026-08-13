import React, { useState } from "react";
import { UserCheck, UserX, Loader2, Clock, Inbox } from "lucide-react";
import usePendingApprovals from "../hooks/usePendingApprovals";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import { formatDateMedium } from "../utils/formatters";

import PendingApprovalsSkeleton from "../components/common/skeletons/PendingApprovalsSkeleton";

const AdminPendingApprovals = () => {
  const { pendingStudents, loading, processingId, handleApprove, handleReject } =
    usePendingApprovals();
  const [rejectTarget, setRejectTarget] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pending Approvals
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          New student signups wait here until you approve or reject them.
          Check the enrollment number against your own records before
          approving.
        </p>
      </div>

      {loading ? (
        <PendingApprovalsSkeleton count={4} />
      ) : pendingStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <Inbox className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No pending signups right now.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            New student signup requests will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pendingStudents.map((student) => (
            <div
              key={student.userId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900 dark:text-slate-100">
                    {student.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {student.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <Clock size={12} /> Pending
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Roll Number
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-200">
                    {student.rollNumber}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Enrollment Number
                  </dt>
                  <dd className="font-mono text-slate-700 dark:text-slate-200">
                    {student.enrollmentNumber}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Department
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-200">
                    {student.department} · Sem {student.semester} · Sec{" "}
                    {student.section}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Batch
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-200">
                    {student.batch}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Contact
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-200">
                    {student.contactNumber}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Requested
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-200">
                    {formatDateMedium(student.requestedAt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  disabled={processingId === student.userId}
                  onClick={() => handleApprove(student.userId)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserCheck size={14} /> Approve
                </button>
                <button
                  type="button"
                  disabled={processingId === student.userId}
                  onClick={() => setRejectTarget(student)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-300 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <UserX size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => rejectTarget && handleReject(rejectTarget.userId)}
        title="Reject this signup?"
        message={
          rejectTarget
            ? `${rejectTarget.name} (${rejectTarget.email}) will not be able to log in. This can't be undone from here.`
            : ""
        }
      />
    </div>
  );
};

export default AdminPendingApprovals;
