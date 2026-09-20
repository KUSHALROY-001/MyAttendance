# SonarQube Issues

Project: **KUSHALROY-001_MyAttendance**

Total issues: **199**

Generated: **2026-09-04 17:36:09**

---

## Summary

- **BLOCKER:** 2
- **CRITICAL:** 8
- **MAJOR:** 110
- **MINOR:** 79
- **INFO:** 0

### Issue Types

- **CODE_SMELL:** 173
- **BUG:** 17
- **VULNERABILITY:** 9

---

# BLOCKER Issues

Total: **2**

## BUG

### `Frontend/src/hooks/useCalendar.js`

- **javascript:S2189** - Line 26
  - Type: BUG
  - Message: 'dt' is not modified in this loop.
  - Estimated effort: 15min
  - Issue ID: AaBnz4vepPWvDdRwiRQw

- **javascript:S2189** - Line 26
  - Type: BUG
  - Message: 'endDate' is not modified in this loop.
  - Estimated effort: 15min
  - Issue ID: AaBnz4vepPWvDdRwiRQx

---

# CRITICAL Issues

Total: **8**

## BUG

### `Frontend/src/components/teacher/StartAttendanceModal.jsx`

- **javascript:S2871** - Line 17
  - Type: BUG
  - Message: Provide a compare function to avoid sorting elements alphabetically.
  - Estimated effort: 10min
  - Issue ID: AaBnz4uKpPWvDdRwiRQd

- **javascript:S2871** - Line 42
  - Type: BUG
  - Message: Provide a compare function to avoid sorting elements alphabetically.
  - Estimated effort: 10min
  - Issue ID: AaBnz4uKpPWvDdRwiRQe

## CODE_SMELL

### `Backend/controllers/admin/adminPromotions.controller.js`

- **javascript:S3776** - Line 229
  - Type: CODE_SMELL
  - Message: Refactor this function to reduce its Cognitive Complexity from 28 to the 15 allowed.
  - Estimated effort: 18min
  - Issue ID: AaBnz4z6pPWvDdRwiRRp

### `Backend/controllers/admin/adminStudents.controller.js`

- **javascript:S3776** - Line 552
  - Type: CODE_SMELL
  - Message: Refactor this function to reduce its Cognitive Complexity from 21 to the 15 allowed.
  - Estimated effort: 11min
  - Issue ID: AaBnz4zdpPWvDdRwiRRk

### `Backend/controllers/auth/authProfile.controller.js`

- **javascript:S3776** - Line 158
  - Type: CODE_SMELL
  - Message: Refactor this function to reduce its Cognitive Complexity from 16 to the 15 allowed.
  - Estimated effort: 6min
  - Issue ID: AaBnz40VpPWvDdRwiRRu

### `Backend/controllers/library.controller.js`

- **javascript:S3776** - Line 145
  - Type: CODE_SMELL
  - Message: Refactor this function to reduce its Cognitive Complexity from 16 to the 15 allowed.
  - Estimated effort: 6min
  - Issue ID: AaBnz40epPWvDdRwiRRz

### `Frontend/src/components/common/AttendanceSessionModal.jsx`

- **javascript:S3776** - Line 45
  - Type: CODE_SMELL
  - Message: Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed.
  - Estimated effort: 8min
  - Issue ID: AaBnz4t5pPWvDdRwiRQX

### `Frontend/src/components/student/RecentAttendanceList.jsx`

- **javascript:S3776** - Line 16
  - Type: CODE_SMELL
  - Message: Refactor this function to reduce its Cognitive Complexity from 26 to the 15 allowed.
  - Estimated effort: 16min
  - Issue ID: AaBnz4qjpPWvDdRwiRPY

---

# MAJOR Issues

Total: **110**

## CODE_SMELL

### `Backend/controllers/admin/adminReports.controller.js`

- **javascript:S1788** - Line 66
  - Type: CODE_SMELL
  - Message: Default parameters should be last.
  - Estimated effort: 20min
  - Issue ID: AaBnz4zmpPWvDdRwiRRl

### `Backend/controllers/admin/adminUsers.controller.js`

- **javascript:S3358** - Line 304
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4zwpPWvDdRwiRRo

- **javascript:S3358** - Line 101
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4zwpPWvDdRwiRRm

