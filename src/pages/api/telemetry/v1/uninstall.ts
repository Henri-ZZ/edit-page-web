import type { APIRoute } from 'astro';

import { recordUninstall } from '@/lib/server/telemetry-store';
import { UUID_V4 } from '@/lib/telemetry/schema';

export const prerender = false;

/**
 * Post-uninstall signal.
 *
 * `chrome.runtime.setUninstallURL()` makes the **browser** open this URL after
 * the extension has already been removed, so a plain GET is the only uninstall
 * signal that can exist: at that moment there is no extension code left to send
 * a batch. The query string is therefore the single documented exception to the
 * "no identifiers in URLs" rule (docs/EDIT_PAGE_TELEMETRY_SPEC.md §15), and it
 * carries exactly one parameter — the random UUID `installationId`.
 *
 * There is deliberately no origin/CORS check: a top-level navigation never
 * sends an `Origin` header. The id is unguessable, the write is an idempotent
 * first-write-wins update that creates no rows, and an absent, malformed, or
 * unknown id is a silent no-op. Every response redirects to the human-facing
 * page, so this endpoint can never surface an error to the user.
 *
 * This signal is best-effort and under-counts: it is lost when the request
 * fails (offline, tab closed early, blocked host) and never fires for a merely
 * disabled extension. `uninstalledAt` MUST NOT be read as proof that an
 * installation still exists when it is null.
 */
export const GET: APIRoute = async ({ url }) => {
  const installationId = url.searchParams.get('i');

  if (installationId !== null && UUID_V4.test(installationId)) {
    try {
      await recordUninstall(installationId);
    } catch {
      // Never log the identifier, the request, or the database error.
      console.error('telemetry uninstall storage failed', { category: 'database_error' });
    }
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/goodbye', 'Cache-Control': 'no-store' },
  });
};
