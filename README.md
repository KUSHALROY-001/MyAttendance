# 🎓 MyAttendance — Enterprise Academic & Attendance Platform

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_6-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_Aiven-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://aiven.io/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

**MyAttendance** is a modern, multi-tenant, full-stack attendance management and academic workflow platform designed for educational institutions. It provides role-tailored dashboards and tools for **Students**, **Teachers**, **Institute Admins**, and **Super Admins**.

---

## 🌟 Key Features & Persona Workflows

### 🏢 Multi-Tenant Institution Architecture
- **Tenant Data Isolation:** Every academic institution operates within its own isolated data boundary (`instituteId`).
- **Domain Restricted Self-Signup:** Institutions can configure allowed email domains (e.g., `@college.edu`) for self-signup verification.
- **Admin Approval Queue:** Student self-signups enter a `PENDING` state until verified and approved by an institute admin.

### 🛡️ Hybrid Stateful JWT Authentication (`tokenVersion`)
- **Single-Device Active Session Enforcement:** Whenever a user logs into a new device/browser, their `tokenVersion` increments, immediately invalidating active tokens on older devices.
- **Secure Credentials:** Short-lived JWT Access Tokens combined with HttpOnly `SameSite=None` Refresh Cookies.
- **Role-Based Access Control (RBAC):** Strict protection across all API routes and frontend navigation boundaries.

### 👨‍🏫 Teacher Workspace
- **Live Attendance Session Flow:** Interactive per-class attendance taking with real-time present/absent counters.
- **Weekly Teaching Planner:** Automatically derived timetable schedule displaying daily period slots, class types (class/lab), and room numbers.
- **Session History & Analytics:** View past attendance sessions, modify recorded attendance, and track per-allocation submission history.

### 🎓 Student Portal
- **Subject-Wise Attendance Analytics:** Clear percentage calculations per course with visual status indicators.
- **Low-Attendance Alerts:** Automatic warning banners for subjects falling below the required institutional threshold (e.g. < 75%).
- **Section Class Routine:** Weekly period timetable grid tailored to the student's department, semester, and section.
- **Interactive Calendar & Logs:** Detailed session-by-session attendance history modal with status tags (Present, Absent, Late, Leave).

### 👑 Admin & Super Admin Management Console
- **Academic Options Management:** Configure institution-wide departments, semesters, sections, and subjects.
- **Resource Allocations:** Assign teachers to specific subject papers, departments, semesters, and sections.
- **Grid Timetable Builder:** Interactive period grid editor to construct weekly section routines.
- **Exportable Reports & Defaulter Tracking:** Identify low-attendance students across departments and export session summaries.

### 📚 Academic Resource Library
- **Community Study Materials:** Share Google Drive study resources, notes, and previous year questions.
- **Multilevel Filters:** Instantly filter study materials by Department, Semester, and Subject.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite 7, Tailwind CSS, React Router v7, Axios, Lucide React, React Hot Toast |
| **Backend** | Node.js (v22), Express 5, Prisma ORM 6, bcryptjs, JSONWebToken (JWT) |
| **Database** | MySQL (Hosted on Aiven Cloud with SSL TLS) |
| **Architecture** | RESTful API, Multi-tenant DB Schema, Hybrid Stateful JWT |
| **Deployment** | Render (Web Service for Backend + Static Site for Frontend) |

---

## 📂 Project Structure

```text
The_Attandence_Project/
├── Backend/
│   ├── controllers/         # Express route controllers (auth, admin, student, teacher, library)
│   ├── middlewares/         # Auth, RBAC, error handling, and tenant validation
│   ├── prisma/
│   │   ├── schema.prisma    # Multi-tenant Prisma database schema
│   │   └── seed.js          # Initial database seeder script
│   ├── routes/              # Express API endpoints
│   ├── utils/               # JWT helpers, cookie options, async handlers, API errors
│   ├── app.js               # Express application entry point & CORS configuration
│   └── prisma.config.ts     # Prisma CLI configuration file
├── Frontend/
│   ├── src/
│   │   ├── api/             # Axios instance with auth interceptors & refresh handling
│   │   ├── components/      # Modular UI components (auth, admin, student, teacher, common)
│   │   ├── contexts/        # ThemeContext & AuthContext state providers
│   │   ├── hooks/           # Custom React data fetching & state hooks
│   │   ├── pages/           # Application views and dashboard layouts
│   │   └── App.jsx          # React Router route hierarchy & error boundary
│   └── vite.config.js       # Vite build & local dev proxy configuration
└── README.md
```

