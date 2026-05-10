import { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { FolderOpen } from "lucide-react";
import LibraryHeader from "./components/LibraryHeader";
import LibraryFilters from "./components/LibraryFilters";
import LibraryResourceCard from "./components/LibraryResourceCard";
import LibraryModal from "./components/LibraryModal";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500";
const labelClass =
  "block text-xs font-medium text-slate-700 dark:text-slate-200";

export default function Library() {
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    department: "BCA",
    semester: "1",
    subjectName: "",
  });

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.subjectName)
        params.append("subjectName", filters.subjectName);

      const response = await api.get(`/api/library?${params.toString()}`);
      setResources(response.data.resources || []);
      setDepartments(response.data.filters?.departments || []);
      setSemesters(response.data.filters?.semesters || []);
      setSubjects(response.data.filters?.subjects || []);
    } catch (error) {
      console.error("Error fetching library", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [filters.department, filters.semester, filters.subjectName]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      if (name === "department") {
        return {
          ...prev,
          department: value,
          semester: "",
          subjectName: "",
        };
      }

      if (name === "semester") {
        return {
          ...prev,
          semester: value,
          subjectName: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const clearFilters = () => {
    setFilters({ department: "", semester: "", subjectName: "" });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const userString = localStorage.getItem("user");
    let contributorId = 18;
    if (userString) {
      try {
        contributorId = JSON.parse(userString).id;
      } catch (_error) {}
    }

    try {
      setIsSubmitting(true);
      await api.post("/api/library", {
        ...data,
        contributorId,
      });
      toast.success("Resource shared successfully!");
      setIsModalOpen(false);
      fetchLibrary();
    } catch (error) {
      console.error("Error creating resource", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-10 text-slate-900 transition-colors dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <LibraryHeader setIsModalOpen={setIsModalOpen} />

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
          <div className="rounded-2xl border border-slate-200 bg-white/80 py-20 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">
              No resources found
            </h3>
            <p className="mt-1 text-slate-500 dark:text-slate-500">
              Try adjusting your filters or be the first to share!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((res) => (
              <LibraryResourceCard key={res.id} res={res} />
            ))}
          </div>
        )}
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
