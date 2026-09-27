import { describe, expect, it } from 'vitest';

import { parseTelemetryBatchV1, type TelemetryBatchRequestV1 } from './schema';

const NOW = new Date('2026-09-27T08:15:00.000Z');

function validBatch(): TelemetryBatchRequestV1 {
  return {
    schemaVersion: 1,
    requestId: 'c630a0a8-9f48-4bf7-8479-51bddf804cbb',
    installationId: '41100ab3-8d63-4053-b485-33e3d0188787',
    sentAt: '2026-09-27T08:15:00.000Z',
    environment: {
      extensionVersion: '2.1.2',
      browser: 'edge',
      browserMajorVersion: 151,
      os: 'windows',
      locale: 'en-us',
      distribution: 'chrome_web_store',
      licenseType: 'premium',
    },
    usage: [{
      date: '2026-09-26',
      events: {
        'edit.start': 3,
        'text.edit': 18,
        'monetization.activation_failed.network_error': 1,
      },
    }],
  };
}

describe('parseTelemetryBatchV1', () => {
  it('returns a fresh normalized allowlisted object', () => {
    const parsed = parseTelemetryBatchV1(validBatch(), NOW);
    expect(parsed.environment.locale).toBe('en-US');
    expect(parsed.usage[0].events['text.edit']).toBe(18);
  });

  it.each(['url', 'pageTitle', 'selectedText', 'html', 'imageUrl', 'licenseKey', 'fingerprint'])(
    'rejects prohibited or unknown field %s',
    (field) => {
      const batch = validBatch() as unknown as Record<string, unknown>;
      batch[field] = 'must-not-survive';
      expect(() => parseTelemetryBatchV1(batch, NOW)).toThrow();
    },
  );

  it('rejects unknown event keys and the unqualified activation failure event', () => {
    const unknown = validBatch();
    unknown.usage[0].events = { 'page.clicked': 1 };
    expect(() => parseTelemetryBatchV1(unknown, NOW)).toThrow();

    const unqualified = validBatch();
    unqualified.usage[0].events = { 'monetization.activation_failed': 1 };
    expect(() => parseTelemetryBatchV1(unqualified, NOW)).toThrow();
  });

  it('rejects duplicate, unsorted, stale, and empty usage days', () => {
    const duplicate = validBatch();
    duplicate.usage.push({ ...duplicate.usage[0] });
    expect(() => parseTelemetryBatchV1(duplicate, NOW)).toThrow();

    const stale = validBatch();
    stale.usage[0].date = '2026-09-01';
    expect(() => parseTelemetryBatchV1(stale, NOW)).toThrow();

    const empty = validBatch();
    empty.usage[0].events = { 'edit.start': 0 };
    expect(() => parseTelemetryBatchV1(empty, NOW)).toThrow();
  });

  it('strictly requires random UUID v4 identifiers', () => {
    const batch = validBatch();
    batch.installationId = '41100ab3-8d63-1053-b485-33e3d0188787';
    expect(() => parseTelemetryBatchV1(batch, NOW)).toThrow();
  });

  it('requires an ISO 8601 sentAt timestamp with an explicit offset', () => {
    const batch = validBatch();
    batch.sentAt = 'Sun, 27 Sep 2026 08:15:00 GMT';
    expect(() => parseTelemetryBatchV1(batch, NOW)).toThrow();
  });
});
