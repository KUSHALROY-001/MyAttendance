import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import {
  getDepartmentSemesters,
  getSemesterSections,
  filterSessionsBySearch,
  filterDefaultersBySearch,
  getUniqueOptions,
} from "../utils/adminHelpers";

export const useAdminReports = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [departments, setDepartments] = useState([]);
  const [dept, setDept] = useState("BCA");
  const [sem, setSem] = useState(1);
  const [sec, setSec] = useState("");
  const [sessionSearch, setSessionSearch] = useState("");
  const [filterSessionCourse, setFilterSessionCourse] = useState("");
  const [filterSessionTeacher, setFilterSessionTeacher] = useState("");
  const [filterSessionDate, setFilterSessionDate] = useState("");
  const [defaulterSearch, setDefaulterSearch] = useState("");
  const [filterDefaulterCourse, setFilterDefaulterCourse] = useState("");
  const [filterDefaulterDept, setFilterDefaulterDept] = useState("");
  const [sessions, setSessions] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [sessionDetailLoading, setSessionDetailLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/admin/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to load departments for admin reports.", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      const params = {};
      const sessionParams = {};
      if (dept) params.department = dept;
      if (sem) params.semester = sem;
      if (sec) params.section = sec;
      if (dept) sessionParams.department = dept;
      if (sem) sessionParams.semester = sem;
      if (sec) sessionParams.section = sec;
      if (filterSessionDate) sessionParams.date = filterSessionDate;

      try {
        const [sessionsRes, defaultersRes] = await Promise.all([
          api.get("/api/admin/reports/sessions", { params: sessionParams }),
          api.get("/api/admin/reports/defaulters", { params }),
        ]);

        setSessions(sessionsRes.data);
        setDefaulters(defaultersRes.data);
      } catch (error) {
        console.error("Failed to load admin report data.", error);
        setSessions([]);
        setDefaulters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dept, sem, sec, filterSessionDate]);

  const openSessionModal = async (session) => {
    setSelectedSession(session);
    setSessionDetail(null);
    setSessionDetailLoading(true);

    try {
      const res = await api.get(`/api/admin/reports/sessions/${session.id}`);
      setSessionDetail(res.data);
    } catch (error) {
      console.error("Failed to load session detail.", error);
      setSelectedSession(null);
    } finally {
      setSessionDetailLoading(false);
    }
  };

  const closeSessionModal = () => {
    setSelectedSession(null);
    setSessionDetail(null);
    setSessionDetailLoading(false);
  };

  const semOptions = getDepartmentSemesters(departments, dept);
  const secOptions = getSemesterSections(departments, dept, sem);

  const sessionCourseOptions = useMemo(
    () => getUniqueOptions(sessions, "course"),
    [sessions],
  );
  const sessionTeacherOptions = useMemo(
    () => getUniqueOptions(sessions, "teacher"),
    [sessions],
  );
  const defaulterCourseOptions = useMemo(
    () => getUniqueOptions(defaulters, "course"),
    [defaulters],
  );
  const defaulterDeptOptions = useMemo(
    () => getUniqueOptions(defaulters, "department"),
    [defaulters],
  );

  const filteredSessions = useMemo(
    () => filterSessionsBySearch(sessions, sessionSearch, filterSessionCourse, filterSessionTeacher),
    [sessions, sessionSearch, filterSessionCourse, filterSessionTeacher],
  );

  const filteredDefaulters = useMemo(
    () => filterDefaultersBySearch(defaulters, defaulterSearch, filterDefaulterCourse, filterDefaulterDept),
    [defaulters, defaulterSearch, filterDefaulterCourse, filterDefaulterDept],
  );

  return {
    activeTab,
    setActiveTab,
    departments,
    dept,
    setDept,
    sem,
    setSem,
    sec,
    setSec,
    sessionSearch,
    setSessionSearch,
    filterSessionCourse,
    setFilterSessionCourse,
    filterSessionTeacher,
    setFilterSessionTeacher,
    filterSessionDate,
    setFilterSessionDate,
    defaulterSearch,
    setDefaulterSearch,
    filterDefaulterCourse,
    setFilterDefaulterCourse,
    filterDefaulterDept,
    setFilterDefaulterDept,
    sessions,
    defaulters,
    loading,
    selectedSession,
    sessionDetail,
    sessionDetailLoading,
    semOptions,
    secOptions,
    sessionCourseOptions,
    sessionTeacherOptions,
    defaulterCourseOptions,
    defaulterDeptOptions,
    filteredSessions,
    filteredDefaulters,
    openSessionModal,
    closeSessionModal,
  };
};

export default useAdminReports;
