const jwt = require("jsonwebtoken");

const DEFAULT_ACCESS_SECRET = "dev-access-secret-change-me";
const DEFAULT_REFRESH_SECRET = "dev-refresh-secret-change-me";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || DEFAULT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || DEFAULT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const parseDurationToSeconds = (value) => {
  if (!value) return 0;
  if (typeof value === "number") return value;

  const match = String(value)
    .trim()
    .match(/^(\d+)([smhd])$/i);
  if (!match) {
    return Number(value) || 0;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return amount;
    case "m":
      return amount * 60;
    case "h":
      return amount * 60 * 60;
    case "d":
      return amount * 60 * 60 * 24;
    default:
      return amount;
  }
};

const generateAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);

const extractBearerToken = (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7).trim();
};

const parseCookies = (cookieHeader = "") => {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) return cookies;

      const name = part.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      cookies[name] = value;
      return cookies;
    }, {});
};

const createCookie = (name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);

  return parts.join("; ");
};

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  path: "/api/auth",
  sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN),
});

const buildSafeAuthUser = (user) => {
  if (!user) return null;

  const profile = user.student
    ? {
        type: "student",
        studentId: user.student.id,
        rollNumber: user.student.rollNumber,
        department: user.student.department,
        semester: user.student.semester,
        section: user.student.section,
        batch: user.student.batch,
        contactNumber: user.student.contactNumber,
      }
    : user.teacher
      ? {
          type: "teacher",
          teacherId: user.teacher.id,
          employeeId: user.teacher.employeeId,
          department: user.teacher.department,
          designation: user.teacher.designation,
          contactNumber: user.teacher.contactNumber,
        }
      : {
          type: "admin",
        };

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile,
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractBearerToken,
  parseCookies,
  createCookie,
  getRefreshCookieOptions,
  buildSafeAuthUser,
};
