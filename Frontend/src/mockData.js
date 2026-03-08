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