import { createHmac } from 'node:crypto';

export type LicensePlan = 'lifetime' | 'custom';
export type LicenseLocale = 'en' | 'zh';

type AuthorizationCodeInput = {
  email: string;
  orderId: string;
  plan: LicensePlan;
};

function toGroupedCode(value: string) {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
  const chunks = normalized.match(/.{1,5}/g) ?? [];
  return chunks.join('-');
}

export function normalizeAuthorizationCode(code: string) {
  return toGroupedCode(code);
}

export function getPlanLabel(plan: LicensePlan, locale: LicenseLocale = 'en') {
  switch (plan) {
    case 'lifetime':
      return locale === 'zh' ? '永久授权' : 'Perpetual License';
    default:
      return locale === 'zh' ? '自定义授权' : 'Custom License';
  }
}

export function generateAuthorizationCode(
  input: AuthorizationCodeInput,
  secret: string,
) {
  const payload = `${input.orderId}:${input.email.trim().toLowerCase()}:${input.plan}`;
  const digest = createHmac('sha256', secret).update(payload).digest('base64url');
  return toGroupedCode(digest);
}

export function hashAuthorizationCode(code: string, secret: string) {
  return createHmac('sha256', secret).update(normalizeAuthorizationCode(code)).digest('hex');
}
