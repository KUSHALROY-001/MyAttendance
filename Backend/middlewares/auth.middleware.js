const ApiError = require("../utils/ApiError");
const { prisma } = require("../utils/prisma");
const {
  extractBearerToken,
  verifyAccessToken,
} = require("../utils/auth.utils");

const attachAuthContext = async (req, token) => {
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token.");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.userId) },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Authenticated user no longer exists.");
  }

  req.user = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    instituteId: user.instituteId || null,
  };

  req.authProfile = {
    studentId: user.student?.id || null,
    rollNumber: user.student?.rollNumber || null,
    teacherId: user.teacher?.id || null,
    employeeId: user.teacher?.employeeId || null,
    department: user.student?.department || user.teacher?.department || null,
    semester: user.student?.semester || null,
    section: user.student?.section || null,
  };
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = extractBearerToken(authHeader);

    if (!token) {
      throw new ApiError(401, "Authentication required.");
    }

    await attachAuthContext(req, token);
    return next();
  } catch (error) {
    return next(error);
  }
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = extractBearerToken(authHeader);

    if (!token) {
      req.user = null;
      req.authProfile = null;
      return next();
    }

    await attachAuthContext(req, token);
    return next();
  } catch (_error) {
    req.user = null;
    req.authProfile = null;
    return next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
