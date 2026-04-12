import { getSql } from '@/lib/db';
import type { LicensePlan } from '@/lib/license';
import type { Sql } from 'postgres';

type UpsertLicenseInput = {
  email: string;
  licenseKeyHash: string;
  orderId: string;
  plan: LicensePlan;
  priceId?: string | null;
};

type ActivateLicenseInput = {
  deviceId: string;
  extensionVersion?: string | null;
  ipAddress?: string | null;
  licenseKeyHash: string;
  userAgent?: string | null;
};

type VerifyLicenseInput = {
  deviceId: string;
  extensionVersion?: string | null;
  ipAddress?: string | null;
  licenseKeyHash: string;
  userAgent?: string | null;
};

type LicenseRecord = {
  created_at: string;
  email: string;
  id: number;
  max_devices: number;
  order_id: string;
  plan: LicensePlan;
  price_id: string | null;
  status: 'active' | 'revoked';
};

type ActivationRow = {
  device_id: string;
  first_seen_at: string;
  id: number;
};

let schemaReadyPromise: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReadyPromise) {
    const sql = getSql();
    schemaReadyPromise = (async () => {
      await sql`
        create table if not exists licenses (
          id bigserial primary key,
          order_id text not null unique,
          email text not null,
          plan text not null,
          price_id text,
          license_key_hash text not null unique,
          status text not null default 'active',
          max_devices integer not null default 2,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          last_emailed_at timestamptz
        )
      `;

      await sql`
        create table if not exists license_activations (
          id bigserial primary key,
          license_id bigint not null references licenses(id) on delete cascade,
          device_id text not null,
          extension_version text,
          first_ip text,
          last_ip text,
          user_agent text,
          activated_at timestamptz not null default now(),
          first_seen_at timestamptz not null default now(),
          last_seen_at timestamptz not null default now(),
          revoked_at timestamptz,
          replaced_by_activation_id bigint references license_activations(id) on delete set null,
          unique (license_id, device_id)
        )
      `;

      await sql`
        create index if not exists license_activations_license_active_idx
          on license_activations (license_id, first_seen_at)
          where revoked_at is null
      `;
    })();
  }

  return schemaReadyPromise;
}

async function findLicenseByHashWithSql(sql: Sql, licenseKeyHash: string) {
  const [row] = await sql<LicenseRecord[]>`
    select id, email, order_id, plan, price_id, max_devices, status, created_at
    from licenses
    where license_key_hash = ${licenseKeyHash}
    limit 1
  `;

  return row ?? null;
}

export async function upsertLicense(input: UpsertLicenseInput) {
  await ensureSchema();
  const sql = getSql();

  const [row] = await sql<LicenseRecord[]>`
    insert into licenses (
      order_id,
      email,
      plan,
      price_id,
      license_key_hash,
      max_devices,
      last_emailed_at,
      updated_at
    ) values (
      ${input.orderId},
      ${input.email},
      ${input.plan},
      ${input.priceId ?? null},
      ${input.licenseKeyHash},
      2,
      now(),
      now()
    )
    on conflict (order_id) do update set
      email = excluded.email,
      plan = excluded.plan,
      price_id = excluded.price_id,
      license_key_hash = excluded.license_key_hash,
      updated_at = now(),
      last_emailed_at = now()
    returning id, email, order_id, plan, price_id, max_devices, status, created_at
  `;

  return row;
}

async function findLicenseByHash(licenseKeyHash: string) {
  await ensureSchema();
  const sql = getSql();
  return findLicenseByHashWithSql(sql, licenseKeyHash);
}

export async function activateLicense(input: ActivateLicenseInput) {
  await ensureSchema();
  const sql = getSql();

  return sql.begin(async (tx) => {
    const license = await findLicenseByHashWithSql(tx, input.licenseKeyHash);
    if (!license || license.status !== 'active') {
      return { ok: false as const, reason: 'invalid_license' as const };
    }

    const [existingActivation] = await tx<ActivationRow[]>`
      select id, device_id, first_seen_at
      from license_activations
      where license_id = ${license.id}
        and device_id = ${input.deviceId}
        and revoked_at is null
      limit 1
    `;

    if (existingActivation) {
      await tx`
        update license_activations
        set
          extension_version = ${input.extensionVersion ?? null},
          last_ip = ${input.ipAddress ?? null},
          user_agent = ${input.userAgent ?? null},
          last_seen_at = now()
        where id = ${existingActivation.id}
      `;

      return {
        ok: true as const,
        activationsUsed: null,
        deviceId: input.deviceId,
        license,
        mode: 'existing' as const,
        replacedDeviceId: null,
      };
    }

    const activeActivations = await tx<ActivationRow[]>`
      select id, device_id, first_seen_at
      from license_activations
      where license_id = ${license.id}
        and revoked_at is null
      order by first_seen_at asc
    `;

    let replacedDeviceId: string | null = null;

    if (activeActivations.length >= license.max_devices) {
      const oldestActivation = activeActivations[0];
      replacedDeviceId = oldestActivation.device_id;

      await tx`
        update license_activations
        set revoked_at = now()
        where id = ${oldestActivation.id}
      `;
    }

    const [inserted] = await tx<{ id: number }[]>`
      insert into license_activations (
        license_id,
        device_id,
        extension_version,
        first_ip,
        last_ip,
        user_agent
      ) values (
        ${license.id},
        ${input.deviceId},
        ${input.extensionVersion ?? null},
        ${input.ipAddress ?? null},
        ${input.ipAddress ?? null},
        ${input.userAgent ?? null}
      )
      returning id
    `;

    if (replacedDeviceId) {
      await tx`
        update license_activations
        set replaced_by_activation_id = ${inserted.id}
        where license_id = ${license.id}
          and device_id = ${replacedDeviceId}
          and revoked_at is not null
          and replaced_by_activation_id is null
      `;
    }

    return {
      ok: true as const,
      activationsUsed: Math.min(activeActivations.length + 1, license.max_devices),
      deviceId: input.deviceId,
      license,
      mode: 'new' as const,
      replacedDeviceId,
    };
  });
}

export async function verifyLicense(input: VerifyLicenseInput) {
  await ensureSchema();
  const sql = getSql();

  return sql.begin(async (tx) => {
    const license = await findLicenseByHashWithSql(tx, input.licenseKeyHash);
    if (!license || license.status !== 'active') {
      return { ok: false as const, reason: 'invalid_license' as const };
    }

    const [activation] = await tx<{ id: number }[]>`
      select id
      from license_activations
      where license_id = ${license.id}
        and device_id = ${input.deviceId}
        and revoked_at is null
      limit 1
    `;

    if (!activation) {
      return { ok: false as const, reason: 'device_not_activated' as const, license };
    }

    await tx`
      update license_activations
      set
        extension_version = ${input.extensionVersion ?? null},
        last_ip = ${input.ipAddress ?? null},
        user_agent = ${input.userAgent ?? null},
        last_seen_at = now()
      where id = ${activation.id}
    `;

    return { ok: true as const, deviceId: input.deviceId, license };
  });
}