- **javascript:S3358** - Line 190
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4zwpPWvDdRwiRRn

### `Backend/isolation-test.js`

- **javascript:S4624** - Line 32
  - Type: CODE_SMELL
  - Message: Refactor this code to not use nested template literals.
  - Estimated effort: 10min
  - Issue ID: AaBnz41MpPWvDdRwiRSI

- **javascript:S1854** - Line 307
  - Type: CODE_SMELL
  - Message: Remove this useless assignment to variable "courseName".
  - Estimated effort: 1min
  - Issue ID: AaBnz41MpPWvDdRwiRSL

### `Backend/prisma/seed.js`

- **javascript:S1854** - Line 361
  - Type: CODE_SMELL
  - Message: Remove this useless assignment to variable "bcaSem1Courses".
  - Estimated effort: 1min
  - Issue ID: AaBnz41CpPWvDdRwiRSF

### `Backend/utils/auth.utils.js`

- **javascript:S3358** - Line 131
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4zKpPWvDdRwiRRi

### `Backend/utils/studentImport.js`

- **javascript:S8786** - Line 54
  - Type: CODE_SMELL
  - Message: Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking.
  - Estimated effort: 20min
  - Issue ID: AaBnz4zSpPWvDdRwiRRj

### `Frontend/src/api/axios.js`

- **javascript:S7746** - Line 126
  - Type: CODE_SMELL
  - Message: Prefer `throw error` over `return Promise.reject(error)`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4yDpPWvDdRwiRRZ

- **javascript:S7746** - Line 144
  - Type: CODE_SMELL
  - Message: Prefer `throw error` over `return Promise.reject(error)`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4yDpPWvDdRwiRRa

### `Frontend/src/components/admin/academic-options/DepartmentCard.jsx`

- **javascript:S6848** - Line 70
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPn

- **javascript:S6848** - Line 132
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPp

- **javascript:S6479** - Line 133
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPq

- **javascript:S6479** - Line 147
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPr

- **javascript:S6848** - Line 152
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPt

### `Frontend/src/components/admin/academic-options/DepartmentModal.jsx`

- **javascript:S6853** - Line 66
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4ropPWvDdRwiRPu

- **javascript:S6479** - Line 79
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4ropPWvDdRwiRPv

- **javascript:S6853** - Line 99
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4ropPWvDdRwiRPw

- **javascript:S6479** - Line 111
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4ropPWvDdRwiRPx

- **javascript:S3358** - Line 150
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4ropPWvDdRwiRPy

### `Frontend/src/components/admin/AdminModal.jsx`

- **javascript:S6848** - Line 26
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4shpPWvDdRwiRQD

### `Frontend/src/components/admin/AdminTable.jsx`

- **javascript:S6479** - Line 25
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4sppPWvDdRwiRQE

- **javascript:S6479** - Line 50
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4sppPWvDdRwiRQF

- **javascript:S6479** - Line 56
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4sppPWvDdRwiRQG

### `Frontend/src/components/admin/AssignSlotModal.jsx`

- **javascript:S6853** - Line 40
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sxpPWvDdRwiRQH

- **javascript:S6853** - Line 61
  - Type: CODE_SMELL
  - Message: A form label must have accessible text.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sxpPWvDdRwiRQI

- **javascript:S6853** - Line 90
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sxpPWvDdRwiRQJ

- **javascript:S6853** - Line 102
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sxpPWvDdRwiRQK

### `Frontend/src/components/admin/ConfirmDialog.jsx`

- **javascript:S3358** - Line 18
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sOpPWvDdRwiRP9

- **javascript:S3358** - Line 25
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sOpPWvDdRwiRP-

- **javascript:S6848** - Line 31
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sOpPWvDdRwiRQA

### `Frontend/src/components/admin/promotions/PromotionBatchDetailPanel.jsx`

- **javascript:S6848** - Line 9
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rWpPWvDdRwiRPk

- **javascript:S6479** - Line 75
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4rWpPWvDdRwiRPl

### `Frontend/src/components/admin/promotions/PromotionScopeHeader.jsx`

- **javascript:S6853** - Line 16
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rNpPWvDdRwiRPi

### `Frontend/src/components/admin/RecordDetailPanel.jsx`

