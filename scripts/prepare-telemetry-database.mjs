import { PrismaClient } from '@prisma/client';
import { spawnSync } from 'node:child_process';

const BASELINE_MIGRATION = '20260926000000_legacy_database_baseline';
const prisma = new PrismaClient({ log: ['error'] });

try {
  const [result] = await prisma.$queryRaw`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    ) AS "exists"
  `;

  if (!result?.exists) {
    console.log(`No Prisma migration history found; recording ${BASELINE_MIGRATION}.`);
    const resolved = spawnSync(
      'pnpm',
      ['exec', 'prisma', 'migrate', 'resolve', '--applied', BASELINE_MIGRATION],
      { stdio: 'inherit', env: process.env },
    );
    if (resolved.error) throw resolved.error;
    if (resolved.status !== 0) {
      throw new Error(`Failed to record database baseline (exit ${resolved.status ?? 'unknown'}).`);
    }
  } else {
    console.log('Prisma migration history already exists; baseline preparation skipped.');
  }
} finally {
  await prisma.$disconnect();
}
