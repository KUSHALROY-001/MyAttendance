import React from "react";
import LibraryHeader from "../components/library/LibraryHeader";
import LibraryFilters from "../components/library/LibraryFilters";
import LibraryResourceCard from "../components/library/LibraryResourceCard";
import LibraryModal from "../components/library/LibraryModal";
import LibraryEmptyState from "../components/library/LibraryEmptyState";
import FolderStructureGuide from "../components/library/FolderStructureGuide";
import useLibrary, { inputClass, labelClass } from "../hooks/useLibrary";

export default function Library() {
  const {
    isAuthenticated,
    resources,
    departments,
    semesters,
    subjects,
    loading,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    filters,
    handleFilterChange,
    clearFilters,
    handleCreateSubmit,
    onRequestLogin,
  } = useLibrary();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 transition-colors dark:bg-[#0D0D0F] dark:text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <LibraryHeader
          setIsModalOpen={setIsModalOpen}
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
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <LibraryEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((res) => (
              <LibraryResourceCard key={res.id} res={res} />
            ))}
          </div>
        )}

        <FolderStructureGuide />
      </div>

      <LibraryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCreateSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
        departments={departments}
        semesters={semesters}
        inputClass={inputClass}
        labelClass={labelClass}
      />
    </div>
  );
}