- **javascript:S3358** - Line 161
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rypPWvDdRwiRP2

### `Frontend/src/components/admin/ReportsTabs.jsx`

- **javascript:S6772** - Line 26
  - Type: CODE_SMELL
  - Message: Ambiguous spacing before next element span
  - Estimated effort: 5min
  - Issue ID: AaBnz4s6pPWvDdRwiRQL

### `Frontend/src/components/admin/ScheduleGrid.jsx`

- **javascript:S6848** - Line 216
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4r8pPWvDdRwiRP4

- **javascript:S6848** - Line 246
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4r8pPWvDdRwiRP6

### `Frontend/src/components/admin/SessionsReportTable.jsx`

- **javascript:S6853** - Line 96
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4tCpPWvDdRwiRQM

- **javascript:S6478** - Line 114
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4tCpPWvDdRwiRQN

### `Frontend/src/components/admin/StudentImportModal.jsx`

- **javascript:S6848** - Line 70
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sFpPWvDdRwiRP8

### `Frontend/src/components/common/AttendanceSessionModal.jsx`

- **javascript:S3358** - Line 52
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4t5pPWvDdRwiRQY

### `Frontend/src/components/common/ClassRoutineTable.jsx`

- **javascript:S3358** - Line 148
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4twpPWvDdRwiRQW

### `Frontend/src/components/common/skeletons/AcademicOptionsSkeleton.jsx`

- **javascript:S6479** - Line 8
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tZpPWvDdRwiRQQ

### `Frontend/src/components/common/skeletons/CardGridSkeleton.jsx`

- **javascript:S6479** - Line 17
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tRpPWvDdRwiRQP

### `Frontend/src/components/common/skeletons/LibrarySkeleton.jsx`

- **javascript:S6479** - Line 9
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tgpPWvDdRwiRQR

### `Frontend/src/components/common/skeletons/PendingApprovalsSkeleton.jsx`

- **javascript:S6479** - Line 9
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tJpPWvDdRwiRQO

### `Frontend/src/components/common/skeletons/TableSkeleton.jsx`

- **javascript:S6479** - Line 24
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tnpPWvDdRwiRQS

- **javascript:S6479** - Line 33
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tnpPWvDdRwiRQT

- **javascript:S6479** - Line 35
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4tnpPWvDdRwiRQU

- **javascript:S3358** - Line 41
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4tnpPWvDdRwiRQV

### `Frontend/src/components/layout/Footer.jsx`

- **javascript:S6772** - Line 48
  - Type: CODE_SMELL
  - Message: Ambiguous spacing after previous element span
  - Estimated effort: 5min
  - Issue ID: AaBnz4urpPWvDdRwiRQo

### `Frontend/src/components/library/FolderStructureDiagram.jsx`

- **javascript:S6478** - Line 30
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qHpPWvDdRwiRPU

- **javascript:S6478** - Line 44
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qHpPWvDdRwiRPV

- **javascript:S6478** - Line 69
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qHpPWvDdRwiRPW

### `Frontend/src/components/library/LibraryFilters.jsx`

- **javascript:S6853** - Line 16
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4p7pPWvDdRwiRPR

- **javascript:S6853** - Line 32
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4p7pPWvDdRwiRPS

- **javascript:S6853** - Line 48
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4p7pPWvDdRwiRPT

### `Frontend/src/components/library/LibraryModal.jsx`

- **javascript:S3358** - Line 136
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPQ

- **javascript:S6853** - Line 42
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPK

- **javascript:S6853** - Line 53
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPL

- **javascript:S6853** - Line 64
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPM

- **javascript:S6853** - Line 81
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPN

- **javascript:S6853** - Line 98
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPO

- **javascript:S6853** - Line 110
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4prpPWvDdRwiRPP

### `Frontend/src/components/library/LibraryResourceCard.jsx`

- **javascript:S6848** - Line 47
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4mgpPWvDdRwiRPJ

### `Frontend/src/components/public/PublicVisuals.jsx`

- **javascript:S3358** - Line 94
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uapPWvDdRwiRQm

### `Frontend/src/components/public/ScreenSlider.jsx`

- **javascript:S6479** - Line 87
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4uipPWvDdRwiRQn

