const { prisma } = require("../../utils/prisma");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");

const getInstituteSettings = asyncHandler(async (req, res) => {
  const institute = await prisma.institute.findUnique({
    where: { id: req.user.instituteId },
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      allowedEmailDomains: true,
      createdAt: true,
    },
  });

  if (!institute) {
    throw new ApiError(404, "Institute not found.");
  }

  res.status(200).json(institute);
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const updateInstituteSettings = asyncHandler(async (req, res) => {
  if (req.user?.role !== "SUPER_ADMIN") {
    throw new ApiError(
      403,
      "Forbidden: Only Super Admins have permission to modify institute settings.",
    );
  }

  const { name, address, allowedEmailDomains } = req.body;

  // The join code is deliberately NOT editable here — it's already been
  // shared with students/teachers, and silently changing it would lock
  // them out with no explanation. Renaming it would need its own,
  // higher-friction flow (e.g. re-notifying everyone), not a quiet PATCH.
  if (!name || !String(name).trim()) {
    throw new ApiError(400, "Institute name is required.");
  }

  const normalizedAllowedDomains =
    allowedEmailDomains !== undefined
      ? String(allowedEmailDomains)
          .split(",")
          .map((d) => d.trim().toLowerCase())
          .filter(Boolean)
          .join(",") || null
      : undefined;

  const updated = await prisma.institute.update({
    where: { id: req.user.instituteId },
    data: {
      name: String(name).trim(),
      ...(address !== undefined && { address: String(address).trim() || null }),
      ...(normalizedAllowedDomains !== undefined && {
        allowedEmailDomains: normalizedAllowedDomains,
      }),
    },
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      allowedEmailDomains: true,
      createdAt: true,
    },
  });

  res.status(200).json(updated);
});

module.exports = {
  getInstituteSettings,
  updateInstituteSettings,
};
