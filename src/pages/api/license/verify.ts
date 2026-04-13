import type { APIRoute } from 'astro';

import { hashAuthorizationCode } from '@/lib/license';
import { verifyLicense } from '@/lib/license-store';

export const prerender = false;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type VerifyPayload = {
  deviceId?: string;
  extensionVersion?: string;
  licenseKey?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
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

function getClientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
}

export const OPTIONS: APIRoute = async () =>
  new Response(null, {
    status: 204,
    headers: corsHeaders,
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: VerifyPayload;

  try {
    payload = (await request.json()) as VerifyPayload;
  } catch {
    return json({ error: 'Invalid JSON payload' }, 400);
  }

  const licenseKey = payload.licenseKey?.trim().toUpperCase() ?? '';
  const deviceId = payload.deviceId?.trim() ?? '';

  if (!licenseKey || !deviceId) {
    return json({ error: 'licenseKey and deviceId are required' }, 400);
  }

  try {
    const result = await verifyLicense({
      deviceId,
      extensionVersion: payload.extensionVersion?.trim() ?? null,
      ipAddress: getClientIp(request),
      licenseKeyHash: hashAuthorizationCode(licenseKey, getLicenseSecret()),
      userAgent: request.headers.get('user-agent'),
    });

    if (!result.ok) {
      return json({ ok: false, reason: result.reason }, 200);
    }

    return json({
      ok: true,
      deviceId: result.deviceId,
      email: result.license.email,
      maxDevices: result.license.max_devices,
      orderId: result.license.order_id,
      plan: result.license.plan,
    });
  } catch (error) {
    console.error('[license-verify] Failed to verify license', error);
    return json({ error: 'License verification failed' }, 500);
  }
};
