import type { APIRoute } from 'astro';

import { prisma } from '@/lib/server/db';

export const prerender = false;

function monthsAgo(date: Date, months: number): Date {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() - months);
  return result;
}

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const now = new Date();
  const requestCutoff = new Date(now.getTime() - 30 * 86_400_000);
  const analyticsCutoff = monthsAgo(now, 13);

  const [requests, usage, installations] = await prisma.$transaction([
    prisma.telemetryRequest.deleteMany({ where: { acceptedAt: { lt: requestCutoff } } }),
    prisma.usageDaily.deleteMany({ where: { date: { lt: analyticsCutoff } } }),
    prisma.installation.deleteMany({ where: { lastSeenAt: { lt: analyticsCutoff } } }),
  ]);

  return new Response(JSON.stringify({
    ok: true,
    deleted: {
      telemetryRequests: requests.count,
      usageDays: usage.count,
      installations: installations.count,
    },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
