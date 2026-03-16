// Mock Data for Attendance System

export const MOCK_TEACHER = {
  id: 't1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@college.edu',
  role: 'TEACHER',
  avatar: 'https://picsum.photos/seed/sarah/200'
};

export const MOCK_STUDENT = {
  id: 's1',
  name: 'Alex Johnson',
  email: 'alex.j@student.edu',
  role: 'STUDENT',
  avatar: 'https://picsum.photos/seed/alex/200'
};

export const MOCK_COURSES = [
  { id: 'c1', code: 'CS101', name: 'Computer Architecture', teacherId: 't1', studentIds: ['s1', 's2', 's3'] },
  { id: 'c2', code: 'CS202', name: 'Data Structures', teacherId: 't1', studentIds: ['s1', 's4', 's5'] },
  { id: 'c3', code: 'MATH301', name: 'Discrete Mathematics', teacherId: 't2', studentIds: ['s1', 's2'] }
];

// Generate more realistic records for the current month
const generateMockAttendance = () => {
  const records = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Create 4 periods per day for the last 15 days
  for (let i = 0; i < 15; i++) {
    const date = new Date(currentYear, currentMonth, today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    for (let period = 1; period <= 4; period++) {
      const rand = Math.random();
      let status = 'PRESENT';
      if (rand < 0.15) status = 'ABSENT';
      if (rand > 0.85) continue; // Skip some periods entirely

      records.push({
        id: `rec-${dateStr}-${period}`,
        courseId: `c${(period % 3) + 1}`,
        studentId: 's1',
        date: dateStr,
        status: status,
        sessionId: `sess-${period}` // Using sessionId to represent the period (1-4)
      });
    }
  }
  return records;
};

export const MOCK_ATTENDANCE = generateMockAttendance();

// --- Teacher Dashboard Mock Data ---
export const MOCK_TEACHER_SCHEDULE = [
  {
    id: "ts1",
    time: "11:30 AM - 01:00 PM",
    courseId: "c2",
    courseName: "Data Structure",
    section: "BCA SEM 2 Section B",
    room: "Room 101",
    type: "class"
  },
  {
    id: "ts2",
    time: "01:00 PM - 02:00 PM",
    courseId: "c2",
    courseName: "Data Structure",
    section: "BCA SEM 2 Section A",
    room: "Room 102",
    type: "class"
  },
  {
    id: "ts3",
    time: "02:00 PM - 02:50 PM",
    type: "free"
  },
  {
    id: "ts4",
    time: "02:50 PM - 03:40 PM",
    type: "free"
  },
  {
    id: "ts5",
    time: "03:40 PM - 04:30 PM",
    courseId: "l1",
    courseName: "Lab Session",
    section: "BCA SEM 2 Section B",
    room: "Lab 1",
    type: "lab"
  },
  {
    id: "ts6",
    time: "04:30 PM - 05:20 PM",
    type: "free"
  }
];

export const MOCK_TEACHER_TIMETABLE = {
  "11:30 AM - 01:00 PM": {
    "Monday": { name: "Data Structure", section: "BCA SEM 2 Section B", room: "Room 101", color: "bg-red-50" },
    "Wednesday": { name: "Data Structure", section: "BCA SEM 2 Section B", room: "Room 101", color: "bg-yellow-50" },
    "Friday": { name: "Data Structure", section: "BCA SEM 2 Section A", room: "Room 101", color: "bg-indigo-50" }
  },
  "01:00 PM - 02:00 PM": {
    "Monday": { name: "Data Structure", section: "BCA SEM 2 Section A", room: "Room 102", color: "bg-red-50" },
    "Thursday": { name: "Data Structure", section: "BCA SEM 2 Section B", room: "Room 101", color: "bg-green-50" },
    "Saturday": { name: "Tutorial", section: "BCA SEM 2 All Sections", room: "Room 201", color: "bg-purple-50" }
  },
  "02:00 PM - 02:50 PM": {
    "Tuesday": { name: "Data Structure", section: "BCA SEM 2 Section B", room: "Room 101", color: "bg-orange-50" },
    "Friday": { name: "Data Structure", section: "BCA SEM 2 Section B", room: "Room 103", color: "bg-indigo-50" }
  },
  "02:50 PM - 03:40 PM": {
    "Wednesday": { name: "Lab Session", section: "BCA SEM 2 Section A", room: "Lab 2", color: "bg-yellow-50", colSpan: 2 }
  },
  "03:40 PM - 04:30 PM": {
    "Monday": { name: "Lab Session", section: "BCA SEM 2 Section B", room: "Lab 1", color: "bg-red-50" },
    "Tuesday": { name: "Data Structure", section: "BCA SEM 2 Section A", room: "Room 103", color: "bg-orange-50" },
    "Friday": { name: "Lab Session", section: "Combined Lab", room: "Lab 1", color: "bg-indigo-50", colSpan: 2 }
  },
  "04:30 PM - 05:20 PM": {
    "Thursday": { name: "Data Structure", section: "BCA SEM 2 Section A", room: "Room 102", color: "bg-green-50" }
  }
};

export const MOCK_TEACHER_COURSES = [
  {
    id: "tc1",
    name: "Operating System",
    code: "CS202",
    department: "Computer Science",
    semester: "Sem 2",
    classesConducted: 0
  },
  {
    id: "tc2",
    name: "Data Structure",
    code: "CS201",
    department: "Computer Science",
    semester: "Sem 2",
    classesConducted: 5
  }
];