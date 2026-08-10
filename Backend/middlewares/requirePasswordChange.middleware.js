const ApiError = require("../utils/ApiError");
const { prisma } = require("../utils/prisma");

// Exact paths a user with mustChangePassword=true is still allowed to hit.
// Keep this list short and explicit — anything not here is blocked. These
// all live under /api/auth, which never mounts this middleware itself, so
// this allowlist only matters if that ever changes.
const ALLOWED_PATHS = new Set([
  "/api/auth/change-password",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/auth/refresh",
]);

// Must run after `authenticate` (needs req.user.userId). Blocks every route
// on the router it's mounted on until the account's mustChangePassword flag
// is cleared — a frontend redirect alone can be skipped via devtools or a
// direct API call, so this is the actual enforcement point.
//
// Deliberately re-reads the flag from the DB on every request rather than
// trusting the JWT payload: the flag can flip mid-session (right after the
// user submits the change-password form) and the access token isn't
// reissued at that moment, so the token payload would be stale. This
// mirrors the per-request lookup authProfile.controller.js's
// getProfile/getCurrentUser already do.
const requirePasswordChange = async (req, res, next) => {
  try {
    const path = req.originalUrl.split("?")[0];
    if (ALLOWED_PATHS.has(path)) {
      return next();
    }

    if (!req.user?.userId) {
      throw new ApiError(401, "Authentication required.");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { mustChangePassword: true },
    });

    if (user?.mustChangePassword) {
      throw new ApiError(
        403,
        "You must change your password before continuing.",
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { requirePasswordChange };
