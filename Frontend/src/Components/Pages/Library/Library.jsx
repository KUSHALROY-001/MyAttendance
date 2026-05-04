import { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { FolderOpen } from "lucide-react";

// Subcomponents
import LibraryHeader from "./components/LibraryHeader";
import LibraryFilters from "./components/LibraryFilters";
import LibraryResourceCard from "./components/LibraryResourceCard";
import LibraryModal from "./components/LibraryModal";

const inputClass =
  "block w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60";
const labelClass = "block text-xs font-medium text-slate-200";

export default function Library() {
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    subjectName: "",
  });

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.subjectName) params.append("subjectName", filters.subjectName);

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
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name !== "subjectName" && { subjectName: "" }),
    }));
  };

  const clearFilters = () => {
    setFilters({ department: "", semester: "", subjectName: "" });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Assuming user details are in localStorage or context, grabbing ID for now
    const userString = localStorage.getItem("user");
    let contributorId = 18;
    if (userString) {
      try {
        contributorId = JSON.parse(userString).id;
      } catch (e) {}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
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

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-700 rounded-2xl">
            <FolderOpen className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">
              No resources found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your filters or be the first to share!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
