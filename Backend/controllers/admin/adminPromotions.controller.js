const { prisma } = require("../../utils/prisma.js");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
/*
* A RUNNING batch older than this is treated as stale (server likely
* crashed mid-run) rather than permanently blocking every future run for
* that institute/department scope.
const STALE_RUN_MS = 30 * 60 * 1000; // 30 minutes

* Same set of transient-error codes and the same one-retry reasoning as
* confirmStudentImport (adminStudents.controller.js): P1017 is a dropped
* server connection, P2028/P2034 are transaction-layer errors (closed/
* expired transaction, write conflict). All three are unrelated to the
* student's own data, so failing permanently on the first hiccup would
* under-report what's actually promotable. promoteStudent's transaction
* rolls back atomically on error, so retrying it is safe.*/
const isTransientDbError = (err) =>
  err?.code === "P1017" || err?.code === "P2028" || err?.code === "P2034";

const enforceSuperAdmin = (req) => {
  if (req.user?.role !== "SUPER_ADMIN") {
    throw new ApiError(
      403,
      "Forbidden: Only Super Admins can run semester promotion.",
    );
  }
};
/*
 * A department's final semester is the highest semester number listed in
 * its semesterDetails JSON. A department with no semesters configured has
 * no defined final semester, so it's skipped entirely (with a warning)
 * rather than guessed at.*/
const getMaxSemester = (departmentInfo) => {
  const details = Array.isArray(departmentInfo?.semesterDetails)
    ? departmentInfo.semesterDetails
    : [];
  if (details.length === 0) return null;
  return Math.max(
    ...details.map((d) => Number(d.semester)).filter(Number.isFinite),
  );
};
/*
 * Resolves which departments this run targets, each with its computed
 * maxSemester attached. Departments with no semesters configured are
 * returned separately as warnings so the caller can report them without
 * aborting the whole run.*/
const resolveTargetDepartments = async (instituteId, department) => {
  const departments = await prisma.departmentInfo.findMany({
    where: {
      instituteId,
      ...(department ? { code: department } : {}),
    },
  });

  const targets = [];
  const warnings = [];

  for (const dept of departments) {
    const maxSemester = getMaxSemester(dept);
    if (maxSemester === null) {
      warnings.push(
        `Department ${dept.code} has no semesters configured — skipped entirely.`,
      );
      continue;
    }
    targets.push({ code: dept.code, maxSemester });
  }

  return { targets, warnings };
};
/*
 * GET /api/admin/promotions/preview?department=
 * Returns per-department counts so the admin sees real numbers before
 * anything runs: how many students would be promoted vs. skipped (already
 * at their department's final semester).*/
const previewPromotion = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const { department } = req.query;
  const instituteId = req.user.instituteId;

  const { targets, warnings } = await resolveTargetDepartments(
    instituteId,
    department,
  );

  const preview = await Promise.all(
    targets.map(async ({ code, maxSemester }) => {
      const [totalStudents, eligibleCount, atFinalSemesterCount] =
        await Promise.all([
          prisma.student.count({
            where: {
              instituteId,
              department: code,
              user: { status: "ACTIVE" },
            },
          }),
          prisma.student.count({
            where: {
              instituteId,
              department: code,
              semester: { lt: maxSemester },
              user: { status: "ACTIVE" },
            },
          }),
          prisma.student.count({
            where: {
              instituteId,
              department: code,
              semester: maxSemester,
              user: { status: "ACTIVE" },
            },
          }),
        ]);

      return {
        department: code,
        maxSemester,
        totalStudents,
        eligibleCount,
        atFinalSemesterCount,
      };
    }),
  );

  res.status(200).json({ departments: preview, warnings });
});
/*
 * Archives one student's current semester into a frozen summary, wipes
 * their old-semester enrollment (StudentCourse/StudentAttendanceStat —
 * see plan §0.3: getStudentDashboard reads these with no semester filter,
 * so leaving old rows in place would permanently mix semesters together),
 * advances their semester by one, and enrolls them in the new semester's
 * curriculum courses. Section is left untouched throughout.
 *
 * One dedicated transaction per student, not a shared transaction across a
 * chunk of students — reusing the exact fix already proven necessary for
 * bulk import (see confirmStudentImport / createStudentRecord), where
 * leaning on "one failed statement won't poison a shared transaction" was
 * the actual cause of a dropped-connection failure on row 5.*/