### `Frontend/src/components/student/AttendanceCalendar.jsx`

- **javascript:S6479** - Line 75
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4qapPWvDdRwiRPX

### `Frontend/src/components/student/QuickStats.jsx`

- **javascript:S6479** - Line 12
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4rEpPWvDdRwiRPh

### `Frontend/src/components/student/RecentAttendanceList.jsx`

- **javascript:S3358** - Line 26
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPZ

- **javascript:S3358** - Line 28
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPa

- **javascript:S3358** - Line 30
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPb

- **javascript:S3358** - Line 40
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPc

- **javascript:S3358** - Line 42
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPd

- **javascript:S3358** - Line 44
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPe

- **javascript:S3358** - Line 63
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPf

- **javascript:S3358** - Line 65
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4qjpPWvDdRwiRPg

### `Frontend/src/components/teacher/AttendanceSessions.jsx`

- **javascript:S3358** - Line 59
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uCpPWvDdRwiRQZ

- **javascript:S3358** - Line 107
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uCpPWvDdRwiRQb

- **javascript:S6772** - Line 69
  - Type: CODE_SMELL
  - Message: Ambiguous spacing after previous element span
  - Estimated effort: 5min
  - Issue ID: AaBnz4uCpPWvDdRwiRQa

- **javascript:S6479** - Line 111
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4uCpPWvDdRwiRQc

### `Frontend/src/components/teacher/SessionCard.jsx`

- **javascript:S6848** - Line 14
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uSpPWvDdRwiRQk

### `Frontend/src/components/teacher/StartAttendanceModal.jsx`

- **javascript:S6853** - Line 95
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uKpPWvDdRwiRQf

- **javascript:S6853** - Line 121
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uKpPWvDdRwiRQg

- **javascript:S6853** - Line 148
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uKpPWvDdRwiRQh

- **javascript:S6853** - Line 175
  - Type: CODE_SMELL
  - Message: A form label must be associated with a control.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uKpPWvDdRwiRQi

### `Frontend/src/contexts/ThemeContext.jsx`

- **javascript:S6481** - Line 38
  - Type: CODE_SMELL
  - Message: The object passed as the value prop to the Context provider changes every render. To fix this consider wrapping it in a useMemo hook.
  - Estimated effort: 5min
  - Issue ID: AaBnz4yWpPWvDdRwiRRc

### `Frontend/src/pages/AdminAcademicOptions.jsx`

- **javascript:S4624** - Line 161
  - Type: CODE_SMELL
  - Message: Refactor this code to not use nested template literals.
  - Estimated effort: 10min
  - Issue ID: AaBnz4wIpPWvDdRwiRQ6

### `Frontend/src/pages/AdminAllocations.jsx`

- **javascript:S1854** - Line 86
  - Type: CODE_SMELL
  - Message: Remove this useless assignment to variable "recordToDelete".
  - Estimated effort: 1min
  - Issue ID: AaBnz4wRpPWvDdRwiRQ8

- **javascript:S6478** - Line 155
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wRpPWvDdRwiRQ9

### `Frontend/src/pages/AdminCourses.jsx`

- **javascript:S6478** - Line 154
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xLpPWvDdRwiRRJ

### `Frontend/src/pages/AdminLayout.jsx`

- **javascript:S6848** - Line 22
  - Type: CODE_SMELL
  - Message: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
  - Estimated effort: 5min
  - Issue ID: AaBnz4w6pPWvDdRwiRRH

### `Frontend/src/pages/AdminPendingApprovals.jsx`

- **javascript:S3358** - Line 29
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wApPWvDdRwiRQ4

### `Frontend/src/pages/AdminPromotions.jsx`

- **javascript:S6479** - Line 126
  - Type: CODE_SMELL
  - Message: Do not use Array index in keys
  - Estimated effort: 5min
  - Issue ID: AaBnz4wZpPWvDdRwiRQ-

- **javascript:S6478** - Line 146
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wZpPWvDdRwiRQ_

### `Frontend/src/pages/AdminSchedules.jsx`

- **javascript:S1854** - Line 70
  - Type: CODE_SMELL
  - Message: Remove this useless assignment to variable "recordToDelete".
  - Estimated effort: 1min
  - Issue ID: AaBnz4wqpPWvDdRwiRRC

