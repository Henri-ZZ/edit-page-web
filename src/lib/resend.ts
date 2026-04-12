import { getPlanLabel, type LicensePlan } from '@/lib/license';

type SendLicenseEmailInput = {
  authorizationCode: string;
  email: string;
  orderId: string;
  plan: LicensePlan;
};

function getRequiredEnv(name: string) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildEmailHtml(input: SendLicenseEmailInput) {
  const planLabel = getPlanLabel(input.plan);
  const code = escapeHtml(input.authorizationCode);
  const orderId = escapeHtml(input.orderId);

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h1 style="font-size: 20px; margin-bottom: 16px;">Your Edit Page authorization code</h1>
      <p>Thanks for your purchase.</p>
      <p><strong>Plan:</strong> ${planLabel}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin: 24px 0;">
        <span style="display: inline-block; font-size: 24px; letter-spacing: 1px; font-weight: 700; background: #f3f4f6; padding: 12px 16px; border-radius: 10px;">
          ${code}
        </span>
      </p>
      <p>Enter this code in the Edit Page app or extension to activate your purchase.</p>
    </div>
  `.trim();
}

function buildEmailText(input: SendLicenseEmailInput) {
  return [
    'Your Edit Page authorization code',
    '',
    `Plan: ${getPlanLabel(input.plan)}`,
    `Order ID: ${input.orderId}`,
    `Authorization Code: ${input.authorizationCode}`,
    '',
    'Enter this code in the Edit Page app or extension to activate your purchase.',
  ].join('\n');
}

export async function sendLicenseEmail(input: SendLicenseEmailInput) {
  const apiKey = getRequiredEnv('RESEND_API_KEY');
  const from = getRequiredEnv('RESEND_FROM_EMAIL');
  const replyTo = import.meta.env.RESEND_REPLY_TO || undefined;

  console.log('[resend] Sending authorization email', {
    to: input.email,
    orderId: input.orderId,
    plan: input.plan,
    from,
    hasReplyTo: Boolean(replyTo),
  });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `edit-page-license-${input.orderId}`,
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: 'Your Edit Page authorization code',
      html: buildEmailHtml(input),
      text: buildEmailText(input),
      ...(replyTo ? { replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[resend] Request failed', {
      status: response.status,
      errorText,
      orderId: input.orderId,
      to: input.email,
    });
    throw new Error(`Resend request failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('[resend] Email accepted by Resend', {
    id: result.id ?? null,
    orderId: input.orderId,
    to: input.email,
  });
  return result.id as string | undefined;
}