const promoteStudent = async (student, coursesByKey, batchId) => {
  const stats = await prisma.studentAttendanceStat.findMany({
    where: { studentId: student.id },
    include: { course: { select: { id: true, code: true, name: true } } },
  });

  const totalSessions = stats.reduce((sum, s) => sum + s.totalSessions, 0);
  const totalAttended = stats.reduce((sum, s) => sum + s.totalAttended, 0);
  const overallPercentage =
    totalSessions > 0 ? (totalAttended / totalSessions) * 100 : 0;

  const newSemester = student.semester + 1;
  const newCourses =
    coursesByKey.get(`${student.department}::${newSemester}`) || [];

  return prisma.$transaction(
    async (tx) => {
      await tx.studentSemesterSummary.create({
        data: {
          studentId: student.id,
          instituteId: student.instituteId,
          promotionBatchId: batchId,
          department: student.department,
          section: student.section,
          semester: student.semester,
          promotedToSemester: newSemester,
          totalSessions,
          totalAttended,
          overallPercentage,
          courses: {
            create: stats
              .filter((s) => s.course)
              .map((s) => ({
                courseId: s.course.id,
                courseCode: s.course.code,
                courseName: s.course.name,
                totalSessions: s.totalSessions,
                totalAttended: s.totalAttended,
                percentage:
                  s.totalSessions > 0
                    ? (s.totalAttended / s.totalSessions) * 100
                    : 0,
              })),
          },
        },
      });
      /*
       * Old-semester enrollment is now archived above — remove it so
       * getStudentDashboard's unfiltered enrolledCourses/attendanceStats
       * queries don't start mixing semesters together.*/
      await tx.studentCourse.deleteMany({ where: { studentId: student.id } });
      await tx.studentAttendanceStat.deleteMany({
        where: { studentId: student.id },
      });

      await tx.student.update({
        where: { id: student.id },
        data: { semester: newSemester }, // section untouched, as designed
      });

      if (newCourses.length > 0) {
        await tx.studentCourse.createMany({
          data: newCourses.map((c) => ({
            studentId: student.id,
            courseId: c.id,
          })),
          skipDuplicates: true,
        });
        await tx.studentAttendanceStat.createMany({
          data: newCourses.map((c) => ({
            studentId: student.id,
            courseId: c.id,
            totalSessions: 0,
            totalAttended: 0,
          })),
          skipDuplicates: true,
        });
      }
    },
    /*
     * Same widened budget as createStudentRecord — this transaction does
     * several writes per student and shouldn't be squeezed by the 5s
     * default under a slower connection.*/
    { maxWait: 10000, timeout: 15000 },
  );
};