- **javascript:S1854** - Line 74
  - Type: CODE_SMELL
  - Message: Remove this useless assignment to variable "columnToDelete".
  - Estimated effort: 1min
  - Issue ID: AaBnz4wqpPWvDdRwiRRE

### `Frontend/src/pages/AdminStudents.jsx`

- **javascript:S6478** - Line 206
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xDpPWvDdRwiRRI

### `Frontend/src/pages/AdminTeachers.jsx`

- **javascript:S6478** - Line 144
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4v4pPWvDdRwiRQ2

### `Frontend/src/pages/AdminUsers.jsx`

- **javascript:S6478** - Line 175
  - Type: CODE_SMELL
  - Message: Move this component definition out of the parent component and pass data as props.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wipPWvDdRwiRRA

### `Frontend/src/pages/Library.jsx`

- **javascript:S3358** - Line 62
  - Type: CODE_SMELL
  - Message: Extract this nested ternary operation into an independent statement.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wypPWvDdRwiRRF

### `Frontend/src/utils/studentHelpers.js`

- **javascript:S1121** - Line 13
  - Type: CODE_SMELL
  - Message: Extract the assignment of "map[key]" from this expression.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xTpPWvDdRwiRRL

## VULNERABILITY

### `Backend/isolation-test.js`

- **javascript:S2245** - Line 25
  - Type: VULNERABILITY
  - Message: Make sure that using this pseudorandom number generator is safe here.
  - Estimated effort: 10min
  - Issue ID: AaBnz41MpPWvDdRwiRSH

- **jssecurity:S7044** - Line 36
  - Type: VULNERABILITY
  - Message: Change this code to not construct the URL's path from user-controlled data.
  - Estimated effort: 30min
  - Issue ID: AaBnz41MpPWvDdRwiRSN

- **javascript:S2068** - Line 167
  - Type: VULNERABILITY
  - Message: Review this potentially hard-coded password.
  - Estimated effort: 30min
  - Issue ID: AaBnz41MpPWvDdRwiRSJ

### `Backend/package.json`

- **text:S8564** - Line not specified
  - Type: VULNERABILITY
  - Message: Dependency versions are not predictable if the lock file (package-lock.json, npm-shrinkwrap.json, bun.lock, bun.lockb, pnpm-lock.yaml or yarn.lock) is missing.
  - Estimated effort: 5min
  - Issue ID: AaBnz402pPWvDdRwiRSD

### `Backend/prisma/seed.js`

- **javascript:S2245** - Line 701
  - Type: VULNERABILITY
  - Message: Make sure that using this pseudorandom number generator is safe here.
  - Estimated effort: 10min
  - Issue ID: AaBnz41CpPWvDdRwiRSG

### `Frontend/package.json`

- **text:S8564** - Line not specified
  - Type: VULNERABILITY
  - Message: Dependency versions are not predictable if the lock file (package-lock.json, npm-shrinkwrap.json, bun.lock, bun.lockb, pnpm-lock.yaml or yarn.lock) is missing.
  - Estimated effort: 5min
  - Issue ID: AaBnz4yfpPWvDdRwiRRd

---

# MINOR Issues

Total: **79**

## BUG

### `Frontend/src/components/admin/academic-options/DepartmentCard.jsx`

- **javascript:S1082** - Line 70
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPm

- **javascript:S1082** - Line 132
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPo

- **javascript:S1082** - Line 152
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rfpPWvDdRwiRPs

### `Frontend/src/components/admin/AdminModal.jsx`

- **javascript:S1082** - Line 26
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4shpPWvDdRwiRQC

### `Frontend/src/components/admin/AdminToolbar.jsx`

- **javascript:S1082** - Line 26
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sXpPWvDdRwiRQB

### `Frontend/src/components/admin/ConfirmDialog.jsx`

- **javascript:S1082** - Line 31
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sOpPWvDdRwiRP_

### `Frontend/src/components/admin/promotions/PromotionBatchDetailPanel.jsx`

- **javascript:S1082** - Line 9
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rWpPWvDdRwiRPj

### `Frontend/src/components/admin/ScheduleGrid.jsx`

- **javascript:S1082** - Line 216
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4r8pPWvDdRwiRP3

