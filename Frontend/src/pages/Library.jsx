import React from "react";
import LibraryHeader from "../components/library/LibraryHeader";
import LibraryFilters from "../components/library/LibraryFilters";
import LibraryResourceCard from "../components/library/LibraryResourceCard";
import LibraryModal from "../components/library/LibraryModal";
import LibraryEmptyState from "../components/library/LibraryEmptyState";
import FolderStructureGuide from "../components/library/FolderStructureGuide";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import useLibrary, { inputClass, labelClass } from "../hooks/useLibrary";
import LibrarySkeleton from "../components/common/skeletons/LibrarySkeleton";

export default function Library() {
  const {
    isAuthenticated,
    user,
    resources,
    departments,
    semesters,
    subjects,
    loading,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    filters,
    editingResource,
    resourceToDelete,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    handleFilterChange,
    clearFilters,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleConfirmDelete,
    onRequestLogin,
  } = useLibrary();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 transition-colors dark:bg-[#0D0D0F] dark:text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <LibraryHeader
          setIsModalOpen={handleOpenCreateModal}
          canShare={isAuthenticated}
          onRequestLogin={onRequestLogin}
        />

        <LibraryFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          departments={departments}
          semesters={semesters}
          subjects={subjects}
          inputClass={inputClass}
          labelClass={labelClass}
        />

        {loading ? (
          <LibrarySkeleton count={6} />
        ) : resources.length === 0 ? (
          <LibraryEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((res) => (
              <LibraryResourceCard
                key={res.id}
                res={res}
                user={user}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        )}

        <FolderStructureGuide />
      </div>

      <LibraryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCreateSubmit={handleCreateSubmit}
        handleUpdateSubmit={handleUpdateSubmit}
        editingResource={editingResource}
        isSubmitting={isSubmitting}
        departments={departments}
        semesters={semesters}
        inputClass={inputClass}
        labelClass={labelClass}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resourceToDelete?.title || "this resource"}"? This action cannot be undone.`}
        confirmText="Delete Resource"
      />
    </div>
  );
}
