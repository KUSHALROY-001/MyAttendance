// One-time maintenance script — NOT a Prisma seed, and not something that
// runs on a schedule. Run once, manually, after the mustChangePassword
// migration lands, to flag accounts created *before* this feature existed
// that are still sitting on the shared default password:
//
//   node scripts/backfillMustChangePassword.js
//
// Safe to re-run: anyone who already changed their password won't match
// the default hash and is correctly left alone (mustChangePassword stays
// false for them).

const bcrypt = require("bcryptjs");
const { prisma } = require("../utils/prisma");

const DEFAULTS_BY_ROLE = {
  STUDENT: "password",
  TEACHER: "teacher",
};

async function main() {
  const candidates = await prisma.user.findMany({
    where: {
      role: { in: ["STUDENT", "TEACHER"] },
      mustChangePassword: false,
    },
    select: { id: true, email: true, role: true, password: true },
  });

  let flagged = 0;
  for (const user of candidates) {
    const defaultPassword = DEFAULTS_BY_ROLE[user.role];
    if (!defaultPassword) continue;

    const isStillDefault = await bcrypt.compare(defaultPassword, user.password);
    if (isStillDefault) {
      await prisma.user.update({
        where: { id: user.id },
        data: { mustChangePassword: true },
      });
      flagged++;
      console.log(`Flagged ${user.email} (${user.role})`);
    }
  }

  console.log(
    `\nDone. Flagged ${flagged} of ${candidates.length} checked accounts.`,
  );
}

main()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