- **javascript:S1082** - Line 246
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4r8pPWvDdRwiRP5

### `Frontend/src/components/admin/StudentImportModal.jsx`

- **javascript:S1082** - Line 70
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4sFpPWvDdRwiRP7

### `Frontend/src/components/library/LibraryResourceCard.jsx`

- **javascript:S1082** - Line 47
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4mgpPWvDdRwiRPI

### `Frontend/src/components/teacher/SessionCard.jsx`

- **javascript:S1082** - Line 14
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uSpPWvDdRwiRQj

### `Frontend/src/pages/AdminLayout.jsx`

- **javascript:S1082** - Line 22
  - Type: BUG
  - Message: Visible, non-interactive elements with click handlers must have at least one keyboard listener.
  - Estimated effort: 5min
  - Issue ID: AaBnz4w6pPWvDdRwiRRG

## CODE_SMELL

### `Backend/app.js`

- **javascript:S7776** - Line 23
  - Type: CODE_SMELL
  - Message: `allowedOrigins` should be a `Set`, and use `allowedOrigins.has()` to check existence or non-existence.
  - Estimated effort: 5min
  - Issue ID: AaBnz40vpPWvDdRwiRSC

### `Backend/controllers/auth/authOptions.controller.js`

- **javascript:S6582** - Line 29
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz40DpPWvDdRwiRRq

### `Backend/controllers/auth/authRegistration.controller.js`

- **javascript:S6582** - Line 7
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz40MpPWvDdRwiRRr

- **javascript:S6582** - Line 78
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz40MpPWvDdRwiRRs

- **javascript:S6582** - Line 293
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz40MpPWvDdRwiRRt

### `Backend/controllers/library.controller.js`

- **javascript:S7773** - Line 153
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR0

- **javascript:S7773** - Line 161
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR1

- **javascript:S7773** - Line 192
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR2

- **javascript:S7773** - Line 197
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR3

- **javascript:S7773** - Line 219
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR4

- **javascript:S7773** - Line 8
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRRv

- **javascript:S7773** - Line 120
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRRw

- **javascript:S7773** - Line 133
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRRx

- **javascript:S7773** - Line 136
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRRy

- **javascript:S7773** - Line 227
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR5

- **javascript:S7773** - Line 242
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40epPWvDdRwiRR6

### `Backend/controllers/teacher.controller.js`

- **javascript:S7773** - Line 219
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40npPWvDdRwiRR7

- **javascript:S7773** - Line 350
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40npPWvDdRwiRR8

- **javascript:S7773** - Line 390
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40npPWvDdRwiRR9

- **javascript:S7773** - Line 423
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40npPWvDdRwiRR_

- **javascript:S7773** - Line 432
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40npPWvDdRwiRSA

