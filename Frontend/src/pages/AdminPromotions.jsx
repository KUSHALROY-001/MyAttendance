import React from "react";
import {
  Loader2,
  Users,
  GraduationCap,
  History,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useSemesterPromotion from "../hooks/useSemesterPromotion";
import AdminTable from "../components/admin/AdminTable";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import StatCard from "../components/common/StatCard";
import PromotionScopeHeader from "../components/admin/promotions/PromotionScopeHeader";
import PromotionBatchDetailPanel from "../components/admin/promotions/PromotionBatchDetailPanel";
import {
  previewColumns,
  historyColumns,
} from "../components/admin/promotions/promotionsColumns";

const AdminPromotions = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const {
    preview,
    previewWarnings,
    loadingPreview,
    department,
    setDepartment,
    totalEligible,
    totalSkipped,
    running,
    isConfirmOpen,
    setIsConfirmOpen,
    requestRunPromotion,
    runPromotion,
    batches,
    loadingBatches,
    activeBatch,
    isDetailOpen,
    isDetailLoading,
    closeDetail,
    openBatchDetail,
  } = useSemesterPromotion();

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <AlertTriangle className="mb-3 h-10 w-10 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Super Admin only
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Semester promotion can only be run by your institute's Super Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Semester Promotion
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Advance every eligible student to their next semester, archive their
          current semester's attendance, and auto-enroll them in the new
          semester's curriculum.
        </p>
      </div>

      <PromotionScopeHeader
        department={department}
        setDepartment={setDepartment}
        preview={preview}
        requestRunPromotion={requestRunPromotion}
        running={running}
        loadingPreview={loadingPreview}
        totalEligible={totalEligible}
      />

      {loadingPreview ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Eligible for promotion"
              value={totalEligible}
              icon={<Users className="h-4 w-4 text-indigo-600" />}
              iconBg="bg-indigo-50 dark:bg-indigo-500/10"
            />
            <StatCard
              title="At final semester (skipped)"
              value={totalSkipped}
              icon={<GraduationCap className="h-4 w-4 text-green-600" />}
              iconBg="bg-slate-100 dark:bg-green-100/50"
            />
            <StatCard
              title="Departments in scope"
              value={preview.length}
              icon={<History className="h-4 w-4 text-amber-600" />}
              iconBg="bg-amber-50 dark:bg-amber-500/10"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Eligibility Preview
            </h2>
            <AdminTable
              columns={previewColumns}
              data={preview}
              emptyMessage="No departments with configured semesters found."
            />
          </div>

          {previewWarnings.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/5 dark:text-amber-400">
              {previewWarnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
            </div>
          )}
        </>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Promotion History
        </h2>
        {loadingBatches ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <AdminTable
            columns={historyColumns}
            data={batches}
            onRowClick={(batch) => openBatchDetail(batch.id)}
            actions={() => <ChevronRight className="h-4 w-4 text-slate-400" />}
            emptyMessage="No promotion runs yet."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={runPromotion}
        title="Run semester promotion?"
        message={`This will permanently advance ${totalEligible} student(s) in ${
          department || "all departments"
        } to their next semester, archive their current semester's attendance into a summary, and enroll them in the new curriculum. This can't be undone.`}
        confirmText="Promote students"
        confirmVariant="warning"
      />

      <PromotionBatchDetailPanel
        batch={isDetailOpen ? activeBatch : null}
        loading={isDetailLoading}
        onClose={closeDetail}
      />
    </div>
  );
};

export default AdminPromotions;
