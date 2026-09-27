import { describe, expect, it } from 'vitest';

import { isTelemetryOriginAllowed, telemetryCorsHeaders } from './cors';

describe('telemetry CORS', () => {
  it.each([
    'chrome-extension://abcdefghijklmnopabcdefghijklmnop',
    'moz-extension://3f765a9e-5442-4a9d-b7c9-657d0a833c9f',
    'safari-web-extension://com.henriz.editpage',
    'extension://edit-page',
  ])('allows and reflects extension origin %s', (origin) => {
    const request = new Request('https://editpage.henriz.dev/api/telemetry/v1/batch', {
      headers: { Origin: origin },
    });
    expect(isTelemetryOriginAllowed(request)).toBe(true);
    expect(telemetryCorsHeaders(request).get('Access-Control-Allow-Origin')).toBe(origin);
  });

  it('blocks regular web origins and does not reflect them', () => {
    const request = new Request('https://editpage.henriz.dev/api/telemetry/v1/batch', {
      headers: { Origin: 'https://example.com' },
    });
    expect(isTelemetryOriginAllowed(request)).toBe(false);
    expect(telemetryCorsHeaders(request).has('Access-Control-Allow-Origin')).toBe(false);
  });

  it('permits origin-less server diagnostics without adding CORS access', () => {
    const request = new Request('https://editpage.henriz.dev/api/telemetry/v1/batch');
    expect(isTelemetryOriginAllowed(request)).toBe(true);
    expect(telemetryCorsHeaders(request).has('Access-Control-Allow-Origin')).toBe(false);
  });
});
