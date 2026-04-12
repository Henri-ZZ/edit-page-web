import { getPlanLabel, type LicensePlan } from '@/lib/license';

type SendLicenseEmailInput = {
  authorizationCode: string;
  currencyCode?: string | null;
  email: string;
  orderId: string;
  plan: LicensePlan;
};

type EmailCopy = {
  greeting: string;
  intro: string;
  instruction: string;
  orderLabel: string;
  planLabel: string;
  codeLabel: string;
  subject: string;
  support: string;
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

function getEmailCopy(input: SendLicenseEmailInput): EmailCopy {
  const isChinese = input.currencyCode === 'CNY';

  if (isChinese) {
    return {
      greeting: '您的 Edit Page 授权码',
      intro: '感谢购买。以下是您的授权信息。',
      instruction: '请在 Edit Page extension 中输入此授权码完成激活。',
      orderLabel: '订单号',
      planLabel: '套餐',
      codeLabel: '授权码',
      subject: '您的 Edit Page 授权码',
      support: '如有问题，请直接回复此邮件。',
    };
  }

  return {
    greeting: 'Your Edit Page license code',
    intro: 'Thanks for your purchase. Your license details are below.',
    instruction: 'Enter this code in the Edit Page extension to activate your purchase.',
    orderLabel: 'Order ID',
    planLabel: 'Plan',
    codeLabel: 'License code',
    subject: 'Your Edit Page license code',
    support: 'If you need help, you can reply to this email.',
  };
}

function buildEmailHtml(input: SendLicenseEmailInput) {
  const copy = getEmailCopy(input);
  const planLabel = getPlanLabel(input.plan);
  const code = escapeHtml(input.authorizationCode);
  const orderId = escapeHtml(input.orderId);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.65; color: #111827; max-width: 560px; margin: 0 auto; padding: 24px 16px;">
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px;">Edit Page</p>
      <h1 style="font-size: 24px; margin: 0 0 16px; font-weight: 700;">${copy.greeting}</h1>
      <p style="margin: 0 0 20px;">${copy.intro}</p>
      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; background: #ffffff;">
        <p style="margin: 0 0 8px;"><strong>${copy.planLabel}:</strong> ${planLabel}</p>
        <p style="margin: 0 0 8px;"><strong>${copy.orderLabel}:</strong> ${orderId}</p>
        <p style="margin: 0 0 12px;"><strong>${copy.codeLabel}:</strong></p>
        <div style="display: inline-block; font-size: 24px; letter-spacing: 1px; font-weight: 700; background: #f3f4f6; padding: 12px 16px; border-radius: 10px;">
          ${code}
        </div>
      </div>
      <p style="margin: 20px 0 8px;">${copy.instruction}</p>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">${copy.support}</p>
    </div>
  `.trim();
}

function buildEmailText(input: SendLicenseEmailInput) {
  const copy = getEmailCopy(input);
  return [
    copy.greeting,
    '',
    copy.intro,
    '',
    `${copy.planLabel}: ${getPlanLabel(input.plan)}`,
    `${copy.orderLabel}: ${input.orderId}`,
    `${copy.codeLabel}: ${input.authorizationCode}`,
    '',
    copy.instruction,
    copy.support,
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
      subject: getEmailCopy(input).subject,
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
