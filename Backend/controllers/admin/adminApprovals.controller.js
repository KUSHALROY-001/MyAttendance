const { prisma } = require("../../utils/prisma");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const {
  stampOnCreate,
  stampOnUpdate,
} = require("../../utils/auditStamp");

const formatPendingStudent = (user) => ({
  userId: user.id,
  name: user.name,
  email: user.email,
  requestedAt: user.createdAt,
  studentId: user.student?.id,
  rollNumber: user.student?.rollNumber,
  enrollmentNumber: user.student?.enrollmentNumber,
  department: user.student?.department,
  semester: user.student?.semester,
  section: user.student?.section,
  batch: user.student?.batch,
  contactNumber: user.student?.contactNumber,
});

const readPendingStudents = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      instituteId: req.user.instituteId,
      role: "STUDENT",
      status: "PENDING",
    },
    orderBy: { createdAt: "asc" },
    include: { student: true },
  });

  res.status(200).json(users.map(formatPendingStudent));
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const approvePendingStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
      instituteId: req.user.instituteId,
      role: "STUDENT",
    },
    select: { id: true, status: true },
  });

  if (!user) {
    throw new ApiError(404, "Pending signup not found.");
  }

  if (user.status !== "PENDING") {
    throw new ApiError(400, "This signup has already been reviewed.");
  }

  // Approval is treated as the record's effective "creation" moment for
  // audit purposes — a self-signup student has no admin-side creator until
  // an admin vouches for them here, so both createdBy and updatedBy get
  // stamped with the approving admin, on both the User row and the Student
  // profile row it owns.
  const updated = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { status: "ACTIVE", ...stampOnCreate(req.user.userId) },
      include: { student: true },
    });

    if (updatedUser.student) {
      await tx.student.update({
        where: { id: updatedUser.student.id },
        data: stampOnCreate(req.user.userId),
      });
    }

    return updatedUser;
  });

  res.status(200).json({
    message: `${updated.name} has been approved and can now log in.`,
    student: formatPendingStudent(updated),
  });
});

/*+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
const rejectPendingStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
      instituteId: req.user.instituteId,
      role: "STUDENT",
    },
    select: { id: true, status: true, name: true },
  });

  if (!user) {
    throw new ApiError(404, "Pending signup not found.");
  }

  if (user.status !== "PENDING") {
    throw new ApiError(400, "This signup has already been reviewed.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { status: "REJECTED", ...stampOnUpdate(req.user.userId) },
  });

  res.status(200).json({
    message: `${user.name}'s signup request has been rejected.`,
  });
});

module.exports = {
  readPendingStudents,
  approvePendingStudent,
  rejectPendingStudent,
};
