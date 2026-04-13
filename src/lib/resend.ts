import { getPlanLabel, type LicenseLocale, type LicensePlan } from '@/lib/license';

type SendLicenseEmailInput = {
  authorizationCode: string;
  currencyCode?: string | null;
  email: string;
  orderId: string;
  plan: LicensePlan;
};

type EmailCopy = {
  codeLabel: string;
  deliveredToLabel: string;
  intro: string;
  instruction: string;
  orderLabel: string;
  planLabel: string;
  preheader: string;
  productLabel: string;
  productName: string;
  receiptLabel: string;
  subject: string;
  supportPrefix: string;
  transactionalNote: string;
};

const SUPPORT_EMAIL = 'henrizhang@henri.ren';

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
      codeLabel: '激活码',
      deliveredToLabel: '收件邮箱',
      intro: '您的 Edit Page Extension 购买已完成，以下是本次交易回执与授权信息。',
      instruction: '请在 Edit Page extension 中输入此激活码完成激活。',
      orderLabel: '订单号',
      planLabel: '套餐',
      preheader: '交易回执与激活码已生成，请妥善保存。',
      productLabel: '产品',
      productName: 'Edit Page Extension',
      receiptLabel: '购买回执',
      subject: 'Edit Page 购买回执与激活码',
      supportPrefix: '如需帮助，您可以直接回复此邮件，或发送邮件至',
      transactionalNote: '此邮件为您最近一次购买的交易通知，不包含营销订阅内容。',
    };
  }

  return {
    codeLabel: 'License key',
    deliveredToLabel: 'Delivered to',
    intro: 'Your purchase of Edit Page Extension is complete. This email includes your receipt and license details.',
    instruction: 'Enter this license key in the Edit Page extension to activate your purchase.',
    orderLabel: 'Order ID',
    planLabel: 'Plan',
    preheader: 'Your purchase receipt and license key are ready.',
    productLabel: 'Product',
    productName: 'Edit Page Extension',
    receiptLabel: 'Purchase receipt',
    subject: 'Edit Page purchase receipt and license key',
    supportPrefix: 'If you need help, you can reply to this email or email',
    transactionalNote: 'This is a transactional message for your recent purchase. It is not a marketing email.',
  };
}

function getEmailLocale(input: SendLicenseEmailInput): LicenseLocale {
  return input.currencyCode === 'CNY' ? 'zh' : 'en';
}

function buildEmailHtml(input: SendLicenseEmailInput) {
  const copy = getEmailCopy(input);
  const planLabel = getPlanLabel(input.plan, getEmailLocale(input));
  const code = escapeHtml(input.authorizationCode);
  const email = escapeHtml(input.email);
  const orderId = escapeHtml(input.orderId);
  const supportEmail = escapeHtml(SUPPORT_EMAIL);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.65; color: #111827; max-width: 560px; margin: 0 auto; padding: 24px 16px;">
      <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">${copy.preheader}</div>
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px;">Edit Page</p>
      <h1 style="font-size: 24px; margin: 0 0 8px; font-weight: 700;">${copy.receiptLabel}</h1>
      <p style="margin: 0 0 20px;">${copy.intro}</p>
      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; background: #ffffff; margin-bottom: 16px;">
        <p style="margin: 0 0 8px;"><strong>${copy.productLabel}:</strong> ${copy.productName}</p>
        <p style="margin: 0 0 8px;"><strong>${copy.planLabel}:</strong> ${planLabel}</p>
        <p style="margin: 0 0 8px;"><strong>${copy.orderLabel}:</strong> ${orderId}</p>
        <p style="margin: 0;"><strong>${copy.deliveredToLabel}:</strong> ${email}</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; background: #ffffff;">
        <p style="margin: 0 0 12px;"><strong>${copy.codeLabel}:</strong></p>
        <div style="display: inline-block; font-size: 24px; letter-spacing: 1px; font-weight: 700; background: #f3f4f6; padding: 12px 16px; border-radius: 10px;">
          ${code}
        </div>
      </div>
      <p style="margin: 20px 0 8px;">${copy.instruction}</p>
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">${copy.supportPrefix} <a href="mailto:${supportEmail}" style="color: #2563eb; text-decoration: underline;">${supportEmail}</a>.</p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">${copy.transactionalNote}</p>
    </div>
  `.trim();
}

function buildEmailText(input: SendLicenseEmailInput) {
  const copy = getEmailCopy(input);
  return [
    copy.receiptLabel,
    '',
    copy.intro,
    '',
    `${copy.productLabel}: ${copy.productName}`,
    `${copy.deliveredToLabel}: ${input.email}`,
    `${copy.planLabel}: ${getPlanLabel(input.plan, getEmailLocale(input))}`,
    `${copy.orderLabel}: ${input.orderId}`,
    `${copy.codeLabel}: ${input.authorizationCode}`,
    '',
    copy.instruction,
    `${copy.supportPrefix} ${SUPPORT_EMAIL}.`,
    copy.transactionalNote,
  ].join('\n');
}

export async function sendLicenseEmail(input: SendLicenseEmailInput) {
  const apiKey = getRequiredEnv('RESEND_API_KEY');
  const from = getRequiredEnv('RESEND_FROM_EMAIL');
  const replyTo = import.meta.env.RESEND_REPLY_TO || undefined;

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

  if (response.status === 409) {
    const errorText = await response.text();
    console.warn('[resend] Duplicate email request treated as success', {
      orderId: input.orderId,
      to: input.email,
      errorText,
    });
    return `duplicate:${input.orderId}`;
  }

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
  return result.id as string | undefined;
}
