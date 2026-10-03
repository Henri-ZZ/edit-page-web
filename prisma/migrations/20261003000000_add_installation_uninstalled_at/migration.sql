-- Post-uninstall signal: set once from the URL the browser opens after the
-- extension has been removed (see docs/EDIT_PAGE_TELEMETRY_SPEC.md §6 and §9.4).
--
-- Nullable on purpose. The signal is best-effort — it is lost when the request
-- cannot be delivered (offline, tab closed early, blocked host) and never fires
-- for a merely disabled extension — so a missing value must never be read as
-- proof that the extension is still installed.
ALTER TABLE "Installation" ADD COLUMN "uninstalledAt" TIMESTAMPTZ(3);
