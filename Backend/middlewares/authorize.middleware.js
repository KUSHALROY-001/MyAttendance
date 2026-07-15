const ApiError = require("../utils/ApiError");
const { prisma } = require("../utils/prisma");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You are not allowed to access this resource."));
    }

    return next();
  };
};

const authorizeStudentSelf = ({
  paramKey = "roll",
  queryKey = "rollNumber",
} = {}) => {
  return (req, res, next) => {
    if (req.user?.role === "ADMIN") {
      return next();
    }

    const targetRoll = req.params?.[paramKey] || req.query?.[queryKey];
    if (!targetRoll) {
      return next();
    }

    if (req.authProfile?.rollNumber !== targetRoll) {
      return next(new ApiError(403, "You can only access your own student data."));
    }

    return next();
  };
};

const authorizeTeacherSelf = ({ paramKey = "teacherId" } = {}) => {
  return (req, res, next) => {
    if (req.user?.role === "ADMIN") {
      return next();
    }

    const targetTeacherId = req.params?.[paramKey];
    if (!targetTeacherId) {
      return next();
    }

    if (req.authProfile?.employeeId !== targetTeacherId) {
      return next(new ApiError(403, "You can only access your own teacher data."));
    }

    return next();
  };
};

const authorizeTeacherAllocationAccess = ({
  source = "params",
  key = "allocationId",
} = {}) => {
  return async (req, res, next) => {
    try {
      if (req.user?.role === "ADMIN") {
        return next();
      }

      const rawValue = source === "body" ? req.body?.[key] : req.params?.[key];
      if (!rawValue) {
        return next(new ApiError(400, "Allocation identifier is required."));
      }

      const allocation = await prisma.courseAllocation.findUnique({
        where: { id: Number(rawValue) },
        select: {
          teacher: {
            select: {
              employeeId: true,
              userId: true,
            },
          },
        },
      });

      if (!allocation) {
        return next(new ApiError(404, "Course allocation not found."));
      }

      if (
        allocation.teacher?.userId !== req.user.userId &&
        allocation.teacher?.employeeId !== req.authProfile?.employeeId
      ) {
        return next(new ApiError(403, "You are not allowed to access this allocation."));
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
      if (req.user?.role === "ADMIN") {
        return next();
      }

      const sessionId = req.params?.[paramKey];
      if (!sessionId) {
        return next(new ApiError(400, "Session identifier is required."));
      }

      const session = await prisma.attendanceSession.findUnique({
        where: { id: Number(sessionId) },
        select: {
          courseAllocation: {
            select: {
              teacher: {
                select: {
                  employeeId: true,
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

      if (
        session.courseAllocation?.teacher?.userId !== req.user.userId &&
        session.courseAllocation?.teacher?.employeeId !== req.authProfile?.employeeId
      ) {
        return next(new ApiError(403, "You are not allowed to access this session."));
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
