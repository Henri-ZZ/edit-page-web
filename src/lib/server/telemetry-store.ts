import { Prisma } from '@prisma/client';

import {
  MAX_ACCEPTED_BATCHES_PER_INSTALLATION_PER_DAY,
  MAX_STORED_COUNTER,
  SCHEMA_VERSION,
} from '@/lib/telemetry/constants';
import { isSameUuid, type TelemetryBatchRequestV1 } from '@/lib/telemetry/schema';
import { prisma } from './db';

export class RequestIdConflictError extends Error {}
export class TelemetryRateLimitError extends Error {}

/**
 * Record the post-uninstall signal (§6) for an already-validated UUIDv4.
 *
 * Returns whether a row was actually marked. `uninstalledAt: null` in the
 * filter makes this first-write-wins, so reloading the goodbye page — or
 * replaying a captured request — can never inflate the count.
 *
 * `lastSeenAt` is deliberately left untouched: it means "last accepted batch",
 * and overwriting it here would corrupt activity reporting. An id with no
 * stored row is a no-op rather than an error, because the caller must redirect
 * a real user to the goodbye page regardless.
 */
export async function recordUninstall(
  installationId: string,
  now = new Date(),
): Promise<boolean> {
  const updated = await prisma.installation.updateMany({
    where: { installationId, uninstalledAt: null },
    data: { uninstalledAt: now },
  });
  return updated.count > 0;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function acceptTelemetryBatch(batch: TelemetryBatchRequestV1, now = new Date()) {
  await prisma.$transaction(async (tx) => {
    const environment = batch.environment;
    const settings = batch.settings;
    const optionalPermissions = batch.optionalPermissions;
    await tx.installation.upsert({
      where: { installationId: batch.installationId },
      create: {
        installationId: batch.installationId,
        firstSeenAt: now,
        lastSeenAt: now,
        firstVersion: environment.extensionVersion,
        currentVersion: environment.extensionVersion,
        browser: environment.browser,
        browserMajorVersion: environment.browserMajorVersion,
        os: environment.os,
        locale: environment.locale,
        distribution: environment.distribution,
        licenseType: environment.licenseType,
        settings: settings ?? {},
        optionalPermissions: optionalPermissions ?? {},
      },
      update: {
        lastSeenAt: now,
        currentVersion: environment.extensionVersion,
        browser: environment.browser,
        browserMajorVersion: environment.browserMajorVersion,
        os: environment.os,
        locale: environment.locale,
        distribution: environment.distribution,
        licenseType: environment.licenseType,
        ...(settings ? { settings } : {}),
        ...(optionalPermissions ? { optionalPermissions } : {}),
      },
    });

    const claimed = await tx.$queryRaw<Array<{ requestId: string }>>(Prisma.sql`
      INSERT INTO "TelemetryRequest" ("requestId", "installationId", "acceptedAt")
      VALUES (${batch.requestId}::uuid, ${batch.installationId}::uuid, ${now})
      ON CONFLICT ("requestId") DO NOTHING
      RETURNING "requestId"::text AS "requestId"
    `);

    if (claimed.length === 0) {
      const existing = await tx.telemetryRequest.findUnique({
        where: { requestId: batch.requestId },
        select: { installationId: true },
      });
      if (!existing || !isSameUuid(existing.installationId, batch.installationId)) {
        throw new RequestIdConflictError();
      }
      return;
    }

    const acceptedToday = await tx.telemetryRequest.count({
      where: {
        installationId: batch.installationId,
        acceptedAt: { gte: startOfUtcDay(now) },
      },
    });
    if (acceptedToday > MAX_ACCEPTED_BATCHES_PER_INSTALLATION_PER_DAY) {
      throw new TelemetryRateLimitError();
    }

    for (const day of batch.usage) {
      const eventsJson = JSON.stringify(day.events);
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "UsageDaily" (
          "installationId", "date", "events", "createdAt", "updatedAt"
        ) VALUES (
          ${batch.installationId}::uuid, ${day.date}::date,
          ${eventsJson}::jsonb, ${now}, ${now}
        )
        ON CONFLICT ("installationId", "date") DO UPDATE
        SET "events" = "UsageDaily"."events" || (
              SELECT COALESCE(
                jsonb_object_agg(
                  incoming.key,
                  to_jsonb(
                    LEAST(
                      COALESCE(("UsageDaily"."events" ->> incoming.key)::bigint, 0)
                        + (incoming.value #>> '{}')::bigint,
                      ${MAX_STORED_COUNTER}::bigint
                    )
                  )
                ),
                '{}'::jsonb
              )
              FROM jsonb_each(${eventsJson}::jsonb) AS incoming
            ),
            "updatedAt" = ${now}
      `);
    }
  });

  return {
    accepted: true as const,
    schemaVersion: SCHEMA_VERSION,
    requestId: batch.requestId,
    serverTime: now.toISOString(),
  };
}
