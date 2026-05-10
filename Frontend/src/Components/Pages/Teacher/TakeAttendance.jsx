import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import {
  BackArrowSVG,
  UsersSVG,
  CheckCircleSVG,
  XCircleSVG,
  MissingSVG,
} from "../../UI/SVG";
import LoadingAnimation from "../../UI/LoadingAnimation";
import PremiumErrorState from "../../UI/PremiumErrorState";
import StatCard from "../../UI/StatCard";

const TakeAttendance = () => {
  const { allocationId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(
          `/api/teacher/attendance/live/${allocationId}`,
        );
        setData(res.data);

        const savedMarks = localStorage.getItem(`attendance_${allocationId}`);
        if (savedMarks) {
          setAttendance(JSON.parse(savedMarks));
        } else {
          const initialAttendance = {};
          res.data.students.forEach((student) => {
            initialAttendance[student.id] = "Present";
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
    const nextAttendance = {};
    data.students.forEach((student) => {
      nextAttendance[student.id] = status;
    });
    setAttendance(nextAttendance);
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
      navigate("/teacher");
    } catch (err) {
      console.error(err);
      alert("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!data) {
    return (
      <PremiumErrorState
        title="Class Roster Not Found"
        message="We couldn't locate the class roster for this session."
        errorCode="404"
      />
    );
  }

  const { allocation, students } = data;
  const stats = {
    total: students.length,
    present: Object.values(attendance).filter((value) => value === "Present")
      .length,
    absent: Object.values(attendance).filter((value) => value === "Absent")
      .length,
    late: Object.values(attendance).filter((value) => value === "Late").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 pb-28 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <BackArrowSVG className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {allocation.course?.name || "Unknown Subject"}
                </h1>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  Live
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
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
              className="rounded-lg border-2 border-red-100 px-2 md:px-5 py-1.5 md:py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
            >
              Cancel
            </button>
            <button
              disabled={saving || students.length === 0}
              onClick={handleSave}
              className={`flex items-center gap-2 rounded-lg px-2.5 md:px-6 py-1.5 md:py-2.5 text-sm font-black text-white transition ${
                saving
                  ? "cursor-not-allowed bg-emerald-300"
                  : "bg-emerald-600 shadow-sm hover:bg-emerald-700"
              }`}
            >
              {saving ? "Saving..." : "Submit Session"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total"
            value={stats.total}
            icon={
              <UsersSVG className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            }
            iconBg="bg-slate-50 dark:bg-slate-800"
          />

          <StatCard
            title="Present"
            value={stats.present}
            icon={
              <CheckCircleSVG className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
            }
            iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          />

          <StatCard
            title="Absent"
            value={stats.absent}
            icon={
              <XCircleSVG className="h-5 w-5 text-red-500 dark:text-red-300" />
            }
            iconBg="bg-red-50 dark:bg-red-500/10"
          />

          <StatCard
            title="Absent"
            value={stats.absent}
            icon={
              <MissingSVG className="h-5 w-5 text-amber-500 dark:text-amber-300" />
            }
            iconBg="bg-amber-50 dark:bg-amber-500/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => handleMarkAll("Present")}
            className="rounded-lg border-2 max-sm:w-full border-emerald-100 px-4 py-2 text-sm font-bold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll("Absent")}
            className="rounded-lg border-2 max-sm:w-full border-red-100 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
          >
            Mark All Absent
          </button>
          <button
            onClick={() => handleMarkAll("Late")}
            className="rounded-lg border-2 max-sm:w-full border-amber-100 px-4 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-50 dark:border-amber-500/20 dark:hover:bg-amber-500/10"
          >
            Mark All Late
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Student Attendance List
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => {
              const status = attendance[student.id];

              let cardBg = "bg-white dark:bg-slate-900";
              if (status === "Present") {
                cardBg = "bg-emerald-50/30 dark:bg-emerald-500/10";
              }
              if (status === "Absent") {
                cardBg = "bg-red-50/30 dark:bg-red-500/10";
              }
              if (status === "Late") {
                cardBg = "bg-amber-50/30 dark:bg-amber-500/10";
              }

              return (
                <div
                  key={student.id}
                  className={`flex flex-col justify-between px-2 md:px-6 py-2 md:py-4 transition-colors sm:flex-row sm:items-center ${cardBg}`}
                >
                  <div className="mb-4 flex items-center space-x-4 sm:mb-0">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-800"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {student.name}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {student.rollNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition ${
                        status === "Present"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
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
                        className={`h-3 w-3 rounded-full border-[3px] transition-colors ${
                          status === "Present"
                            ? "border-emerald-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      ></div>
                      Present
                    </label>
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition ${
                        status === "Late"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                          : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
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
                        className={`h-3 w-3 rounded-full border-[3px] transition-colors ${
                          status === "Late"
                            ? "border-amber-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      ></div>
                      Late
                    </label>
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition ${
                        status === "Absent"
                          ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                          : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
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
                        className={`h-3 w-3 rounded-full border-[3px] transition-colors ${
                          status === "Absent"
                            ? "border-red-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      ></div>
                      Absent
                    </label>
                  </div>
                </div>
              );
            })}

            {students.length === 0 && (
              <div className="p-8 text-center">
                <p className="font-medium text-slate-500 dark:text-slate-400">
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
