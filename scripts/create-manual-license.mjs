import { createHmac } from 'node:crypto';
import postgres from 'postgres';

function usage() {
  console.log(
    'Usage: npm run create:license -- <email> [--order-id=manual_xxx] [--plan=lifetime] [--price-id=pri_xxx]',
  );
}

function toGroupedCode(value) {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
  const chunks = normalized.match(/.{1,5}/g) ?? [];
  return chunks.join('-');
}

function generateAuthorizationCode({ email, orderId, plan }, secret) {
  const payload = `${orderId}:${email.trim().toLowerCase()}:${plan}`;
  const digest = createHmac('sha256', secret).update(payload).digest('base64url');
  return toGroupedCode(digest);
}

function hashAuthorizationCode(code, secret) {
  return createHmac('sha256', secret).update(toGroupedCode(code)).digest('hex');
}

const [, , emailArg, ...restArgs] = process.argv;

if (!emailArg || emailArg.startsWith('--')) {
  usage();
  process.exit(1);
}

const options = Object.fromEntries(
  restArgs
    .filter((arg) => arg.startsWith('--') && arg.includes('='))
    .map((arg) => {
      const [key, ...valueParts] = arg.slice(2).split('=');
      return [key, valueParts.join('=')];
    }),
);

const email = emailArg.trim().toLowerCase();
const orderId = options['order-id'] || `manual_${Date.now()}`;
const plan = options.plan || 'lifetime';
const priceId = options['price-id'] || null;

const databaseUrl = process.env.POSTGRES_URL;
const secret = process.env.LICENSE_KEY_SECRET;

if (!databaseUrl) {
  console.error('Missing POSTGRES_URL');
  process.exit(1);
}

if (!secret) {
  console.error('Missing LICENSE_KEY_SECRET');
  process.exit(1);
}

if (!['lifetime', 'custom'].includes(plan)) {
  console.error('Plan must be lifetime or custom');
  process.exit(1);
}

const authorizationCode = generateAuthorizationCode({ email, orderId, plan }, secret);
const licenseKeyHash = hashAuthorizationCode(authorizationCode, secret);
const sql = postgres(databaseUrl, { prepare: false });

try {
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
      ${orderId},
      ${email},
      ${plan},
      ${priceId},
      ${licenseKeyHash},
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
  `;

  console.log(JSON.stringify({
    email,
    orderId,
    plan,
    priceId,
    licenseKey: authorizationCode,
  }, null, 2));
} finally {
  await sql.end({ timeout: 5 });
}
