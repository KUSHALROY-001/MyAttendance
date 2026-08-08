const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { prisma } = require("../../utils/prisma");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseCookies,
  createCookie,
  getRefreshCookieOptions,
  buildSafeAuthUser,
} = require("../../utils/auth.utils");

const getUserForSession = async (userId) => {
  return prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      student: true,
      teacher: true,
      institute: { select: { id: true, name: true, code: true } },
    },
  });
};

const ensureActiveStatus = (user) => {
  if (user.status === "PENDING") {
    throw new ApiError(
      403,
      "Your account is awaiting approval from your institute admin.",
    );
  }
  if (user.status === "REJECTED") {
    throw new ApiError(
      403,
      "Your signup request was not approved. Please contact your institute admin.",
    );
  }
};

const issueAuthResponse = async (res, user) => {
  const safeUser = buildSafeAuthUser(user);
  const payload = {
    userId: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 0,
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

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      status: true,
      tokenVersion: true,
      student: true,
      teacher: true,
      institute: { select: { id: true, name: true, code: true } },
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  ensureActiveStatus(user);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { tokenVersion: { increment: 1 } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      tokenVersion: true,
      student: true,
      teacher: true,
      institute: { select: { id: true, name: true, code: true } },
    },
  });

  return issueAuthResponse(res, updatedUser);
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

  ensureActiveStatus(user);

  if (
    payload.tokenVersion !== undefined &&
    user.tokenVersion !== payload.tokenVersion
  ) {
    throw new ApiError(
      401,
      "Session expired. You were logged out because a new login occurred on another device.",
    );
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

  ensureActiveStatus(user);

  return res.status(200).json({
    user: buildSafeAuthUser(user),
  });
});

module.exports = {
  login,
  refreshSession,
  logout,
  getCurrentUser,
  getUserForSession,
  issueAuthResponse,
};
