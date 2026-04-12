import type { APIRoute } from 'astro';

import { getTrialFingerprintStatus, upsertTrialFingerprintSeen } from '@/lib/trial-store';

export const prerender = false;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type TrialPayload = {
  fingerprintHash?: string;
  language?: string;
  platform?: string;
  screen?: string;
  timeZone?: string;
  userAgent?: string;
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

function getClientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
}

export const OPTIONS: APIRoute = async () =>
  new Response(null, {
    status: 204,
    headers: corsHeaders,
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: TrialPayload;

  try {
    payload = (await request.json()) as TrialPayload;
  } catch {
    return json({ error: 'Invalid JSON payload' }, 400);
  }

  const fingerprintHash = payload.fingerprintHash?.trim() ?? '';
  if (!fingerprintHash) {
    return json({ error: 'fingerprintHash is required' }, 400);
  }

  try {
    await upsertTrialFingerprintSeen({
      fingerprintHash,
      ipAddress: getClientIp(request),
      language: payload.language?.trim() ?? null,
      platform: payload.platform?.trim() ?? null,
      screen: payload.screen?.trim() ?? null,
      timeZone: payload.timeZone?.trim() ?? null,
      userAgent: payload.userAgent?.trim() ?? null,
    });

    const result = await getTrialFingerprintStatus(fingerprintHash);
    return json({ ok: true, exhausted: result.exhausted, found: result.found });
  } catch (error) {
    console.error('[trial-status] Failed to read trial fingerprint status', error);
    return json({ error: 'Trial status lookup failed' }, 500);
  }
};