- **javascript:S7773** - Line 414
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseInt` over `parseInt`.
  - Estimated effort: 2min
  - Issue ID: AaBnz40npPWvDdRwiRR-

### `Backend/isolation-test.js`

- **javascript:S1481** - Line 307
  - Type: CODE_SMELL
  - Message: Remove the declaration of the unused 'courseName' variable.
  - Estimated effort: 5min
  - Issue ID: AaBnz41MpPWvDdRwiRSK

- **javascript:S7776** - Line 426
  - Type: CODE_SMELL
  - Message: `enrolledCourseNames` should be a `Set`, and use `enrolledCourseNames.has()` to check existence or non-existence.
  - Estimated effort: 5min
  - Issue ID: AaBnz41MpPWvDdRwiRSM

### `Backend/middlewares/auth.middleware.js`

- **javascript:S2486** - Line 93
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4y3pPWvDdRwiRRf

### `Backend/prisma/seed.js`

- **javascript:S1481** - Line 361
  - Type: CODE_SMELL
  - Message: Remove the declaration of the unused 'bcaSem1Courses' variable.
  - Estimated effort: 5min
  - Issue ID: AaBnz41CpPWvDdRwiRSE

### `Backend/utils/auth.utils.js`

- **javascript:S6594** - Line 24
  - Type: CODE_SMELL
  - Message: Use the "RegExp.exec()" method instead.
  - Estimated effort: 5min
  - Issue ID: AaBnz4zJpPWvDdRwiRRh

### `Backend/utils/previewCache.js`

- **javascript:S7772** - Line 1
  - Type: CODE_SMELL
  - Message: Prefer `node:crypto` over `crypto`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4zBpPWvDdRwiRRg

### `Frontend/src/api/axios.js`

- **javascript:S7744** - Line 112
  - Type: CODE_SMELL
  - Message: The empty object is useless.
  - Estimated effort: 5min
  - Issue ID: AaBnz4yDpPWvDdRwiRRY

### `Frontend/src/components/admin/RecordDetailPanel.jsx`

- **javascript:S1128** - Line 15
  - Type: CODE_SMELL
  - Message: Remove this unused import of 'CheckCircle2'.
  - Estimated effort: 1min
  - Issue ID: AaBnz4rypPWvDdRwiRPz

- **javascript:S7755** - Line 32
  - Type: CODE_SMELL
  - Message: Prefer `.at(â¦)` over `[â¦.length - index]`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4rypPWvDdRwiRP0

- **javascript:S7773** - Line 70
  - Type: CODE_SMELL
  - Message: Prefer `Number.parseFloat` over `parseFloat`.
  - Estimated effort: 2min
  - Issue ID: AaBnz4rypPWvDdRwiRP1

### `Frontend/src/components/teacher/SessionCard.jsx`

- **javascript:S6582** - Line 15
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4uSpPWvDdRwiRQl

### `Frontend/src/contexts/AuthContext.jsx`

- **javascript:S2486** - Line 65
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4yOpPWvDdRwiRRb

### `Frontend/src/hooks/useAdminAllocations.js`

- **javascript:S6582** - Line 61
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4u9pPWvDdRwiRQq

### `Frontend/src/hooks/useAdminSchedules.js`

- **javascript:S2486** - Line 136
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vopPWvDdRwiRQy

- **javascript:S2486** - Line 167
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vopPWvDdRwiRQz

- **javascript:S2486** - Line 205
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vopPWvDdRwiRQ0

### `Frontend/src/hooks/useEditProfile.js`

- **javascript:S2486** - Line 37
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vOpPWvDdRwiRQs

- **javascript:S6582** - Line 62
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4vOpPWvDdRwiRQt

### `Frontend/src/hooks/useInstituteCode.js`

- **javascript:S2486** - Line 54
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vvpPWvDdRwiRQ1

### `Frontend/src/hooks/useInstituteSettings.js`

- **javascript:S2486** - Line 41
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vFpPWvDdRwiRQr

### `Frontend/src/hooks/useLibrary.js`

- **javascript:S6754** - Line 86
  - Type: CODE_SMELL
  - Message: useState call is not destructured into value + setter pair
  - Estimated effort: 5min
  - Issue ID: AaBnz4u1pPWvDdRwiRQp

### `Frontend/src/hooks/useSignUp.js`

- **javascript:S2486** - Line 71
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4vXpPWvDdRwiRQu

- **javascript:S6582** - Line 94
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4vXpPWvDdRwiRQv

### `Frontend/src/pages/AdminAcademicOptions.jsx`

- **javascript:S1128** - Line 2
  - Type: CODE_SMELL
  - Message: Remove this unused import of 'Loader2'.
  - Estimated effort: 1min
  - Issue ID: AaBnz4wIpPWvDdRwiRQ5

### `Frontend/src/pages/AdminAllocations.jsx`

- **javascript:S1481** - Line 86
  - Type: CODE_SMELL
  - Message: Remove the declaration of the unused 'recordToDelete' variable.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wRpPWvDdRwiRQ7

### `Frontend/src/pages/AdminPendingApprovals.jsx`

- **javascript:S1128** - Line 2
  - Type: CODE_SMELL
  - Message: Remove this unused import of 'Loader2'.
  - Estimated effort: 1min
  - Issue ID: AaBnz4wApPWvDdRwiRQ3

### `Frontend/src/pages/AdminSchedules.jsx`

- **javascript:S1481** - Line 70
  - Type: CODE_SMELL
  - Message: Remove the declaration of the unused 'recordToDelete' variable.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wqpPWvDdRwiRRB

- **javascript:S1481** - Line 74
  - Type: CODE_SMELL
  - Message: Remove the declaration of the unused 'columnToDelete' variable.
  - Estimated effort: 5min
  - Issue ID: AaBnz4wqpPWvDdRwiRRD

### `Frontend/src/utils/academicOptionsHelpers.js`

- **javascript:S7755** - Line 33
  - Type: CODE_SMELL
  - Message: Prefer `.at(â¦)` over `[â¦.length - index]`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xipPWvDdRwiRRO

- **javascript:S6582** - Line 34
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xipPWvDdRwiRRP

- **javascript:S7758** - Line 35
  - Type: CODE_SMELL
  - Message: Prefer `String.fromCodePoint()` over `String.fromCharCode()`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xipPWvDdRwiRRQ

- **javascript:S7758** - Line 35
  - Type: CODE_SMELL
  - Message: Prefer `String#codePointAt()` over `String#charCodeAt()`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xipPWvDdRwiRRR

