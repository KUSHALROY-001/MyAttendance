import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { calculateLiveAttendanceStats } from "../utils/teacherHelpers";

const getLocalDateKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const getLocalDayStart = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

// Drafts are stored as { date, marks }. Anything else (older flat-map drafts,
// or a draft from a previous day) is ignored so it can't hide today's pre-fill.
const readTodaysDraft = (key) => {
  try {
    const draft = JSON.parse(localStorage.getItem(key));
    if (draft?.date === getLocalDateKey() && draft.marks) {
      return draft.marks;
    }
  } catch {
    // corrupt draft - fall through
  }
  return null;
};

export const useTakeAttendance = () => {
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
          { params: { dayStart: getLocalDayStart().toISOString() } },
        );
        setData(res.data);

        const savedMarks = readTodaysDraft(`attendance_${allocationId}`);
        if (savedMarks) {
          setAttendance(savedMarks);
        } else {
          // Pre-fill from each student's previous class today (any subject);
          // students with no earlier class today default to Present.
          const initialAttendance = {};
          res.data.students.forEach((student) => {
            initialAttendance[student.id] =
              student.suggestedStatus || "Present";
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
        JSON.stringify({ date: getLocalDateKey(), marks: attendance }),
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

  const handleCancel = () => {
    localStorage.removeItem("activeSession");
    localStorage.removeItem(`attendance_${allocationId}`);
    navigate("/teacher");
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

  const setStudentStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const students = data?.students || [];
  const allocation = data?.allocation || null;

  const stats = useMemo(
    () => calculateLiveAttendanceStats(attendance, students.length),
    [attendance, students.length],
  );

  return {
    allocationId,
    data,
    allocation,
    students,
    loading,
    attendance,
    saving,
    stats,
    navigate,
    handleMarkAll,
    handleCancel,
    handleSave,
    setStudentStatus,
  };
};

export default useTakeAttendance;
