import { createHmac, timingSafeEqual } from 'node:crypto';

import type { LicensePlan } from '@/lib/license';

type PaddleSignatureParts = {
  ts: number;
  signatures: string[];
};

type PaddleCustomer = {
  email?: string | null;
};

type PaddlePrice = {
  id?: string | null;
};

type PaddleTransactionItem = {
  price_id?: string | null;
  price?: PaddlePrice | null;
};

type PaddleTransactionData = {
  id?: string | null;
  customer_id?: string | null;
  customer?: PaddleCustomer | null;
  items?: PaddleTransactionItem[] | null;
};

export type PaddleWebhookEvent = {
  event_id?: string | null;
  notification_id?: string | null;
  type?: string | null;
  data?: PaddleTransactionData | null;
};

function parseSignatureHeader(header: string): PaddleSignatureParts | null {
  const pairs = header.split(';').map((part) => part.trim());
  const timestampValue = pairs.find((part) => part.startsWith('ts='))?.slice(3);
  const signatures = pairs
    .filter((part) => part.startsWith('h1='))
    .map((part) => part.slice(3))
    .filter(Boolean);

  if (!timestampValue || signatures.length === 0) {
    return null;
  }

  const ts = Number(timestampValue);
  if (!Number.isFinite(ts)) {
    return null;
  }

  return { ts, signatures };
}

export function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds = 30,
) {
  if (!signatureHeader || !secret) {
    return false;
  }

  const parsed = parseSignatureHeader(signatureHeader);
  if (!parsed) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowInSeconds - parsed.ts) > toleranceSeconds) {
    return false;
  }

  const expected = createHmac('sha256', secret)
    .update(`${parsed.ts}:${rawBody}`)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');

  return parsed.signatures.some((candidate) => {
    try {
      const candidateBuffer = Buffer.from(candidate, 'hex');
      return (
        candidateBuffer.length === expectedBuffer.length &&
        timingSafeEqual(candidateBuffer, expectedBuffer)
      );
    } catch {
      return false;
    }
  });
}

export function resolvePlanFromPriceId(priceId: string | null | undefined) {
  const lifetimePriceId = import.meta.env.PADDLE_PRICE_LIFETIME || '';

  if (priceId && lifetimePriceId && priceId === lifetimePriceId) {
    return 'lifetime';
  }

  return 'custom' satisfies LicensePlan;
}

export function extractTransactionDetails(event: PaddleWebhookEvent) {
  const transaction = event.data;
  const orderId = transaction?.id?.trim();
  const email = transaction?.customer?.email?.trim().toLowerCase();
  const priceId = transaction?.items?.[0]?.price_id ?? transaction?.items?.[0]?.price?.id ?? null;
  const plan = resolvePlanFromPriceId(priceId);

  return {
    orderId,
    email,
    priceId,
    plan,
  };
}