---

## 🔑 Demo Test Credentials

You can test the live application using the pre-configured demo accounts below:

| Role | Email | Password | Scope / Experience |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `harry@college.edu` | `password123` | Student dashboard, subject attendance, class routine |
| 👨‍🏫 **Teacher** | `snape@college.edu` | `password123` | Live attendance taking, weekly planner, past sessions |
| 👑 **Admin** | `admin@college.edu` | `password123` | Course allocation, timetable grid, defaulter reports |
| ⚡ **Super Admin** | `superadmin@platform.com` | `Password123` | Full institution management & academic options |

---

## ⚙️ Environment Variables Reference

### Backend (`Backend/.env`)

```env
# Database Connection (Aiven MySQL / Localhost)
DATABASE_URL="mysql://username:password@hostname:27490/defaultdb?ssl-mode=REQUIRED"

# Server Port & Environment
PORT=5000
NODE_ENV=development # Set to "production" on Render

# Security & CORS
FRONTEND_URL="http://localhost:5173" # Comma-separated list for production URLs

# JWT Authentication Secrets
ACCESS_TOKEN_SECRET="your_strong_access_token_secret_key"
REFRESH_TOKEN_SECRET="your_strong_refresh_token_secret_key"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

### Frontend (`Frontend/.env`)

```env
# Base URL for API requests (Leave empty in local dev to use Vite proxy)
VITE_API_BASE_URL="https://your-backend-service.onrender.com"
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KUSHALROY-001/MyAttendance.git
cd MyAttendance
```

### 2. Setup & Start Backend
```bash
cd Backend
npm install

# Run database migrations & seed demo data
npx prisma generate
npx prisma db push
node prisma/seed.js

# Start local backend server
npm run dev
```

### 3. Setup & Start Frontend
```bash
cd ../Frontend
npm install

# Start local Vite dev server
npm run dev
```

The application will be accessible locally at `http://localhost:5173` with API requests proxied to `http://localhost:5000`.

---

## 📐 Entity Relationship (ER) Diagram

```mermaid
erDiagram
    Institute ||--o{ User : "has accounts"
    Institute ||--o{ Student : "has students"
    Institute ||--o{ Teacher : "has teachers"
    Institute ||--o{ DepartmentInfo : "has departments"
    Institute ||--o{ Course : "offers courses"
    Institute ||--o{ CourseAllocation : "manages allocations"
    Institute ||--o{ ClassTimetable : "defines timetables"
    Institute ||--o{ LibraryResource : "hosts resources"

    User ||--o| Student : "has profile (1:1)"
    User ||--o| Teacher : "has profile (1:1)"
    User ||--o{ LibraryResource : "contributes"

    Student }o--o{ Course : "enrolls via StudentCourse (N:M)"
    Student ||--o{ AttendanceRecord : "has records"
    Student ||--o{ StudentAttendanceStat : "has stats"

    Teacher ||--o{ CourseAllocation : "assigned to"
    Teacher ||--o{ TeacherSchedule : "has slots"

    Course ||--o{ StudentCourse : "enrollments"
    Course ||--o{ CourseAllocation : "allocated via"
    Course ||--o{ StudentAttendanceStat : "stats for"

    CourseAllocation ||--o{ AttendanceSession : "has sessions"
    CourseAllocation ||--o{ ClassScheduleEntry : "appears in"
    CourseAllocation ||--o{ TeacherSchedule : "referenced by"

    AttendanceSession ||--o{ AttendanceRecord : "contains"
    ClassTimetable ||--o{ ClassScheduleEntry : "has entries"
```

---

## 🗃️ Database Schema & Relationship Reference Table

