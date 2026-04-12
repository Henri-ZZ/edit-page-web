import type { APIRoute } from 'astro';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const GET: APIRoute = async () =>
  json({
    env: import.meta.env.PADDLE_ENVIRONMENT ?? null,
    hasPaddleApiKey: Boolean(import.meta.env.PADDLE_API_KEY),
    paddleApiKeyPrefix: import.meta.env.PADDLE_API_KEY?.slice(0, 18) ?? null,
    paddleApiKeyLength: import.meta.env.PADDLE_API_KEY?.length ?? 0,
    hasPaddleClientToken: Boolean(import.meta.env.PADDLE_CLIENT_TOKEN),
    hasPaddleWebhookSecret: Boolean(import.meta.env.PADDLE_WEBHOOK_SECRET),
    paddlePriceLifetime: import.meta.env.PADDLE_PRICE_LIFETIME ?? null,
    hasLicenseKeySecret: Boolean(import.meta.env.LICENSE_KEY_SECRET),
    hasResendApiKey: Boolean(import.meta.env.RESEND_API_KEY),
    resendFromEmail: import.meta.env.RESEND_FROM_EMAIL ?? null,
    resendReplyTo: import.meta.env.RESEND_REPLY_TO ?? null,
  });
