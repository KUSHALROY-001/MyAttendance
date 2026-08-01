import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { calculateLiveAttendanceStats } from "../utils/teacherHelpers";

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
