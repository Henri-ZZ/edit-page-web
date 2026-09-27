import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  editPagePrisma?: PrismaClient;
};

export const prisma = globalForPrisma.editPagePrisma ?? new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.editPagePrisma = prisma;
}
