import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PencilLine, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import LoadingAnimation from "../UI/LoadingAnimation";
import { useAuth } from "../../contexts/AuthContext";

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#19191D] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#151518] transition-colors";

const labelClass =
  "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

const Required = () => <span className="ml-1 text-rose-500">*</span>;

const getInitialForm = (profile) => ({
  name: profile?.name || "",
  email: profile?.email || "",
  rollNumber: profile?.student?.rollNumber || "",
  department:
    profile?.student?.department || profile?.teacher?.department || "",
  semester: profile?.student?.semester?.toString() || "",
  section: profile?.student?.section || "",
  batch: profile?.student?.batch || "",
  contactNumber:
    profile?.student?.contactNumber || profile?.teacher?.contactNumber || "",
  employeeId: profile?.teacher?.employeeId || "",
  designation: profile?.teacher?.designation || "",
});

function EditProfile() {
  const navigate = useNavigate();
  const { user, refreshCurrentUser, getDefaultRouteForRole } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(getInitialForm(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [academicOptions, setAcademicOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, academicRes] = await Promise.all([
          api.get("/api/auth/profile", { hideGlobalToast: true }),
          api.get("/api/auth/academic-options", { hideGlobalToast: true }),
        ]);

        const nextProfile = profileRes.data?.profile || null;
        setProfile(nextProfile);
        setFormData(getInitialForm(nextProfile));

        const depts = academicRes.data?.departments || [];
        setAcademicOptions(depts);
      } catch (_error) {
        toast.error("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const role = profile?.role || user?.role || "STUDENT";
  const dashboardPath = useMemo(() => {
    if (role === "ADMIN") return "/admin";
    return getDefaultRouteForRole(role);
  }, [getDefaultRouteForRole, role]);

  const currentDeptObj = useMemo(() => {
    return academicOptions.find((d) => d.code === formData.department);
  }, [academicOptions, formData.department]);

  const availableSemesters = useMemo(() => {
    if (!currentDeptObj || !currentDeptObj.semesterDetails) return [];
    return currentDeptObj.semesterDetails.map((detail) => detail.semester);
  }, [currentDeptObj]);

  const currentSemObj = useMemo(() => {
    if (!currentDeptObj || !currentDeptObj.semesterDetails) return null;
    return currentDeptObj.semesterDetails.find(
      (detail) => String(detail.semester) === String(formData.semester),
    );
  }, [currentDeptObj, formData.semester]);

  const availableSections = useMemo(() => {
    if (!currentSemObj || !currentSemObj.sections) return [];
    return currentSemObj.sections;
  }, [currentSemObj]);

  const handleDeptChange = (event) => {
    const nextDeptCode = event.target.value;
    const deptObj = academicOptions.find((d) => d.code === nextDeptCode);
    const sems = deptObj?.semesterDetails || [];
    const nextSem = sems.length > 0 ? String(sems[0].semester) : "";
    const secs = sems.length > 0 ? sems[0].sections || [] : [];
    const nextSec = secs.length > 0 ? secs[0] : "";

    setFormData((current) => ({
      ...current,
      department: nextDeptCode,
      semester: nextSem,
      section: nextSec,
    }));
  };

  const handleSemChange = (event) => {
    const nextSemStr = event.target.value;
    const semObj = currentDeptObj?.semesterDetails?.find(
      (d) => String(d.semester) === String(nextSemStr),
    );
    const secs = semObj?.sections || [];
    const nextSec = secs.length > 0 ? secs[0] : "";

    setFormData((current) => ({
      ...current,
      semester: nextSemStr,
      section: nextSec,
    }));
  };

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      await api.put(
        "/api/auth/profile",
        {
          ...formData,
          semester:
            role === "STUDENT" ? Number(formData.semester || 0) : undefined,
        },
        {
          hideAuthRedirect: true,
        },
      );
      await refreshCurrentUser();
      toast.success("Profile updated successfully.");
      navigate(dashboardPath);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edit and update your account details.
          </p>
        </div>

        <Link
          to={dashboardPath}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#151518] dark:text-slate-300 dark:hover:bg-[#1E1E26]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelClass}>
              Full Name
              <Required />
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={updateField("name")}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className={labelClass}>
              Email
              <Required />
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={updateField("email")}
              required
              className={inputClass}
            />
          </div>

          {role === "STUDENT" ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor="rollNumber" className={labelClass}>
                  Roll Number
                  <Required />
                </label>
                <input
                  id="rollNumber"
                  value={formData.rollNumber}
                  onChange={updateField("rollNumber")}
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="department" className={labelClass}>
                  Department
                  <Required />
                </label>
                {academicOptions.length > 0 ? (
                  <select
                    id="department"
                    value={formData.department}
                    onChange={handleDeptChange}
                    required
                    className={inputClass}
                  >
                    {academicOptions.map((dept) => (
                      <option key={dept.code} value={dept.code}>
                        {dept.code} {dept.name ? `- ${dept.name}` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="department"
                    value={formData.department}
                    onChange={updateField("department")}
                    required
                    className={inputClass}
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="semester" className={labelClass}>
                  Semester
                  <Required />
                </label>
                {availableSemesters.length > 0 ? (
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={handleSemChange}
                    required
                    className={inputClass}
                  >
                    {availableSemesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="semester"
                    type="number"
                    min="1"
                    value={formData.semester}
                    onChange={updateField("semester")}
                    required
                    className={inputClass}
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="section" className={labelClass}>
                  Section
                  <Required />
                </label>
                {availableSections.length > 0 ? (
                  <select
                    id="section"
                    value={formData.section}
                    onChange={updateField("section")}
                    required
                    className={inputClass}
                  >
                    {availableSections.map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="section"
                    value={formData.section}
                    onChange={updateField("section")}
                    required
                    className={inputClass}
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="batch" className={labelClass}>
                  Batch
                  <Required />
                </label>
                <input
                  id="batch"
                  value={formData.batch}
                  onChange={updateField("batch")}
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contactNumber" className={labelClass}>
                  Contact Number
                  <Required />
                </label>
                <input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={updateField("contactNumber")}
                  required
                  className={inputClass}
                />
              </div>
            </>
          ) : null}

          {role === "TEACHER" ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor="employeeId" className={labelClass}>
                  Employee ID
                  <Required />
                </label>
                <input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={updateField("employeeId")}
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="teacherDepartment" className={labelClass}>
                  Department
                  <Required />
                </label>
                <input
                  id="teacherDepartment"
                  value={formData.department}
                  onChange={updateField("department")}
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="designation" className={labelClass}>
                  Designation
                  <Required />
                </label>
                <input
                  id="designation"
                  value={formData.designation}
                  onChange={updateField("designation")}
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="teacherContactNumber" className={labelClass}>
                  Contact Number
                  <Required />
                </label>
                <input
                  id="teacherContactNumber"
                  value={formData.contactNumber}
                  onChange={updateField("contactNumber")}
                  required
                  className={inputClass}
                />
              </div>
            </>
          ) : null}

          <div className="md:col-span-2 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <PencilLine size={18} />
              </div>
              <p className="text-xs sm:text-sm">
                Your saved changes update your live account profile immediately.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
