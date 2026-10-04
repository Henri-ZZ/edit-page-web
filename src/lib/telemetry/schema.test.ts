import { describe, expect, it } from 'vitest';

import { isSameUuid, parseTelemetryBatchV1, type TelemetryBatchRequestV1 } from './schema';

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
      distribution: 'cws',
      licenseType: 'premium',
    },
    settings: {
      languagePreference: 'browser',
      screenshotDestination: 'download',
      hideRepeatedElements: true,
      selectionToolbarEnabled: false,
      replaceImageFit: 'cover',
    },
    optionalPermissions: {
      clipboardWrite: true,
      downloads: false,
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
    expect(parsed.settings).toEqual({
      languagePreference: 'browser',
      screenshotDestination: 'download',
      hideRepeatedElements: true,
      selectionToolbarEnabled: false,
      replaceImageFit: 'cover',
    });
    expect(parsed.optionalPermissions).toEqual({
      clipboardWrite: true,
      downloads: false,
    });
    expect(parsed.usage[0].events['text.edit']).toBe(18);
  });

  it('accepts settings from clients that predate an optional preference', () => {
    const batch = validBatch();
    delete (batch.settings as Record<string, unknown>).replaceImageFit;
    expect(
      parseTelemetryBatchV1(batch, NOW).settings?.replaceImageFit,
    ).toBeUndefined();
  });

  it('accepts old batches without settings during rollout', () => {
    const batch = validBatch();
    delete batch.settings;
    delete batch.optionalPermissions;
    const parsed = parseTelemetryBatchV1(batch, NOW);
    expect(parsed.settings).toBeUndefined();
    expect(parsed.optionalPermissions).toBeUndefined();
  });

  it.each(['cws', 'edge', 'partner-preview'])('accepts distribution channel %s', (distribution) => {
    const batch = validBatch();
    batch.environment.distribution = distribution;
    expect(parseTelemetryBatchV1(batch, NOW).environment.distribution).toBe(distribution);
  });

  it('normalizes surrounding whitespace and rejects invalid distribution values', () => {
    const padded = validBatch();
    padded.environment.distribution = '  cws  ';
    expect(parseTelemetryBatchV1(padded, NOW).environment.distribution).toBe('cws');

    const empty = validBatch();
    empty.environment.distribution = '   ';
    expect(() => parseTelemetryBatchV1(empty, NOW)).toThrow();

    const tooLong = validBatch();
    tooLong.environment.distribution = 'x'.repeat(33);
    expect(() => parseTelemetryBatchV1(tooLong, NOW)).toThrow();
  });

  it('rejects unknown optional permissions and non-boolean states', () => {
    const unknown = validBatch() as TelemetryBatchRequestV1 & {
      optionalPermissions: Record<string, unknown>;
    };
    unknown.optionalPermissions.tabs = true;
    expect(() => parseTelemetryBatchV1(unknown, NOW)).toThrow();

    const invalid = validBatch();
    invalid.optionalPermissions!.downloads = 'yes' as unknown as boolean;
    expect(() => parseTelemetryBatchV1(invalid, NOW)).toThrow();
  });

  it('rejects unknown settings and invalid setting values', () => {
    const unknown = validBatch() as TelemetryBatchRequestV1 & {
      settings: Record<string, unknown>;
    };
    unknown.settings.unreviewedPreference = true;
    expect(() => parseTelemetryBatchV1(unknown, NOW)).toThrow();

    const invalid = validBatch();
    invalid.settings!.screenshotDestination = 'cloud' as 'download';
    expect(() => parseTelemetryBatchV1(invalid, NOW)).toThrow();
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

  it('accepts the image-import counters next to the replace counter', () => {
    const batch = validBatch();
    const events = {
      'image.import_local': 1,
      'image.import_url': 2,
      'image.import_local_failed': 3,
      'image.import_url_failed': 4,
      'image.replace': 5,
    };
    batch.usage[0].events = events;

    expect(parseTelemetryBatchV1(batch, NOW).usage[0].events).toEqual(events);
  });

  it.each([
    'dashboard.open',
    'monetization.learn_premium_clicked',
    'support.review_clicked',
    'support.feedback_clicked',
  ])('accepts the dashboard event %s', (event) => {
    const batch = validBatch();
    batch.usage[0].events = { [event]: 1 };
    expect(parseTelemetryBatchV1(batch, NOW).usage[0].events[event]).toBe(1);
  });

  it('rejects duplicate, stale, and empty usage days', () => {
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

  it('normalizes usage day order instead of rejecting it', () => {
    const batch = validBatch();
    batch.usage = [
      { date: '2026-09-26', events: { 'edit.start': 1 } },
      { date: '2026-09-24', events: { 'text.edit': 2 } },
      { date: '2026-09-25', events: { 'history.undo': 3 } },
    ];

    const parsed = parseTelemetryBatchV1(batch, NOW);

    expect(parsed.usage.map((day) => day.date)).toEqual([
      '2026-09-24',
      '2026-09-25',
      '2026-09-26',
    ]);
    expect(parsed.usage.map((day) => Object.keys(day.events)[0])).toEqual([
      'text.edit',
      'history.undo',
      'edit.start',
    ]);
  });

  it('rejects the same date twice regardless of array order', () => {
    const batch = validBatch();
    batch.usage = [
      { date: '2026-09-26', events: { 'edit.start': 1 } },
      { date: '2026-09-25', events: { 'text.edit': 1 } },
      { date: '2026-09-26', events: { 'history.undo': 1 } },
    ];

    expect(() => parseTelemetryBatchV1(batch, NOW)).toThrow();
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

describe('isSameUuid', () => {
  const lower = '41100ab3-8d63-4053-b485-33e3d0188787';

  it('matches regardless of case so a retried requestId still deduplicates', () => {
    expect(isSameUuid(lower, lower.toUpperCase())).toBe(true);
    expect(isSameUuid(lower.toUpperCase(), lower)).toBe(true);
  });

  it('still separates genuinely different installations', () => {
    expect(isSameUuid(lower, 'c630a0a8-9f48-4bf7-8479-51bddf804cbb')).toBe(false);
  });
});
