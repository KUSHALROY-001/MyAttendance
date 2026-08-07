const ApiError = require("../utils/ApiError");
const { prisma } = require("../utils/prisma");

// ADMIN and SUPER_ADMIN both have full institute-scoped admin access —
// SUPER_ADMIN is just the institute's permanent founder with a couple of
// extra powers (academic options CRUD) layered on top elsewhere.
const isInstituteAdminRole = (role) =>
  role === "ADMIN" || role === "SUPER_ADMIN";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You are not allowed to access this resource."),
      );
    }

    return next();
  };
};

const authorizeStudentSelf = ({
  paramKey = "roll",
  queryKey = "rollNumber",
} = {}) => {
  return async (req, res, next) => {
    try {
      const targetRoll = req.params?.[paramKey] || req.query?.[queryKey];

      if (isInstituteAdminRole(req.user?.role)) {
        if (!targetRoll) {
          return next();
        }
        // Defense-in-depth: an admin can only self-route to a student
        // within their own institute, even though the controller behind
        // this already scopes by instituteId independently. This means a
        // future route reusing this middleware doesn't silently inherit a
        // cross-tenant hole just because it forgot its own scoping.
        const student = await prisma.student.findFirst({
          where: { instituteId: req.user.instituteId, rollNumber: targetRoll },
          select: { id: true },
        });
        if (!student) {
          return next(new ApiError(404, "Student not found."));
        }
        return next();
      }

      if (!targetRoll) {
        return next();
      }

      if (req.authProfile?.rollNumber !== targetRoll) {
        return next(
          new ApiError(403, "You can only access your own student data."),
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

const authorizeTeacherSelf = ({ paramKey = "teacherId" } = {}) => {
  return async (req, res, next) => {
    try {
      const targetTeacherId = req.params?.[paramKey];

      if (isInstituteAdminRole(req.user?.role)) {
        if (!targetTeacherId) {
          return next();
        }
        const teacher = await prisma.teacher.findFirst({
          where: {
            instituteId: req.user.instituteId,
            employeeId: targetTeacherId,
          },
          select: { id: true },
        });
        if (!teacher) {
          return next(new ApiError(404, "Teacher not found."));
        }
        return next();
      }

      if (!targetTeacherId) {
        return next();
      }

      if (req.authProfile?.employeeId !== targetTeacherId) {
        return next(
          new ApiError(403, "You can only access your own teacher data."),
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

const authorizeTeacherAllocationAccess = ({
  source = "params",
  key = "allocationId",
} = {}) => {
  return async (req, res, next) => {
    try {
      const rawValue = source === "body" ? req.body?.[key] : req.params?.[key];
      if (!rawValue) {
        return next(new ApiError(400, "Allocation identifier is required."));
      }

      const allocation = await prisma.courseAllocation.findUnique({
        where: { id: Number(rawValue) },
        select: {
          instituteId: true,
          teacher: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!allocation) {
        return next(new ApiError(404, "Course allocation not found."));
      }

      if (isInstituteAdminRole(req.user?.role)) {
        // Defense-in-depth: same reasoning as authorizeStudentSelf above.
        if (allocation.instituteId !== req.user.instituteId) {
          return next(new ApiError(404, "Course allocation not found."));
        }
        return next();
      }

      if (allocation.teacher?.userId !== req.user.userId) {
        return next(
          new ApiError(403, "You are not allowed to access this allocation."),
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

const authorizeTeacherSessionAccess = ({ paramKey = "sessionId" } = {}) => {
  return async (req, res, next) => {
    try {
      const sessionId = req.params?.[paramKey];
      if (!sessionId) {
        return next(new ApiError(400, "Session identifier is required."));
      }

      const session = await prisma.attendanceSession.findUnique({
        where: { id: Number(sessionId) },
        select: {
          courseAllocation: {
            select: {
              instituteId: true,
              teacher: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!session) {
        return next(new ApiError(404, "Attendance session not found."));
      }

      if (isInstituteAdminRole(req.user?.role)) {
        if (session.courseAllocation?.instituteId !== req.user.instituteId) {
          return next(new ApiError(404, "Attendance session not found."));
        }
        return next();
      }

      if (session.courseAllocation?.teacher?.userId !== req.user.userId) {
        return next(
          new ApiError(403, "You are not allowed to access this session."),
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = {
  authorizeRoles,
  authorizeStudentSelf,
  authorizeTeacherSelf,
  authorizeTeacherAllocationAccess,
  authorizeTeacherSessionAccess,
};
