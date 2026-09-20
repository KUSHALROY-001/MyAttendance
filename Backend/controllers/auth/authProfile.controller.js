const bcrypt = require("bcryptjs");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { prisma } = require("../../utils/prisma");
const { buildSafeAuthUser } = require("../../utils/auth.utils");
const { getUserForSession } = require("./authSession.controller");
const {
  isCloudinaryConfigured,
  buildAvatarPublicId,
  uploadAvatarBuffer,
  deleteAvatarFromCloudinary,
  resolveAvatarUrl,
} = require("../../utils/cloudinary");

const getProfile = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarPublicId: true,
      avatarUpdatedAt: true,
      institute: { select: { id: true, name: true, code: true } },
      student: {
        select: {
          rollNumber: true,
          enrollmentNumber: true,
          department: true,
          semester: true,
          section: true,
          batch: true,
          contactNumber: true,
        },
      },
      teacher: {
        select: {
          employeeId: true,
          department: true,
          designation: true,
          contactNumber: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // avatarPublicId/avatarUpdatedAt are internal (a Cloudinary asset id and
  // a cache-busting timestamp) - shaped into a plain avatarUrl the same
  // way buildSafeAuthUser does for /me, /login, /refresh, rather than
  // exposed as-is.
  const { avatarPublicId, avatarUpdatedAt, ...rest } = user;
  return res.status(200).json({
    profile: {
      ...rest,
      avatarUrl: resolveAvatarUrl({ avatarPublicId, avatarUpdatedAt }),
      hasCustomAvatar: Boolean(avatarPublicId),
    },
  });
});

// Uploads/replaces the user's custom profile picture. Always overwrites
// the same Cloudinary public_id (buildAvatarPublicId is keyed only on
// userId), so there's no separate "delete the old one first" step - the
// new upload simply replaces it in place, and the DB only ever needs to
// know the current one.
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }
  if (!req.file) {
    throw new ApiError(400, "No image file was uploaded.");
  }
  if (!req.file.buffer || req.file.buffer.length === 0) {
    throw new ApiError(400, "The uploaded file is empty.");
  }
  // Fail fast with a clear message before touching Cloudinary at all when
  // it isn't configured in this environment, rather than a confusing
  // 502 from deep inside uploadAvatarBuffer.
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      503,
      "Profile picture storage isn't configured on the server yet. Contact your administrator.",
    );
  }

  const publicId = buildAvatarPublicId(req.user.userId);
  // uploadAvatarBuffer already turns any Cloudinary failure into an
  // ApiError(502, ...) - let it propagate as-is rather than re-wrapping.
  await uploadAvatarBuffer(req.file.buffer, publicId);

  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { avatarPublicId: publicId, avatarUpdatedAt: new Date() },
      select: { avatarPublicId: true, avatarUpdatedAt: true },
    });
  } catch (error) {
    // Cloudinary already holds the new image under publicId at this
    // point - a DB failure here is a partial-success state worth its own
    // clear message rather than a generic 500, same reasoning as
    // question-assets.controller.js#uploadDiagramImage in PaperFlow.
    console.error(
      `Avatar uploaded to Cloudinary but saving it to user ${req.user.userId} failed:`,
      error,
    );
    throw new ApiError(
      500,
      "Your picture was uploaded but couldn't be saved to your profile. Please try again.",
    );
  }

  return res.status(200).json({
    message: "Profile picture updated successfully.",
    avatarUrl: resolveAvatarUrl(updatedUser),
    hasCustomAvatar: true,
  });
});

// Removes the custom avatar. There's nothing to "revert to" here (unlike
// PaperFlow, this app has no Google-login photo fallback) - display just
// goes back to initials, same as an account that never uploaded one.
const deleteAvatar = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const current = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { avatarPublicId: true },
  });
  if (!current) {
    throw new ApiError(404, "User not found.");
  }

  if (current.avatarPublicId) {
    await deleteAvatarFromCloudinary(current.avatarPublicId);
  }

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { avatarPublicId: null, avatarUpdatedAt: new Date() },
  });

  return res.status(200).json({
    message: "Profile picture removed.",
    avatarUrl: null,
    hasCustomAvatar: false,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  if (!newPassword) {
    throw new ApiError(400, "New password is required.");
  }

  if (String(newPassword).length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long.");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      password: true,
      mustChangePassword: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // The forced first-change flow (mustChangePassword: true) reaches this
  // endpoint only after the user has already authenticated with the real
  // current (default) password via /login — that login IS the proof, so
  // re-asking for it here just invites the classic browser-autofill trap:
  // several stacked password fields make Chrome/Edge/1Password treat the
  // "current password" field as part of a signup form and silently
  // overwrite it with a generated suggestion, which then fails the
  // bcrypt.compare below every time. Anywhere else changePassword is
  // called (a normal settings-page change, once one exists) still requires
  // and verifies currentPassword as before — this branch is decided by the
  // server-side flag, not anything the client sends, so it can't be used
  // to skip verification outside the intended first-login flow.
  if (!user.mustChangePassword) {
    if (!currentPassword) {
      throw new ApiError(400, "Current password is required.");
    }
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!passwordMatches) {
      throw new ApiError(401, "Current password is incorrect.");
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      // Clears the forced-change gate (see requirePasswordChange middleware)
      // for accounts created with a shared default password. A no-op write
      // for accounts that were never flagged.
      mustChangePassword: false,
    },
  });

  return res.status(200).json({
    message: "Password changed successfully.",
  });
});