- **javascript:S7758** - Line 37
  - Type: CODE_SMELL
  - Message: Prefer `String.fromCodePoint()` over `String.fromCharCode()`.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xipPWvDdRwiRRS

### `Frontend/src/utils/formatters.js`

- **javascript:S7773** - Line 8
  - Type: CODE_SMELL
  - Message: Prefer `Number.isNaN` over `isNaN`.
  - Estimated effort: 2min
  - Issue ID: AaBnz4x7pPWvDdRwiRRW

- **javascript:S7773** - Line 19
  - Type: CODE_SMELL
  - Message: Prefer `Number.isNaN` over `isNaN`.
  - Estimated effort: 2min
  - Issue ID: AaBnz4x7pPWvDdRwiRRX

### `Frontend/src/utils/libraryHelpers.js`

- **javascript:S2486** - Line 56
  - Type: CODE_SMELL
  - Message: Handle this exception, don't catch it at all, or explain in a comment why it is ignored.
  - Estimated effort: 1h
  - Issue ID: AaBnz4xzpPWvDdRwiRRV

### `Frontend/src/utils/profileHelpers.js`

- **javascript:S6582** - Line 18
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xppPWvDdRwiRRT

- **javascript:S6582** - Line 23
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xppPWvDdRwiRRU

### `Frontend/src/utils/signupHelpers.js`

- **javascript:S6582** - Line 19
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xapPWvDdRwiRRM

- **javascript:S6582** - Line 24
  - Type: CODE_SMELL
  - Message: Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - Estimated effort: 5min
  - Issue ID: AaBnz4xapPWvDdRwiRRN

### `Frontend/src/utils/studentHelpers.js`

- **javascript:S7773** - Line 11
  - Type: CODE_SMELL
  - Message: Prefer `Number.isNaN` over `isNaN`.
  - Estimated effort: 2min
  - Issue ID: AaBnz4xTpPWvDdRwiRRK

## VULNERABILITY

### `Backend/app.js`

- **javascript:S5689** - Line 18
  - Type: VULNERABILITY
  - Message: This framework implicitly discloses version information by default. Make sure it is safe here.
  - Estimated effort: 5min
  - Issue ID: AaBnz40vpPWvDdRwiRSB

### `Backend/isolation-test.js`

- **jssecurity:S8476** - Line 36
  - Type: VULNERABILITY
  - Message: Ensure that tainted data is validated before being used to construct a client-side request URL.
  - Estimated effort: 20min
  - Issue ID: AaBnz41MpPWvDdRwiRSO

### `Backend/middlewares/error.middleware.js`

- **jssecurity:S5145** - Line 91
  - Type: VULNERABILITY
  - Message: Change this code to not log user-controlled data.
  - Estimated effort: 30min
  - Issue ID: AaBnz4ynpPWvDdRwiRRe

---

# Instructions for AI Coding Agents

Use this report as a list of SonarQube findings to investigate.

For each issue:

1. Locate the specified file and line.
2. Read the surrounding code.
3. Understand the SonarQube rule.
4. Determine whether the finding is genuine or a false positive.
5. Fix genuine issues while preserving existing behavior.
6. Do not suppress or disable rules simply to remove the finding.
7. Do not perform unrelated refactoring.
8. Run relevant tests, type checks, and linters.
9. Verify that the original SonarQube issue is resolved.

Priority order:

1. BLOCKER
2. CRITICAL
3. MAJOR
4. MINOR
5. INFO

