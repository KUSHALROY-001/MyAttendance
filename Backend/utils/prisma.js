const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  omit: {
    user: {
      createdAt: true,
      updatedAt: true,
      password: true,
    },
    student: {
      createdAt: true,
      updatedAt: true,
    },
    course: {
      createdAt: true,
      updatedAt: true,
    },
    courseAllocation: {
      createdAt: true,
      updatedAt: true,
    },
    departmentInfo: {
      createdAt: true,
      updatedAt: true,
    },
    teacher: {
      createdAt: true,
      updatedAt: true,
    },
  },
});

module.exports = { prisma };
