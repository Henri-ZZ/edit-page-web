import { getSql } from '@/lib/db';

type TrialFingerprintInput = {
  fingerprintHash: string;
  ipAddress?: string | null;
  language?: string | null;
  platform?: string | null;
  screen?: string | null;
  timeZone?: string | null;
  userAgent?: string | null;
};

let schemaReadyPromise: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReadyPromise) {
    const sql = getSql();
    schemaReadyPromise = (async () => {
      await sql`
        create table if not exists trial_fingerprints (
          id bigserial primary key,
          fingerprint_hash text not null unique,
          status text not null default 'active',
          exhausted_at timestamptz,
          first_seen_at timestamptz not null default now(),
          last_seen_at timestamptz not null default now(),
          first_ip text,
          last_ip text,
          user_agent text,
          language text,
          platform text,
          screen text,
          time_zone text
        )
      `;
    })();
  }

  return schemaReadyPromise;
}

export async function getTrialFingerprintStatus(fingerprintHash: string) {
  await ensureSchema();
  const sql = getSql();

  const [row] = await sql<{ exhausted_at: string | null; status: string }[]>`
    select status, exhausted_at
    from trial_fingerprints
    where fingerprint_hash = ${fingerprintHash}
    limit 1
  `;

  return {
    exhausted: row?.status === 'exhausted',
    found: Boolean(row),
  };
}

export async function upsertTrialFingerprintSeen(input: TrialFingerprintInput) {
  await ensureSchema();
  const sql = getSql();

  await sql`
    insert into trial_fingerprints (
      fingerprint_hash,
      first_ip,
      last_ip,
      user_agent,
      language,
      platform,
      screen,
      time_zone
    ) values (
      ${input.fingerprintHash},
      ${input.ipAddress ?? null},
      ${input.ipAddress ?? null},
      ${input.userAgent ?? null},
      ${input.language ?? null},
      ${input.platform ?? null},
      ${input.screen ?? null},
      ${input.timeZone ?? null}
    )
    on conflict (fingerprint_hash) do update set
      last_seen_at = now(),
      last_ip = excluded.last_ip,
      user_agent = excluded.user_agent,
      language = excluded.language,
      platform = excluded.platform,
      screen = excluded.screen,
      time_zone = excluded.time_zone
  `;
}

export async function markTrialFingerprintExhausted(input: TrialFingerprintInput) {
  await ensureSchema();
  const sql = getSql();

  await sql`
    insert into trial_fingerprints (
      fingerprint_hash,
      status,
      exhausted_at,
      first_ip,
      last_ip,
      user_agent,
      language,
      platform,
      screen,
      time_zone
    ) values (
      ${input.fingerprintHash},
      'exhausted',
      now(),
      ${input.ipAddress ?? null},
      ${input.ipAddress ?? null},
      ${input.userAgent ?? null},
      ${input.language ?? null},
      ${input.platform ?? null},
      ${input.screen ?? null},
      ${input.timeZone ?? null}
    )
    on conflict (fingerprint_hash) do update set
      status = 'exhausted',
      exhausted_at = coalesce(trial_fingerprints.exhausted_at, now()),
      last_seen_at = now(),
      last_ip = excluded.last_ip,
      user_agent = excluded.user_agent,
      language = excluded.language,
      platform = excluded.platform,
      screen = excluded.screen,
      time_zone = excluded.time_zone
  `;
}
