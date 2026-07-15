const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../utils/prisma");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseCookies,
  createCookie,
  getRefreshCookieOptions,
  buildSafeAuthUser,
} = require("../utils/auth.utils");

const authPrisma = new PrismaClient();

const getUserForSession = async (userId) => {
  return prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      student: true,
      teacher: true,
    },
  });
};

const issueAuthResponse = async (res, user) => {
  const safeUser = buildSafeAuthUser(user);
  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshCookie = createCookie(
    "refreshToken",
    refreshToken,
    getRefreshCookieOptions(),
  );

  res.setHeader("Set-Cookie", refreshCookie);

  return res.status(200).json({
    message: "Authentication successful.",
    accessToken,
    user: safeUser,
  });
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await authPrisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      student: true,
      teacher: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return issueAuthResponse(res, user);
});

const refreshSession = asyncHandler(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token.");
  }

  const user = await getUserForSession(payload.userId);
  if (!user) {
    throw new ApiError(401, "User session is no longer valid.");
  }

  return issueAuthResponse(res, user);
});

const logout = asyncHandler(async (req, res) => {
  const expiredCookie = createCookie("refreshToken", "", {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", expiredCookie);

  return res.status(200).json({ message: "Logged out successfully." });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await getUserForSession(req.user.userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res.status(200).json({
    user: buildSafeAuthUser(user),
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required.");
  }

  if (String(newPassword).length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long.");
  }

  const user = await authPrisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authPrisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return res.status(200).json({
    message: "Password changed successfully.",
  });
});

module.exports = {
  login,
  refreshSession,
  logout,
  getCurrentUser,
  changePassword,
};