// POST /api/admin/promotions/run  { department? }
const runPromotion = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const instituteId = req.user.instituteId;
  const department = req.body?.department || null;

  const { targets, warnings } = await resolveTargetDepartments(
    instituteId,
    department,
  );

  if (targets.length === 0) {
    throw new ApiError(
      400,
      "No departments with configured semesters found for this scope.",
    );
  }

  /*
   * Guard against concurrent/stuck runs for this exact scope. A RUNNING
   * batch older than STALE_RUN_MS is treated as abandoned (the server
   * most likely crashed mid-run) and superseded rather than blocking
   * every future run for this institute/department forever.*/
  const activeRun = await prisma.promotionBatch.findFirst({
    where: { instituteId, department, status: "RUNNING" },
  });

  if (activeRun) {
    const isStale =
      Date.now() - new Date(activeRun.startedAt).getTime() > STALE_RUN_MS;
    if (!isStale) {
      throw new ApiError(
        409,
        "A promotion run is already in progress for this scope.",
      );
    }
    await prisma.promotionBatch.update({
      where: { id: activeRun.id },
      data: { status: "FAILED", completedAt: new Date() },
    });
  }

  const batch = await prisma.promotionBatch.create({
    data: {
      instituteId,
      department,
      status: "RUNNING",
      triggeredById: req.user.userId,
    },
  });

  let promotedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const errorLog = [];

  try {
    /*
     * Batch the read-side lookups once for the whole run, not per student:
     * one query per unique (department, newSemester) pair for the incoming
     * curriculum courses, mirroring confirmStudentImport's coursesByKey.
     * Built below from the actual eligible students' (department, semester+1)
     * pairs, once we know who's eligible.*/
    const eligibleStudentsByDept = await Promise.all(
      targets.map(({ code, maxSemester }) =>
        prisma.student.findMany({
          where: {
            instituteId,
            department: code,
            semester: { lt: maxSemester },
            user: { status: "ACTIVE" },
          },
        }),
      ),
    );

    const skippedCounts = await Promise.all(
      targets.map(({ code, maxSemester }) =>
        prisma.student.count({
          where: {
            instituteId,
            department: code,
            semester: maxSemester,
            user: { status: "ACTIVE" },
          },
        }),
      ),
    );
    skippedCount = skippedCounts.reduce((sum, n) => sum + n, 0);

    const eligibleStudents = eligibleStudentsByDept.flat();

    const newSemesterKeys = [
      ...new Set(
        eligibleStudents.map((s) => `${s.department}::${s.semester + 1}`),
      ),
    ];
    const courseListsByKey = await Promise.all(
      newSemesterKeys.map((key) => {
        const [dept, semStr] = key.split("::");
        return prisma.course.findMany({
          where: { instituteId, department: dept, semester: Number(semStr) },
        });
      }),
    );
    const coursesByKey = new Map(
      newSemesterKeys.map((key, i) => [key, courseListsByKey[i]]),
    );

    const noNewCourseWarnings = new Set();

    for (const student of eligibleStudents) {
      let succeeded = false;
      let lastError;

      for (let attempt = 1; attempt <= 2 && !succeeded; attempt++) {
        try {
          await promoteStudent(student, coursesByKey, batch.id);
          succeeded = true;
        } catch (err) {
          lastError = err;
          if (attempt === 1 && isTransientDbError(err)) {
            continue; // one retry for a transient connection/transaction blip
          }
          break;
        }
      }

      if (succeeded) {
        promotedCount++;
        const key = `${student.department}::${student.semester + 1}`;
        if (!coursesByKey.get(key)?.length && !noNewCourseWarnings.has(key)) {
          noNewCourseWarnings.add(key);
          warnings.push(
            `${student.department} semester ${student.semester + 1} has no curriculum courses configured — promoted students there have zero enrolled courses.`,
          );
        }
      } else {
        failedCount++;
        errorLog.push({
          studentId: student.id,
          rollNumber: student.rollNumber,
          reason: lastError?.message || "Failed to promote this student.",
        });
      }
    }

    const finalStatus = failedCount > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED";

    const updatedBatch = await prisma.promotionBatch.update({
      where: { id: batch.id },
      data: {
        status: finalStatus,
        totalStudents: eligibleStudents.length + skippedCount,
        promotedCount,
        skippedCount,
        failedCount,
        errorLog: errorLog.length > 0 ? errorLog : undefined,
        completedAt: new Date(),
      },
    });

    res.status(200).json({ batch: updatedBatch, warnings });
  } catch (err) {
    await prisma.promotionBatch.update({
      where: { id: batch.id },
      data: {
        status: "FAILED",
        promotedCount,
        skippedCount,
        failedCount,
        errorLog: errorLog.length > 0 ? errorLog : undefined,
        completedAt: new Date(),
      },
    });
    throw err;
  }
});

// GET /api/admin/promotions
const listPromotionBatches = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const batches = await prisma.promotionBatch.findMany({
    where: { instituteId: req.user.instituteId },
    orderBy: { startedAt: "desc" },
    include: {
      triggeredBy: { select: { name: true, email: true } },
    },
  });

  res.status(200).json(batches);
});

// GET /api/admin/promotions/:batchId
const getPromotionBatchDetail = asyncHandler(async (req, res) => {
  enforceSuperAdmin(req);

  const batchId = Number(req.params.batchId);

  const batch = await prisma.promotionBatch.findFirst({
    where: { id: batchId, instituteId: req.user.instituteId },
    include: {
      triggeredBy: { select: { name: true, email: true } },
      summaries: {
        include: {
          student: {
            select: {
              rollNumber: true,
              enrollmentNumber: true,
              user: { select: { name: true } },
            },
          },
          courses: true,
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!batch) {
    throw new ApiError(404, "Promotion batch not found.");
  }

  res.status(200).json(batch);
});

module.exports = {
  previewPromotion,
  runPromotion,
  listPromotionBatches,
  getPromotionBatchDetail,
};
