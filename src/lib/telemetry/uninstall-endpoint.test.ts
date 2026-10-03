import { beforeEach, describe, expect, it, vi } from 'vitest';

const { recordUninstall } = vi.hoisted(() => ({
  recordUninstall: vi.fn(async () => true),
}));

vi.mock('@/lib/server/telemetry-store', () => ({ recordUninstall }));

// Imported from src/pages rather than colocated with it, on purpose: Astro turns
// every file under src/pages into a route, and under `output: 'hybrid'` a route
// without `export const prerender = false` is *executed during the build*. A
// *.test.ts file there imports vitest at build time and fails the deploy with
// "Vitest failed to access its internal state". Keep tests out of src/pages.
import { GET } from '@/pages/api/telemetry/v1/uninstall';

const INSTALLATION_ID = '41100ab3-8d63-4053-b485-33e3d0188787';

function call(query: string): Promise<Response> {
  // APIRoute may return either form; Promise.resolve narrows it for the tests.
  return Promise.resolve(
    GET({
      url: new URL(`https://editpage.henriz.dev/api/telemetry/v1/uninstall${query}`),
    } as never),
  );
}

beforeEach(() => {
  recordUninstall.mockClear();
});

describe('post-uninstall signal', () => {
  it('records a valid installation id and redirects to the goodbye page', async () => {
    const response = await call(`?i=${INSTALLATION_ID}`);

    expect(recordUninstall).toHaveBeenCalledWith(INSTALLATION_ID);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/goodbye');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('never writes for a missing, empty, malformed, or non-v4 id', async () => {
    // The last one is a v1-shaped UUID: the version and variant nibbles matter.
    for (const query of ['', '?i=', '?i=not-a-uuid', '?i=41100ab3-8d63-1053-b485-33e3d0188787']) {
      const response = await call(query);
      expect(response.status).toBe(302);
    }
    expect(recordUninstall).not.toHaveBeenCalled();
  });

  it('still redirects when the write fails, so the user never sees an error', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    recordUninstall.mockRejectedValueOnce(new Error('database unavailable'));

    const response = await call(`?i=${INSTALLATION_ID}`);

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/goodbye');
    logged.mockRestore();
  });
});
