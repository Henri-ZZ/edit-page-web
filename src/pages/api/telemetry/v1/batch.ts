import type { APIRoute } from 'astro';
import { z } from 'zod';

import { acceptTelemetryBatch, RequestIdConflictError, TelemetryRateLimitError } from '@/lib/server/telemetry-store';
import { MAX_BODY_BYTES } from '@/lib/telemetry/constants';
import { isTelemetryOriginAllowed, telemetryCorsHeaders } from '@/lib/telemetry/cors';
import { parseTelemetryBatchV1, validationFieldPaths } from '@/lib/telemetry/schema';

export const prerender = false;

function json(request: Request, body: unknown, status: number, extraHeaders?: HeadersInit): Response {
  const headers = telemetryCorsHeaders(request);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  }
  return new Response(JSON.stringify(body), { status, headers });
}

async function readBodyWithLimit(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export const OPTIONS: APIRoute = async ({ request }) => {
  if (!isTelemetryOriginAllowed(request) || !request.headers.has('origin')) {
    return new Response(null, { status: 403, headers: telemetryCorsHeaders(request) });
  }
  return new Response(null, { status: 204, headers: telemetryCorsHeaders(request) });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isTelemetryOriginAllowed(request)) {
    return json(request, { error: 'origin_not_allowed' }, 403);
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return json(request, { error: 'unsupported_media_type' }, 415);
  }
  if (request.headers.get('content-encoding')) {
    return json(request, { error: 'unsupported_content_encoding' }, 415);
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json(request, { error: 'payload_too_large' }, 413);
  }

  const bytes = await readBodyWithLimit(request);
  if (!bytes) {
    return json(request, { error: 'payload_too_large' }, 413);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    return json(request, { error: 'malformed_json' }, 400);
  }

  let batch;
  try {
    batch = parseTelemetryBatchV1(raw);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json(request, {
        error: 'invalid_request',
        fields: validationFieldPaths(error),
      }, 400);
    }
    return json(request, { error: 'invalid_request' }, 400);
  }

  try {
    const response = await acceptTelemetryBatch(batch);
    return json(request, response, 200);
  } catch (error) {
    if (error instanceof RequestIdConflictError) {
      return json(request, { error: 'request_id_conflict' }, 409);
    }
    if (error instanceof TelemetryRateLimitError) {
      return json(request, { error: 'rate_limited' }, 429, { 'Retry-After': '3600' });
    }
    // Never log the request, identifiers, database message, or stack here.
    console.error('telemetry batch storage failed', { category: 'database_error' });
    return json(request, { error: 'service_unavailable' }, 503, { 'Retry-After': '900' });
  }
};
