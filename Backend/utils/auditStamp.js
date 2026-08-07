// Shared helper for stamping who created/last touched a record.
// actorUserId is always req.user.userId (attached by auth.middleware.js).
//
// Usage:
//   await tx.student.create({ data: { ...fields, ...stampOnCreate(req.user.userId) } });
//   await tx.student.update({ data: { ...fields, ...stampOnUpdate(req.user.userId) } });

const stampOnCreate = (actorUserId) => ({
  createdById: actorUserId ?? null,
  updatedById: actorUserId ?? null,
});

const stampOnUpdate = (actorUserId) => ({
  updatedById: actorUserId ?? null,
});

// Shared { select: { name, email } } shape for resolving createdBy/updatedBy
// on any detail-endpoint query — keeps every controller's response shape
// consistent.
const auditActorSelect = { select: { name: true, email: true } };

module.exports = { stampOnCreate, stampOnUpdate, auditActorSelect };