| Model / Entity | Primary Key (PK) | Foreign Keys (FK) | Relationships & Cardinality | Purpose & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **`Institute`** | `id` | None | • `1:N` with `User`, `Student`, `Teacher`, `DepartmentInfo`, `Course`, `CourseAllocation`, `ClassTimetable`, `LibraryResource` | Central tenant entity. Unique constraint on `code`. |
| **`User`** | `id` | `instituteId` ➔ `Institute` | • `1:1` optional with `Student`<br>• `1:1` optional with `Teacher`<br>• `1:N` with `LibraryResource`<br>• Self-relation `1:N` for created/updated audit trails | Auth entity for all logins. Unique `email`. Hybrid stateful `tokenVersion`. |
| **`Student`** | `id` | `userId` ➔ `User`<br>`instituteId` ➔ `Institute` | • `1:1` with `User`<br>• `N:M` with `Course` (via `StudentCourse`)<br>• `1:N` with `AttendanceRecord`<br>• `1:N` with `StudentAttendanceStat` | Student profile details. Unique `rollNumber` and `enrollmentNumber` per institute. |
| **`Teacher`** | `id` | `userId` ➔ `User`<br>`instituteId` ➔ `Institute` | • `1:1` with `User`<br>• `1:N` with `CourseAllocation`<br>• `1:N` with `TeacherSchedule` | Teacher profile details. Unique `employeeId` per institute. |
| **`DepartmentInfo`** | `id` | `instituteId` ➔ `Institute` | • Belongs to `Institute` (`N:1`) | Department metadata & JSON `semesterDetails`. Unique `[instituteId, code]`. |
| **`Course`** | `id` | `instituteId` ➔ `Institute` | • `1:N` with `StudentCourse`<br>• `1:N` with `CourseAllocation`<br>• `1:N` with `StudentAttendanceStat` | Subject/paper catalog. Unique `[instituteId, code]`. |
| **`StudentCourse`** | Composite `[studentId, courseId]` | `studentId` ➔ `Student`<br>`courseId` ➔ `Course` | • Join table for `Student` ↔ `Course` (`N:M`) | Prevents duplicate student course enrollments. |
| **`CourseAllocation`** | `id` | `instituteId` ➔ `Institute`<br>`teacherId` ➔ `Teacher`<br>`courseId` ➔ `Course` | • `1:N` with `AttendanceSession`<br>• `1:N` with `ClassScheduleEntry`<br>• `1:N` with `TeacherSchedule` | Maps teacher to course, department, semester, and section. Unique `[teacherId, courseId, department, semester, section]`. |
| **`ClassTimetable`** | `id` | `instituteId` ➔ `Institute` | • `1:N` with `ClassScheduleEntry` | Period time definitions per department, semester, and section. |
| **`ClassScheduleEntry`** | `id` | `classTimetableId` ➔ `ClassTimetable`<br>`courseAllocationId` ➔ `CourseAllocation` | • Belongs to `ClassTimetable` & `CourseAllocation` | Individual cell in timetable grid. Unique `[classTimetableId, periodNumber, day]`. |
| **`TeacherSchedule`** | `id` | `teacherId` ➔ `Teacher`<br>`courseAllocationId` ➔ `CourseAllocation` | • Belongs to `Teacher` & `CourseAllocation` | Personal slot schedule for teachers. |
| **`AttendanceSession`** | `id` | `courseAllocationId` ➔ `CourseAllocation` | • `1:N` with `AttendanceRecord` | Single class attendance session header. Unique `[courseAllocationId, date]`. |
| **`AttendanceRecord`** | `id` | `sessionId` ➔ `AttendanceSession`<br>`studentId` ➔ `Student` | • Belongs to `AttendanceSession` & `Student` | Per-student attendance status (`PRESENT`, `ABSENT`, `LATE`, `LEAVE`). Unique `[sessionId, studentId]`. |
| **`StudentAttendanceStat`** | `id` | `studentId` ➔ `Student`<br>`courseId` ➔ `Course` | • Belongs to `Student` & `Course` | Cached live attendance summary (`totalSessions`, `totalAttended`). Unique `[studentId, courseId]`. |
| **`LibraryResource`** | `id` | `instituteId` ➔ `Institute`<br>`contributorId` ➔ `User` | • Belongs to `Institute` & `User` | User-contributed Google Drive study resource links. |

---

## 📄 License & Author

Built with ❤️ by **[Kushal](https://github.com/KUSHALROY-001)**.  
Licensed under the [ISC License](LICENSE).