// Students and teachers may only edit their own name and contact number from
// the profile page. Everything else (email, roll/enrollment number, employee
// ID, department, semester, section, batch, designation) is managed by the
// institute admin. Enforced here, not just in the UI, so a hand-crafted
// request can't bypass it.
//
// A client that still sends the full form is fine as long as the locked
// values are unchanged; a request that tries to CHANGE one is rejected.
const trimmed = (value) => String(value ?? "").trim();
const upperTrimmed = (value) => trimmed(value).toUpperCase();

const emailField = {
  field: "email",
  current: (user) => user.email,
  normalize: (value) => trimmed(value).toLowerCase(),
};

const SELF_EDIT_RULES = {
  STUDENT: {
    label: "Students",
    profileKey: "student",
    lockedFields: [
      emailField,
      {
        field: "rollNumber",
        current: (user) => user.student?.rollNumber,
        normalize: trimmed,
      },
      {
        field: "enrollmentNumber",
        current: (user) => user.student?.enrollmentNumber,
        normalize: trimmed,
      },
      {
        field: "department",
        current: (user) => user.student?.department,
        normalize: upperTrimmed,
      },
      {
        field: "semester",
        current: (user) => user.student?.semester,
        normalize: (value) => Number(value),
      },
      {
        field: "section",
        current: (user) => user.student?.section,
        normalize: upperTrimmed,
      },
      {
        field: "batch",
        current: (user) => user.student?.batch,
        normalize: trimmed,
      },
    ],
  },
  TEACHER: {
    label: "Teachers",
    profileKey: "teacher",
    lockedFields: [
      emailField,
      {
        field: "employeeId",
        current: (user) => user.teacher?.employeeId,
        normalize: trimmed,
      },
      {
        field: "department",
        current: (user) => user.teacher?.department,
        normalize: upperTrimmed,
      },
      {
        field: "designation",
        current: (user) => user.teacher?.designation,
        normalize: trimmed,
      },
    ],
  },
};

const findChangedLockedFields = (body, user, lockedFields) =>
  lockedFields
    .filter(({ field, current, normalize }) => {
      if (body[field] === undefined) return false;
      return normalize(body[field]) !== normalize(current(user));
    })
    .map(({ field }) => field);

const updateRestrictedProfile = async (req, res, currentUser, rules) => {
  const changedLockedFields = findChangedLockedFields(
    req.body,
    currentUser,
    rules.lockedFields,
  );
  if (changedLockedFields.length > 0) {
    throw new ApiError(
      403,
      `${rules.label} can only update their name and contact number. Please contact your institute admin to change other details.`,
    );
  }

  if (!currentUser[rules.profileKey]) {
    throw new ApiError(404, `${rules.label.slice(0, -1)} profile not found.`);
  }

  const name = trimmed(req.body.name);
  const contactNumber = trimmed(req.body.contactNumber);

  if (!name || !contactNumber) {
    throw new ApiError(400, "Name and contact number are required.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: currentUser.id },
      data: { name },
    });

    await tx[rules.profileKey].update({
      where: { userId: currentUser.id },
      data: { contactNumber },
    });
  });

  const updatedUser = await getUserForSession(currentUser.id);

  return res.status(200).json({
    message: "Profile updated successfully.",
    user: buildSafeAuthUser(updatedUser),
  });
};

const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError(401, "Authentication required.");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!currentUser) {
    throw new ApiError(404, "User not found.");
  }

  const selfEditRules = SELF_EDIT_RULES[currentUser.role];
  if (selfEditRules) {
    return updateRestrictedProfile(req, res, currentUser, selfEditRules);
  }

  // Admins / super admins: they have no student/teacher record, so the
  // editable profile is just their name and email.
  const name = trimmed(req.body.name);
  const email = trimmed(req.body.email).toLowerCase();

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required.");
  }

  const duplicateEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: currentUser.id },
    },
    select: { id: true },
  });

  if (duplicateEmail) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { name, email },
  });

  const updatedUser = await getUserForSession(currentUser.id);

  return res.status(200).json({
    message: "Profile updated successfully.",
    user: buildSafeAuthUser(updatedUser),
  });
});

module.exports = {
  getProfile,
  changePassword,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
};
