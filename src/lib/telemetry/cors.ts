const EXTENSION_ORIGIN_PATTERN =
  /^(?:(?:chrome|moz|safari-web)-extension|extension):\/\/[a-z0-9._-]+$/i;

export function resolveExtensionOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');
  return origin && EXTENSION_ORIGIN_PATTERN.test(origin) ? origin : null;
}

export function isTelemetryOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  return origin === null || resolveExtensionOrigin(request) !== null;
}

export function telemetryCorsHeaders(request: Request): Headers {
  const headers = new Headers({
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
  });
  const origin = resolveExtensionOrigin(request);
  if (origin) headers.set('Access-Control-Allow-Origin', origin);
  return headers;
}
