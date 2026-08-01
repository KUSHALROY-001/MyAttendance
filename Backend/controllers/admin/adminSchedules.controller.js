const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");

const formatClassScheduleEntry = (entry) => ({
  id: entry.id,
  classTimetableId: entry.classTimetableId,
  periodNumber: entry.periodNumber,
  day: entry.day,
  courseAllocationId: entry.courseAllocationId,
  room: entry.room,
  classType: entry.classType,
  department: entry.courseAllocation?.department,
  semester: entry.courseAllocation?.semester,
  section: entry.courseAllocation?.section,
  academicYear: entry.courseAllocation?.academicYear,
  courseId: entry.courseAllocation?.course?.id,
  courseName: entry.courseAllocation?.course?.name || "",
  courseCode: entry.courseAllocation?.course?.code || "",
  teacherId: entry.courseAllocation?.teacher?.id,
  teacherName: entry.courseAllocation?.teacher?.user?.name || "",
  teacherEmployeeId: entry.courseAllocation?.teacher?.employeeId || "",
});

const readClassTimetable = asyncHandler(async (req, res) => {
  const { department, semester, section } = req.query;
  if (!department || !semester) {
    throw new ApiError(400, "Department and semester are required.");
  }
  const sec = section || "A";
  const instituteId = req.user.instituteId;

  // Upsert: create timetable row if it doesn't exist yet
  let timetable = await prisma.classTimetable.findFirst({
    where: {
      instituteId,
      department,
      semester: Number(semester),
      section: sec,
    },
  });

  if (!timetable) {
    timetable = await prisma.classTimetable.create({
      data: {
        department,
        semester: Number(semester),
        section: sec,
        periods: [],
        instituteId,
      },
    });
  }

  const entries = await prisma.classScheduleEntry.findMany({
    where: { classTimetableId: timetable.id },
    include: {
      courseAllocation: {
        include: {
          course: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    timetable,
    entries: entries.map(formatClassScheduleEntry),
  });
});

const addClassPeriod = asyncHandler(async (req, res) => {
  const { department, semester, section, startTime, endTime, type } =
    req.body;
  if (!department || !semester || !startTime || !endTime) {
    throw new ApiError(
      400,
      "Department, semester, startTime, endTime required.",
    );
  }
  const sec = section || "A";
  const instituteId = req.user.instituteId;

  let timetable = await prisma.classTimetable.findFirst({
    where: {
      instituteId,
      department,
      semester: Number(semester),
      section: sec,
    },
  });

  if (!timetable) {
    timetable = await prisma.classTimetable.create({
      data: {
        department,
        semester: Number(semester),
        section: sec,
        periods: [],
        instituteId,
      },
    });
  }

  const periods = Array.isArray(timetable.periods) ? timetable.periods : [];
  const maxPeriod = periods.reduce(
    (max, p) => Math.max(max, p.period || 0),
    0,
  );

  periods.push({
    period: maxPeriod + 1,
    startTime,
    endTime,
    type: type || "class",
  });

  const updated = await prisma.classTimetable.update({
    where: { id: timetable.id },
    data: { periods },
  });

  res.status(201).json(updated);
});

const updateClassPeriod = asyncHandler(async (req, res) => {
  const { department, semester, section, periodNumber, startTime, endTime } =
    req.body;

  const timetable = await prisma.classTimetable.findFirst({
    where: {
      instituteId: req.user.instituteId,
      department,
      semester: Number(semester),
      section: section || "A",
    },
  });
  if (!timetable) throw new ApiError(404, "Timetable not found.");

  const periods = Array.isArray(timetable.periods) ? timetable.periods : [];
  const idx = periods.findIndex((p) => p.period === Number(periodNumber));
  if (idx === -1) throw new ApiError(404, "Period not found.");

  if (startTime) periods[idx].startTime = startTime;
  if (endTime) periods[idx].endTime = endTime;

  const updated = await prisma.classTimetable.update({
    where: { id: timetable.id },
    data: { periods },
  });

  res.status(200).json(updated);
});

const deleteClassPeriod = asyncHandler(async (req, res) => {
  const { department, semester, section, periodNumber } = req.body;

  const timetable = await prisma.classTimetable.findFirst({
    where: {
      instituteId: req.user.instituteId,
      department,
      semester: Number(semester),
      section: section || "A",
    },
  });
  if (!timetable) throw new ApiError(404, "Timetable not found.");

  await prisma.$transaction(async (tx) => {
    // Delete all source timetable entries for this period.
    await tx.classScheduleEntry.deleteMany({
      where: {
        classTimetableId: timetable.id,
        periodNumber: Number(periodNumber),
      },
    });

    // Remove the period from the JSON array.
    const periods = Array.isArray(timetable.periods)
      ? timetable.periods.filter((p) => p.period !== Number(periodNumber))
      : [];

    await tx.classTimetable.update({
      where: { id: timetable.id },
      data: { periods },
    });
  });

  res.status(200).json({ message: "Period column deleted." });
});

const createClassScheduleEntry = asyncHandler(async (req, res) => {
  const {
    classTimetableId,
    periodNumber,
    day,
    courseAllocationId,
    room,
    classType,
  } = req.body;

  if (!classTimetableId || !periodNumber || !day || !courseAllocationId) {
    throw new ApiError(400, "All fields are required.");
  }

  const allocation = await prisma.courseAllocation.findFirst({
    where: {
      id: Number(courseAllocationId),
      instituteId: req.user.instituteId,
    },
  });
  if (!allocation) throw new ApiError(404, "Course allocation not found.");

  const timetable = await prisma.classTimetable.findFirst({
    where: { id: Number(classTimetableId), instituteId: req.user.instituteId },
    select: { id: true },
  });
  if (!timetable) throw new ApiError(404, "Class timetable not found.");

  // Conflict detection now checks the source class timetable entries directly.
  const conflict = await prisma.classScheduleEntry.findFirst({
    where: {
      day,
      periodNumber: Number(periodNumber),
      courseAllocation: {
        teacherId: allocation.teacherId,
      },
    },
    include: {
      courseAllocation: {
        include: { course: { select: { name: true } } },
      },
    },
  });

  if (conflict) {
    throw new ApiError(
      409,
      `Teacher already has "${conflict.courseAllocation.course.name}" at this day/period.`,
    );
  }

  const result = await prisma.classScheduleEntry.create({
    data: {
      classTimetableId: Number(classTimetableId),
      periodNumber: Number(periodNumber),
      day,
      courseAllocationId: Number(courseAllocationId),
      room: room || null,
      classType: classType || "class",
    },
  });

  res.status(201).json(result);
});

const deleteClassScheduleEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const entry = await prisma.classScheduleEntry.findFirst({
    where: {
      id: Number(id),
      classTimetable: { instituteId: req.user.instituteId },
    },
  });
  if (!entry) throw new ApiError(404, "Schedule entry not found.");

  await prisma.classScheduleEntry.delete({ where: { id: Number(id) } });

  res.status(200).json({ message: "Schedule entry deleted." });
});

module.exports = {
  readClassTimetable,
  addClassPeriod,
  updateClassPeriod,
  deleteClassPeriod,
  createClassScheduleEntry,
  deleteClassScheduleEntry,
  formatClassScheduleEntry,
};
