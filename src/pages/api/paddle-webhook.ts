import type { APIRoute } from 'astro';

import { generateAuthorizationCode } from '@/lib/license';
import { extractTransactionDetails, verifyPaddleSignature, type PaddleWebhookEvent } from '@/lib/paddle';
import { sendLicenseEmail } from '@/lib/resend';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getLicenseSecret() {
  const secret = import.meta.env.LICENSE_KEY_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: LICENSE_KEY_SECRET');
  }
  return secret;
}

function getWebhookSecret() {
  const secret = import.meta.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: PADDLE_WEBHOOK_SECRET');
  }
  return secret;
}

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
  const signature = request.headers.get('paddle-signature');

  let webhookSecret: string;

  try {
    webhookSecret = getWebhookSecret();
  } catch (error) {
    console.error('[paddle-webhook] Missing webhook configuration', error);
    return json({ error: 'Webhook configuration is incomplete' }, 500);
  }

  if (!verifyPaddleSignature(rawBody, signature, webhookSecret)) {
    return json({ error: 'Invalid Paddle signature' }, 401);
  }

  let event: PaddleWebhookEvent;

  try {
    event = JSON.parse(rawBody) as PaddleWebhookEvent;
  } catch {
    return json({ error: 'Invalid JSON payload' }, 400);
  }

  console.log(
    `[paddle-webhook] Received event type=${event.type ?? 'null'} id=${event.event_id ?? event.notification_id ?? 'null'}`,
  );

  if (event.type !== 'transaction.completed') {
    console.log(`[paddle-webhook] Ignoring unsupported event type=${event.type ?? 'null'}`);
    return json({
      ok: true,
      ignored: true,
      eventType: event.type ?? null,
    });
  }

  try {
    const { email, orderId, plan, priceId } = extractTransactionDetails(event);

    console.log(
      `[paddle-webhook] Extracted transaction details orderId=${orderId ?? 'null'} email=${email ?? 'null'} plan=${plan} priceId=${priceId ?? 'null'}`,
    );

    if (!email || !orderId) {
      console.error(
        `[paddle-webhook] Missing required transaction fields orderId=${orderId ?? 'null'} email=${email ?? 'null'}`,
      );
      return json(
        {
          error: 'Missing transaction email or order id',
        },
        422,
      );
    }

    const authorizationCode = generateAuthorizationCode(
      {
        email,
        orderId,
        plan,
      },
      getLicenseSecret(),
    );

    console.log(
      `[paddle-webhook] Generated authorization code orderId=${orderId} email=${email} plan=${plan}`,
    );

    const emailId = await sendLicenseEmail({
      authorizationCode,
      email,
      orderId,
      plan,
    });

    console.log(
      `[paddle-webhook] License email sent orderId=${orderId} email=${email} emailId=${emailId ?? 'null'}`,
    );

    return json({
      ok: true,
      orderId,
      email,
      plan,
      priceId,
      emailId: emailId ?? null,
    });
  } catch (error) {
    console.error('[paddle-webhook] Failed to process webhook', error);
    return json({ error: 'Webhook processing failed' }, 500);
  }
};

export const GET: APIRoute = async () =>
  json({
    ok: true,
    endpoint: '/api/paddle-webhook',
  });
