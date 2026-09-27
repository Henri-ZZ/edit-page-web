import { z } from 'zod';

import {
  ALLOWED_COUNTER_KEYS,
  BROWSERS,
  DISTRIBUTIONS,
  LICENSE_TYPES,
  MAX_COUNTER_PER_KEY_PER_BATCH,
  MAX_EVENT_AGE_DAYS,
  MAX_FUTURE_DATE_DAYS,
  MAX_SENT_AT_AGE_DAYS,
  MAX_TOTAL_COUNTERS_PER_BATCH,
  MAX_USAGE_DAYS,
  OPERATING_SYSTEMS,
  SCHEMA_VERSION,
} from './constants';

const DAY_MS = 86_400_000;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UTC_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EXTENSION_VERSION = /^\d+(?:\.\d+){0,3}(?:[-+][0-9A-Za-z.-]+)?$/;

const environmentSchema = z.object({
  extensionVersion: z.string().min(1).max(32).regex(EXTENSION_VERSION),
  browser: z.enum(BROWSERS),
  browserMajorVersion: z.number().int().min(1).max(999).optional(),
  os: z.enum(OPERATING_SYSTEMS),
  locale: z.string().min(2).max(35),
  distribution: z.enum(DISTRIBUTIONS),
  licenseType: z.enum(LICENSE_TYPES),
}).strict();

const dailyUsageSchema = z.object({
  date: z.string().regex(UTC_DATE),
  events: z.record(z.number().int().min(0).max(MAX_COUNTER_PER_KEY_PER_BATCH)),
}).strict();

const requestSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  requestId: z.string().regex(UUID_V4),
  installationId: z.string().regex(UUID_V4),
  sentAt: z.string().datetime({ offset: true }).max(35),
  environment: environmentSchema,
  usage: z.array(dailyUsageSchema).min(1).max(MAX_USAGE_DAYS),
}).strict();

export type TelemetryCounterKey = string;

export interface TelemetryEnvironmentV1 {
  extensionVersion: string;
  browser: (typeof BROWSERS)[number];
  browserMajorVersion?: number;
  os: (typeof OPERATING_SYSTEMS)[number];
  locale: string;
  distribution: (typeof DISTRIBUTIONS)[number];
  licenseType: (typeof LICENSE_TYPES)[number];
}

export interface DailyUsageV1 {
  date: string;
  events: Record<TelemetryCounterKey, number>;
}

export interface TelemetryBatchRequestV1 {
  schemaVersion: 1;
  requestId: string;
  installationId: string;
  sentAt: string;
  environment: TelemetryEnvironmentV1;
  usage: DailyUsageV1[];
}

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function parseUtcDate(value: string): number | null {
  if (!UTC_DATE.test(value)) return null;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : null;
}

function normalizeLocale(locale: string): string | null {
  try {
    const normalized = new Intl.Locale(locale).toString();
    return normalized.length <= 35 ? normalized : null;
  } catch {
    return null;
  }
}

export function parseTelemetryBatchV1(raw: unknown, now = new Date()): TelemetryBatchRequestV1 {
  const parsed = requestSchema.parse(raw);
  const sentAtMs = Date.parse(parsed.sentAt);
  const nowMs = now.getTime();

  if (!Number.isFinite(sentAtMs)) {
    throw new z.ZodError([{ code: 'custom', path: ['sentAt'], message: 'invalid timestamp' }]);
  }
  if (sentAtMs < nowMs - MAX_SENT_AT_AGE_DAYS * DAY_MS || sentAtMs > nowMs + MAX_FUTURE_DATE_DAYS * DAY_MS) {
    throw new z.ZodError([{ code: 'custom', path: ['sentAt'], message: 'timestamp outside allowed window' }]);
  }

  const locale = normalizeLocale(parsed.environment.locale);
  if (!locale) {
    throw new z.ZodError([{ code: 'custom', path: ['environment', 'locale'], message: 'invalid locale' }]);
  }

  const today = startOfUtcDay(now);
  const earliest = today - MAX_EVENT_AGE_DAYS * DAY_MS;
  const latest = today + MAX_FUTURE_DATE_DAYS * DAY_MS;
  const seenDates = new Set<string>();
  let previousDate = '';
  let totalCounters = 0;

  const usage = parsed.usage.map((day, dayIndex) => {
    const dateMs = parseUtcDate(day.date);
    if (dateMs === null || dateMs < earliest || dateMs > latest) {
      throw new z.ZodError([{ code: 'custom', path: ['usage', dayIndex, 'date'], message: 'date outside allowed window' }]);
    }
    if (seenDates.has(day.date) || (previousDate && day.date <= previousDate)) {
      throw new z.ZodError([{ code: 'custom', path: ['usage', dayIndex, 'date'], message: 'dates must be sorted and unique' }]);
    }
    seenDates.add(day.date);
    previousDate = day.date;

    const events: Record<string, number> = {};
    for (const [key, count] of Object.entries(day.events)) {
      if (!ALLOWED_COUNTER_KEYS.has(key)) {
        throw new z.ZodError([{ code: 'custom', path: ['usage', dayIndex, 'events', key], message: 'unknown event' }]);
      }
      if (count === 0) continue;
      events[key] = count;
      totalCounters += count;
    }
    if (Object.keys(events).length === 0) {
      throw new z.ZodError([{ code: 'custom', path: ['usage', dayIndex, 'events'], message: 'at least one positive counter is required' }]);
    }
    return { date: day.date, events };
  });

  if (totalCounters > MAX_TOTAL_COUNTERS_PER_BATCH) {
    throw new z.ZodError([{ code: 'custom', path: ['usage'], message: 'counter total exceeds limit' }]);
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    requestId: parsed.requestId,
    installationId: parsed.installationId,
    sentAt: new Date(sentAtMs).toISOString(),
    environment: { ...parsed.environment, locale },
    usage,
  };
}

export function validationFieldPaths(error: z.ZodError): string[] {
  return [...new Set(error.issues.map((issue) => issue.path.join('.')).filter(Boolean))].slice(0, 12);
}
