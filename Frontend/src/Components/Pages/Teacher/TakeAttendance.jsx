import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TakeAttendance = () => {
  const { allocationId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({}); // { studentId: "Present" | "Absent" | "Late" }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(
          `/api/teacher/attendance/live/${allocationId}`,
        );
        setData(res.data);

        // Try to rehydrate saved marks from a previous visit
        const savedMarks = localStorage.getItem(`attendance_${allocationId}`);
        if (savedMarks) {
          setAttendance(JSON.parse(savedMarks));
        } else {
          // Default everyone to present on a fresh session
          const initialAttendance = {};
          res.data.students.forEach((s) => {
            initialAttendance[s.id] = "Present";
          });
          setAttendance(initialAttendance);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [allocationId]);

  // Auto-save marks to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(attendance).length > 0) {
      localStorage.setItem(
        `attendance_${allocationId}`,
        JSON.stringify(attendance),
      );
    }
  }, [attendance, allocationId]);

  const handleMarkAll = (status) => {
    if (!data) return;
    const newAtt = {};
    data.students.forEach((s) => {
      newAtt[s.id] = status;
    });
    setAttendance(newAtt);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const records = Object.keys(attendance).map((studentId) => ({
        student: studentId,
        status: attendance[studentId],
      }));

      await axios.post("/api/teacher/attendance/submit", {
        courseAllocationId: allocationId,
        date: new Date(),
        records,
      });

      localStorage.removeItem("activeSession");
      localStorage.removeItem(`attendance_${allocationId}`);
      // Navigate back to dashboard on success
      navigate("/teacher");
    } catch (err) {
      console.error(err);
      alert("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 pb-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 pb-20">
        <p className="text-xl font-bold text-gray-500">
          Class Roster Not Found
        </p>
      </div>
    );
  }

  const { allocation, students } = data;

  const stats = {
    total: students.length,
    present: Object.values(attendance).filter((v) => v === "Present").length,
    absent: Object.values(attendance).filter((v) => v === "Absent").length,
    late: Object.values(attendance).filter((v) => v === "Late").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200 transition shrink-0"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {allocation.course?.name || "Unknown Subject"}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700">
                  Live
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-500 mt-1">
                {allocation.course?.code || "N/A"} •{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("activeSession");
                localStorage.removeItem(`attendance_${allocationId}`);
                navigate("/teacher");
              }}
              className="px-5 py-2.5 rounded-lg border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 transition"
            >
              Cancel
            </button>
            <button
              disabled={saving || students.length === 0}
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-lg font-black text-sm flex items-center gap-2 transition ${saving ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-sm"} text-white`}
            >
              {saving ? "Saving..." : "Submit Session"}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">
                {stats.total}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Total
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-600">
                {stats.present}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Present
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-red-600">
                {stats.absent}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Absent
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-600">
                {stats.late}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Late
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 items-center pt-2">
          <button
            onClick={() => handleMarkAll("Present")}
            className="px-4 py-2 rounded-lg border-2 border-emerald-100 text-emerald-600 text-sm font-bold hover:bg-emerald-50 transition"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll("Absent")}
            className="px-4 py-2 rounded-lg border-2 border-red-100 text-red-600 text-sm font-bold hover:bg-red-50 transition"
          >
            Mark All Absent
          </button>
          <button
            onClick={() => handleMarkAll("Late")}
            className="px-4 py-2 rounded-lg border-2 border-amber-100 text-amber-600 text-sm font-bold hover:bg-amber-50 transition"
          >
            Mark All Late
          </button>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900">
              Student Attendance List
            </h3>
          </div>

          <div className="divide-y divide-gray-50">
            {students.map((student) => {
              const status = attendance[student.id];

              let cardBg = "bg-white";
              if (status === "Present") cardBg = "bg-emerald-50/30";
              if (status === "Absent") cardBg = "bg-red-50/30";
              if (status === "Late") cardBg = "bg-amber-50/30";

              return (
                <div
                  key={student.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 transition-colors ${cardBg}`}
                >
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                        {student.rollNumber}
                      </p>
                    </div>
                  </div>

                  {/* Radio Group manually styled */}
                  <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm shrink-0 self-start sm:self-auto">
                    <label
                      className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${status === "Present" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        name={`status-${student.id}`}
                        className="hidden"
                        checked={status === "Present"}
                        onChange={() =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.id]: "Present",
                          }))
                        }
                      />
                      <div
                        className={`w-3 h-3 rounded-full border-[3px] transition-colors ${status === "Present" ? "border-emerald-500" : "border-gray-300"}`}
                      ></div>
                      Present
                    </label>
                    <label
                      className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${status === "Late" ? "bg-amber-100 text-amber-700" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        name={`status-${student.id}`}
                        className="hidden"
                        checked={status === "Late"}
                        onChange={() =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.id]: "Late",
                          }))
                        }
                      />
                      <div
                        className={`w-3 h-3 rounded-full border-[3px] transition-colors ${status === "Late" ? "border-amber-500" : "border-gray-300"}`}
                      ></div>
                      Late
                    </label>
                    <label
                      className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${status === "Absent" ? "bg-red-100 text-red-700" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        name={`status-${student.id}`}
                        className="hidden"
                        checked={status === "Absent"}
                        onChange={() =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.id]: "Absent",
                          }))
                        }
                      />
                      <div
                        className={`w-3 h-3 rounded-full border-[3px] transition-colors ${status === "Absent" ? "border-red-500" : "border-gray-300"}`}
                      ></div>
                      Absent
                    </label>
                  </div>
                </div>
              );
            })}

            {students.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 font-medium">
                  No students found matching this class section.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
