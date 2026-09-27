# Edit Page Telemetry Technical Specification

**Status:** Implementation-ready specification  
**Audience:** Browser extension, website/API, data, security, privacy, and QA engineers  
**Normative language:** **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are requirements levels.  
**Initial schema version:** `1`

## 1. Goals and non-goals

### 1.1 Goals

The telemetry system MUST answer product-level questions without observing the web pages users edit:

- How many installations are active, new, free, or premium?
- Which extension versions, supported browsers, operating systems, locales, and distribution channels are in use?
- Which Edit Page features are used, and how often?
- Where does the free-to-premium activation funnel succeed or fail?
- Which versions or environments correlate with aggregate product failures?

The system MUST:

- generate a random, resettable installation identifier;
- aggregate counters locally in the extension;
- upload compact batches approximately every 12–24 hours;
- validate and minimize data again at the API boundary;
- store installation metadata and daily aggregate counters in Neon/Postgres;
- make retries idempotent so a batch is counted at most once;
- support future schema evolution without weakening the privacy boundary.

### 1.2 Non-goals

This system is not intended to:

- identify a person or track them across reinstallations, browsers, or devices;
- reconstruct a browsing session or editing session;
- record which site, page, element, text, or image was edited;
- provide session replay, heatmaps, error stack collection, or content analytics;
- enforce licensing or replace Licentra;
- serve as an audit log or billing ledger;
- collect advertising identifiers or create user profiles.

## 2. Privacy principle

> **Measure Edit Page, never measure the page.**

Telemetry may describe the extension, its coarse runtime environment, its license tier, and counters for explicitly approved Edit Page actions. It MUST NOT describe the visited page, its contents, the user's input, or the target of an edit.

This principle applies at every layer: event creation, local storage, request serialization, HTTP logging, server validation, database storage, dashboards, exports, and future extensions.

## 3. System architecture

```text
User action
   -> approved event constant
   -> local integer counter (chrome.storage.local)
   -> immutable upload batch with random requestId
   -> POST /api/telemetry/v1/batch
   -> strict validation and allowlisting
   -> transaction in Neon/Postgres
      -> upsert Installation
      -> idempotency claim
      -> atomic UsageDaily JSONB counter increments
   -> success acknowledgement
   -> remove only the acknowledged local batch
```

There MUST be no per-click network request. Page/content scripts SHOULD send only approved event names to the extension service worker. They MUST NOT attach page-derived metadata.

Recommended component responsibilities:

- **Content/UI code:** recognizes a completed product action and emits a constant event name.
- **Extension telemetry module:** owns identity, environment normalization, local aggregation, batch creation, retry, and acknowledgement.
- **Website telemetry API:** authenticates the protocol (not the user), validates/allowlists, rate-limits, performs idempotent writes, and returns an acknowledgement.
- **Neon/Postgres:** stores minimized installation metadata, daily counters, and short-lived request IDs used for deduplication.

## 4. Installation identity and licensing separation

### 4.1 `installationId`

On first telemetry initialization, the extension MUST generate:

```ts
const installationId = crypto.randomUUID();
```

It MUST be stored in `chrome.storage.local`, for example under `telemetry.installationId`. It MUST NOT be derived from hardware, browser attributes, the Licentra fingerprint, a license key, email address, account ID, URL, or any other stable identifier.

Properties:

- UUID v4-shaped random value (validate using a strict UUID parser);
- scoped to one extension installation/browser profile;
- remains stable through normal extension updates;
- may change after uninstall/reinstall, storage clearing, or profile reset;
- is not synced with `chrome.storage.sync` and is not used cross-device.

If telemetry storage is unavailable, product functionality MUST continue. Telemetry SHOULD retry initialization later and MUST NOT fall back to fingerprinting.

### 4.2 Hard separation from Licentra

Licentra fingerprint and license key belong only to the licensing domain. Analytics MUST store only the normalized state `free` or `premium`.

The telemetry client, request, API logs, analytics tables, dashboards, and exports MUST NOT contain:

- a license key, including hashed/encrypted/truncated variants;
- a Licentra fingerprint, including hashed/encrypted/truncated variants;
- raw Licentra responses or customer identifiers.

The licensing module MAY expose a narrow function such as `getAnalyticsLicenseType(): 'free' | 'premium'`. Telemetry MUST NOT receive any other licensing value.

## 5. Environment fields

Each batch includes the current normalized environment:

| Field | Type | Allowed values / rule | Source |
|---|---|---|---|
| `extensionVersion` | string | Semver-like manifest version, max 32 chars | `chrome.runtime.getManifest().version` |
| `browser` | enum | `chrome`, `edge`, `brave`, `opera`, `vivaldi`, `other_chromium` | reliable runtime detection with explicit fallback |
| `browserMajorVersion` | integer | `1..999`, or omit if not reliably known | User-Agent Client Hints when available; carefully parsed UA fallback |
| `os` | enum | `windows`, `mac`, `linux`, `chromeos`, `android`, `other` | `chrome.runtime.getPlatformInfo()` preferred |
| `locale` | string | normalized BCP 47-like tag, max 35 chars | `chrome.i18n.getUILanguage()` preferred |
| `distribution` | enum | build-owned channel, e.g. `chrome_web_store`, `edge_addons`, `direct`, `development` | build-time constant only |
| `licenseType` | enum | `free`, `premium` | minimized licensing adapter |

Detection MUST fail closed to an approved `other`/omitted value; it MUST NOT send raw user-agent strings or platform strings.

`distribution` MUST be injected by the release build (for example `__EDIT_PAGE_DISTRIBUTION__`) and MUST NOT be inferred from the runtime browser. **Edge runtime does not imply installation from Edge Add-ons.** An Edge user may install from Chrome Web Store. CI SHOULD build and sign each store artifact with its explicit channel and test the embedded value.

## 6. Lifecycle fields

The server owns authoritative timestamps:

- `firstSeenAt`: timestamp of the first accepted batch for an `installationId`; immutable.
- `lastSeenAt`: timestamp of the most recently accepted batch; monotonically updated by the server.
- `firstVersion`: `extensionVersion` in the first accepted batch; immutable.
- `currentVersion`: version in the most recently accepted batch.

Clients MUST NOT send `firstSeenAt` or `lastSeenAt`. Clients send their current extension version and the server derives both version lifecycle fields. A client-provided date is used only to allocate usage to a day after the server checks its bounded clock skew; it never controls lifecycle timestamps.

## 7. Event catalog

### 7.1 Approved events

These are the complete schema-v1 event keys:

```ts
export const TELEMETRY_EVENTS = [
  'edit.start',
  'text.edit',
  'format.bold',
  'format.italic',
  'format.underline',
  'format.strikethrough',
  'format.font_size',
  'format.text_color',
  'format.background_color',
  'image.replace',
  'element.remove',
  'history.undo',
  'history.redo',
  'screenshot.viewport',
  'screenshot.fullpage',
  'screenshot.copy',
  'screenshot.download',
  'monetization.free_limit_reached',
  'monetization.upgrade_shown',
  'monetization.activation_started',
  'monetization.activation_succeeded',
  'monetization.activation_failed',
] as const;

export type TelemetryEventName = (typeof TELEMETRY_EVENTS)[number];

export const ACTIVATION_FAILURE_REASONS = [
  'invalid_key',
  'expired_key',
  'revoked_key',
  'device_limit',
  'network_error',
  'server_error',
  'timeout',
  'unknown',
] as const;

export type ActivationFailureReason =
  (typeof ACTIVATION_FAILURE_REASONS)[number];
```

### 7.2 Counting semantics

| Event | Increment exactly when |
|---|---|
| `edit.start` | Edit mode transitions from inactive to active. Repeated clicks while already active do not count. |
| `text.edit` | A text-edit operation is committed, normally on blur/Enter/end-of-edit, and content actually changed. Do not count each keystroke. |
| `format.*` | The corresponding formatting command is successfully applied once. Do not include values, colors, font sizes, selected text, or target details. |
| `image.replace` | A replacement image is successfully applied to an element. Do not include image bytes, URL, filename, MIME metadata, or target information. |
| `element.remove` | An element removal is successfully applied. Do not include tag, selector, text, or DOM path. |
| `history.undo` / `history.redo` | The history command successfully changes Edit Page state. No-op commands do not count. |
| `screenshot.viewport` | A viewport capture completes successfully and produces the internal image result. |
| `screenshot.fullpage` | A full-page capture completes successfully and produces the internal image result. |
| `screenshot.copy` | The screenshot is successfully written to the clipboard. A failed permission/write attempt does not count. |
| `screenshot.download` | The screenshot download is successfully initiated/confirmed by the browser API. A failed/cancelled preparation does not count. |
| `monetization.free_limit_reached` | A product action is blocked by the configured free-tier limit. Count once per blocked action, not per render/re-render. |
| `monetization.upgrade_shown` | The upgrade UI becomes visible due to a product flow. Count once per presentation, not per component render. |
| `monetization.activation_started` | A user explicitly submits an activation attempt. |
| `monetization.activation_succeeded` | Licentra confirms activation and local premium state is committed. |
| `monetization.activation_failed` | An attempted activation reaches a terminal failure. It MUST carry exactly one approved reason counter; raw error messages/codes are forbidden. |

All counters MUST be non-negative integers. For schema v1, ordinary event counters are stored by event name. Activation failures additionally use a bounded reason key such as `monetization.activation_failed.network_error`; the server derives this key only after enum validation. No general-purpose event properties are allowed.

## 8. Extension-side aggregation and delivery

### 8.1 Local model

Recommended local state:

```ts
interface PendingDailyCounters {
  // UTC calendar date: YYYY-MM-DD
  date: string;
  events: Partial<Record<TelemetryCounterKey, number>>;
}

type ActivationFailureCounterKey =
  `monetization.activation_failed.${ActivationFailureReason}`;

type TelemetryCounterKey =
  | TelemetryEventName
  | ActivationFailureCounterKey;

interface InFlightTelemetryBatch {
  requestId: string;
  createdAt: string;
  body: TelemetryBatchRequest;
}
```

Counter mutation MUST be centralized. Callers pass a typed constant and, only for activation failure, an approved reason. The telemetry module rejects arbitrary strings.

### 8.2 Batch schedule

- Flush approximately every 12–24 hours, with random jitter to prevent synchronized traffic.
- Also attempt a flush on extension startup if the oldest pending data is at least 12 hours old.
- MAY flush when pending counters exceed a conservative threshold (for example 100 distinct day/key entries), but MUST still batch.
- Use UTC dates.
- Do not depend on a background worker remaining alive; use `chrome.alarms` and persisted state.
- Retry transient failures with exponential backoff plus jitter (for example 15 minutes, 1 hour, 4 hours, 12 hours, capped at 24 hours).
- Do not retry permanent `4xx` validation failures unchanged. Quarantine/drop only the rejected invalid batch and record a local diagnostic without page data.

### 8.3 Snapshot, acknowledgement, and clearing

To avoid losing events or double counting:

1. Atomically snapshot pending counters into an immutable in-flight batch with a fresh `requestId` UUID.
2. Reset the active accumulator only after the snapshot is persisted. New events go into the new active accumulator.
3. Send the exact persisted in-flight body on every retry; never create a new `requestId` for the same snapshot.
4. On a valid success response whose `requestId` matches, delete that in-flight batch.
5. On timeout or ambiguous network failure, retain it and retry unchanged.

The API's idempotency guarantee makes an accepted response that was lost safe to retry.

## 9. API contract

### 9.1 Endpoint

```http
POST /api/telemetry/v1/batch
Content-Type: application/json
```

Recommended limits: HTTPS only; body at most 16 KiB compressed/uncompressed as enforced by the platform; request timeout; no cookies or browser credentials required; CORS restricted to the extension's known origins where feasible.

### 9.2 TypeScript contract

```ts
export interface TelemetryEnvironmentV1 {
  extensionVersion: string;
  browser: 'chrome' | 'edge' | 'brave' | 'opera' | 'vivaldi' | 'other_chromium';
  browserMajorVersion?: number;
  os: 'windows' | 'mac' | 'linux' | 'chromeos' | 'android' | 'other';
  locale: string;
  distribution: 'chrome_web_store' | 'edge_addons' | 'direct' | 'development';
  licenseType: 'free' | 'premium';
}

export interface DailyUsageV1 {
  date: string; // UTC YYYY-MM-DD, within allowed server skew
  events: Partial<Record<TelemetryCounterKey, number>>;
}

export interface TelemetryBatchRequestV1 {
  schemaVersion: 1;
  requestId: string; // random UUID; stable across retries of this snapshot
  installationId: string; // random UUID
  sentAt: string; // ISO 8601 client diagnostic time, bounded by server validation
  environment: TelemetryEnvironmentV1;
  usage: DailyUsageV1[]; // e.g. 1..7 days; sorted, unique dates
}

export interface TelemetryBatchResponseV1 {
  accepted: true;
  schemaVersion: 1;
  requestId: string;
  serverTime: string;
}
```

### 9.3 Complete request example

```json
{
  "schemaVersion": 1,
  "requestId": "c630a0a8-9f48-4bf7-8479-51bddf804cbb",
  "installationId": "41100ab3-8d63-4053-b485-33e3d0188787",
  "sentAt": "2026-09-27T08:15:00.000Z",
  "environment": {
    "extensionVersion": "2.1.2",
    "browser": "edge",
    "browserMajorVersion": 151,
    "os": "windows",
    "locale": "en-US",
    "distribution": "chrome_web_store",
    "licenseType": "premium"
  },
  "usage": [
    {
      "date": "2026-09-26",
      "events": {
        "edit.start": 3,
        "text.edit": 18,
        "format.bold": 4,
        "image.replace": 1,
        "history.undo": 2,
        "screenshot.fullpage": 1,
        "screenshot.download": 1,
        "monetization.activation_started": 1,
        "monetization.activation_succeeded": 1
      }
    }
  ]
}
```

Response:

```json
{
  "accepted": true,
  "schemaVersion": 1,
  "requestId": "c630a0a8-9f48-4bf7-8479-51bddf804cbb",
  "serverTime": "2026-09-27T08:15:00.421Z"
}
```

Suggested status codes: `200` accepted or already accepted; `400` malformed JSON/schema; `413` too large; `415` wrong content type; `429` rate limited with `Retry-After`; `500/503` transient server failure. A duplicate `requestId` with the same installation returns `200` without applying counters again. A reused `requestId` associated with another installation is rejected.

## 10. Server-side allowlist and validation

The server is the privacy boundary and MUST NOT trust the extension. Use a strict schema validator (for example Zod with strict objects) and construct a fresh sanitized object from accepted values. Do not persist, forward, or log the raw body.

Validation requirements:

- reject non-JSON, oversized, deeply nested, or malformed bodies before application handling;
- require `schemaVersion === 1`; route future versions explicitly;
- strict UUID validation for `requestId` and `installationId`;
- strict enums for browser, OS, distribution, license type, event name, and activation failure reason;
- reject unknown top-level, environment, daily-usage, and event keys (or discard them before any storage/logging); strict rejection is preferred because it reveals client bugs;
- cap string lengths and normalize locale; never persist raw invalid values;
- counters must be safe integers, `0..1_000_000` per key per batch; omit/ignore zero;
- cap usage days (recommended maximum 7), event keys per day, and total summed counters;
- dates must be valid UTC dates and within an explicit window, e.g. no future date beyond one day and no older than seven days;
- `sentAt` must be valid ISO 8601 and within a generous bounded skew; server time remains authoritative;
- reject duplicate dates in one request;
- never dynamically spread request objects into ORM data.

The implementation MUST specifically prevent accidental storage of fields such as `url`, `domain`, `pageTitle`, `referrer`, `selectedText`, `pageText`, `html`, `selector`, `imageUrl`, and `licenseKey`. Unknown data must die at the API boundary.

## 11. Neon/Postgres and Prisma schema

Minimum Prisma model (PostgreSQL):

```prisma
model Installation {
  id                  String       @id @default(cuid())
  installationId      String       @unique @db.Uuid
  firstSeenAt         DateTime     @default(now()) @db.Timestamptz(3)
  lastSeenAt          DateTime     @default(now()) @db.Timestamptz(3)
  firstVersion        String       @db.VarChar(32)
  currentVersion      String       @db.VarChar(32)
  browser             String       @db.VarChar(32)
  browserMajorVersion Int?
  os                  String       @db.VarChar(16)
  locale              String       @db.VarChar(35)
  distribution        String       @db.VarChar(32)
  licenseType         String       @db.VarChar(16)
  usageDaily          UsageDaily[]
  telemetryRequests   TelemetryRequest[]

  @@index([lastSeenAt])
  @@index([currentVersion])
  @@index([licenseType])
}

model UsageDaily {
  id             String       @id @default(cuid())
  installationId String       @db.Uuid
  date           DateTime     @db.Date
  events         Json         @default("{}") @db.JsonB
  createdAt      DateTime     @default(now()) @db.Timestamptz(3)
  updatedAt      DateTime     @updatedAt @db.Timestamptz(3)
  installation   Installation @relation(fields: [installationId], references: [installationId], onDelete: Cascade)

  @@unique([installationId, date])
  @@index([date])
}

model TelemetryRequest {
  requestId      String       @id @db.Uuid
  installationId String       @db.Uuid
  acceptedAt     DateTime     @default(now()) @db.Timestamptz(3)
  installation   Installation @relation(fields: [installationId], references: [installationId], onDelete: Cascade)

  @@index([acceptedAt])
  @@index([installationId])
}
```

`TelemetryRequest` is operational deduplication state, not analytics. Retain it longer than the maximum client retry/pending lifetime (recommended 30 days), then delete it. A client batch older than that maximum MUST be rejected so deletion cannot permit a late duplicate.

Enums may be represented as Prisma enums, checked text columns, or validated text. Database check constraints are recommended as defense in depth. No columns may be added for prohibited data.

## 12. Transaction, upsert, atomic JSONB increments, and idempotency

Every accepted request MUST execute in one database transaction:

1. Validate and sanitize completely before opening the transaction.
2. Upsert `Installation` by `installationId`.
   - Create: set both versions from `extensionVersion`, both timestamps from database/server time, and current environment.
   - Update: preserve `firstSeenAt` and `firstVersion`; set `lastSeenAt = now()` and update current environment/version.
3. Insert `TelemetryRequest(requestId, installationId)` using a unique primary key.
4. If the request already exists for this installation, do no usage increments and return success.
5. If newly inserted, upsert each `(installationId, date)` and atomically add sanitized counters.
6. Commit, then acknowledge. On any error, roll back all steps.

Do not implement JSONB updates as read-modify-write in application code; concurrent batches can lose increments. Use a parameterized SQL expression per approved key. Conceptual SQL:

```sql
INSERT INTO "UsageDaily" (..., "events")
VALUES (..., $sanitized_jsonb)
ON CONFLICT ("installationId", "date") DO UPDATE
SET "events" = jsonb_set(
      "UsageDaily"."events",
      ARRAY[$approved_key],
      to_jsonb(
        COALESCE(("UsageDaily"."events" ->> $approved_key)::bigint, 0)
        + $validated_increment
      ),
      true
    ),
    "updatedAt" = now();
```

For multiple counters, build nested `jsonb_set` expressions exclusively from server-side allowlisted keys, or use a reviewed SQL function that iterates a sanitized JSONB object. Values MUST be bound parameters. Keys MUST come from the server constant set, never unchecked client strings. Counter totals should use `bigint` semantics and have a sensible database-side ceiling.

Prisma guidance: use `$transaction` plus `$executeRaw` with parameter binding. Never use `$executeRawUnsafe`. If Neon HTTP/serverless transaction behavior is used, verify that the idempotency insert and all counter updates share the same real database transaction.

Pseudocode:

```ts
async function acceptTelemetry(raw: unknown): Promise<TelemetryBatchResponseV1> {
  const batch = parseStrictV1(raw);        // sanitized copy only
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await upsertInstallation(tx, batch, now);

    const claimed = await claimRequestId(tx, {
      requestId: batch.requestId,
      installationId: batch.installationId,
    });

    if (!claimed) {
      await assertRequestBelongsToInstallation(tx, batch);
      return; // duplicate: acknowledge without incrementing
    }

    for (const day of batch.usage) {
      await atomicUpsertApprovedCounters(tx, batch.installationId, day);
    }
  });

  return {
    accepted: true,
    schemaVersion: 1,
    requestId: batch.requestId,
    serverTime: now.toISOString(),
  };
}
```

## 13. Free/premium analytics

`licenseType` describes the tier at upload time and is stored on the installation as current state. Daily counters may be analyzed against the installation's current tier, but this does not provide historically exact tier attribution. If historically exact segmentation is later proven necessary, add only an approved `licenseType` dimension to `UsageDaily`; never copy licensing identifiers.

No analytics code may query Licentra directly by analytics identity. License activation event counters are product funnel measurements, not licensing records.

## 14. Prohibited collection

The extension, API, infrastructure logs, and database MUST NOT collect or derive:

- URL, origin, hostname/domain, path, query, fragment, page title, referrer, or browsing history;
- page text, selected text, edited text, user-entered text, HTML, DOM, CSS selectors, XPath, tag names, element attributes, or surrounding context;
- image URLs, filenames, image bytes, uploaded images, generated screenshots, screenshot pixels, or screenshot metadata tied to content;
- form data, passwords, authentication data, cookies, tokens, local/session storage contents, or clipboard contents;
- search terms, keystrokes, mouse coordinates, or session replay data;
- exact IP address in analytics storage, or country/city/location derived from IP;
- license key, Licentra fingerprint, or any transformed form of either;
- email, name, account identifier, advertising identifier, device fingerprint, hardware serial, or cross-install identifier;
- raw user-agent, raw error messages, exception stacks, or arbitrary event properties.

Screenshots are a local product output; telemetry records only approved success counters. The screenshot itself MUST never enter telemetry.

## 15. HTTP, IP, and server logging

An HTTP provider necessarily sees a source IP while routing a request. This does not authorize analytics collection.

- Application code MUST NOT read, store, hash, enrich, geolocate, or forward the source IP for analytics.
- Disable request-body logging and query/header dumps for the telemetry route.
- Access logs SHOULD omit or promptly anonymize IPs when the platform permits.
- If infrastructure retains security logs, configure the shortest practical documented retention and strictly limit access. Keep them separate from analytics and do not join them by `installationId`.
- Do not place identifiers or telemetry in URLs; use the POST body.
- Scrub error reporting so validation errors include field names/error classes, not raw values or bodies.
- Do not set analytics cookies and do not require website session cookies.

## 16. Retention, security, and abuse protection

Before launch, the owner MUST publish and configure explicit retention periods. Recommended starting policy:

- `UsageDaily`: 13 months, followed by deletion or irreversible coarse aggregation;
- inactive `Installation`: delete after 13 months of no accepted batch;
- `TelemetryRequest`: 30 days, consistent with the maximum accepted event age/retry window;
- infrastructure security logs: shortest practical period, preferably 7–30 days.

Security controls:

- TLS only; secrets and database credentials exist only server-side;
- least-privilege Neon role, separate production/staging databases, encrypted provider storage/backups;
- restricted production and dashboard access, MFA, access review, and audit logs;
- dependency scanning and prompt patching;
- parameterized queries and transactions;
- backup retention aligned with deletion promises where feasible and documented delayed deletion from backups;
- deletion job with monitoring and tests.

Abuse protection MUST NOT create a new tracking system. Use layered limits such as body size, schema/counter ceilings, global capacity limits, per-`installationId` quotas, and coarse short-lived IP-based edge throttling only when necessary for security. Any IP throttle state MUST be ephemeral, inaccessible to analytics, and never geolocated. Treat `installationId` as untrusted and attacker-controlled; telemetry is directional product data, not financial-grade truth.

## 17. Chrome Web Store and Privacy Policy alignment

Before release, compare the shipped implementation, Chrome Web Store Data Usage disclosure, and Privacy Policy line by line.

The CWS disclosure SHOULD identify collection of **User activity** because aggregate interactions with extension features are collected. Depending on the current CWS form wording, device/environment information may require an additional category. The team MUST use the categories and definitions shown in the current submission form at release time rather than relying on this document alone.

The public disclosure should plainly state:

- what is collected: random installation ID, extension/browser/OS/locale/distribution, free/premium state, and aggregate feature-use/activation counters;
- purpose: product analytics, reliability, feature improvement, and understanding the upgrade funnel;
- what is not collected, using the prohibited list above in user-friendly language;
- that page URLs/content, edited content, screenshots, license keys, and fingerprints are not analytics data;
- retention, processors/hosting (including Neon and API hosting as applicable), security, contact, and user choices/rights;
- whether telemetry is mandatory or optional. If an opt-out is offered, it MUST be honored before event recording/upload and documented accurately.

Do not claim “anonymous” if a persistent installation ID is used. Prefer “privacy-preserving aggregate product analytics” and explain the random installation identifier. Complete CWS limited-use/purpose certifications accurately. Any material implementation change MUST trigger a privacy/disclosure review before deployment.

## 18. Implementation phases

### Phase 0 — Privacy and schema review

- Approve event semantics, failure reason enum, retention, legal text, and CWS disclosure.
- Assign data owner and incident contact.
- Freeze schema v1 constants shared by extension and API where practical.

### Phase 1 — API and database foundation

- Create migrations/models and retention job.
- Implement strict parser, fresh sanitized DTO construction, transaction, deduplication, atomic JSONB increments, logging controls, and rate limits.
- Add dashboards only after validating that they cannot expose row-level identifiers unnecessarily.

### Phase 2 — Extension identity and aggregator

- Add random local `installationId` and build-time `distribution` injection.
- Add normalized environment adapters and narrow licensing adapter.
- Implement persisted active/in-flight queues, alarms, retry/backoff, acknowledgement, and size bounds.

### Phase 3 — Event instrumentation

- Instrument one event family at a time using the exact completion semantics in section 7.
- Review each call site for accidental page-derived arguments.
- Add activation reason mapping that converts raw licensing failures locally to the finite enum and immediately discards raw details.

### Phase 4 — Staging and privacy verification

- Exercise Chrome and Edge runtimes with CWS and Edge Add-ons builds.
- Inspect network requests, application logs, database rows, error reports, and backups/configuration.
- Verify no prohibited field appears anywhere.

### Phase 5 — Controlled release

- Update Privacy Policy/CWS disclosures before or with rollout.
- Canary release, monitor acceptance/retry/rate-limit metrics without request bodies, then expand.
- Confirm retention jobs and incident response.

## 19. Testing plan

### 19.1 Extension unit tests

- ID is random, persisted locally, stable across update/restart, and not based on licensing values.
- unavailable storage does not break Edit Page and does not trigger fingerprint fallback.
- every event follows its exact success/commit semantics; failed/no-op actions do not count.
- text editing counts once per committed change, not per keystroke.
- screenshot events count only after the relevant capture/copy/download success.
- activation errors map only to the finite enum; raw error values are discarded.
- concurrent increments are not lost.
- batch snapshot is immutable; new events remain separate.
- success clears only the matching acknowledged batch; timeout/failure retains it.
- retries reuse the same request ID and exact body.
- alarm, jitter, exponential backoff, and storage/restart recovery work.

### 19.2 Build/environment tests

- each store build embeds the expected distribution constant;
- Edge runtime + CWS build reports `browser=edge`, `distribution=chrome_web_store`;
- version, browser major, OS, and locale normalization reject raw/unbounded values;
- no raw UA is sent.

### 19.3 API contract and privacy tests

- valid complete/minimal batches succeed;
- unknown fields at every nesting level are rejected or provably discarded;
- explicitly inject `url`, `pageTitle`, `selectedText`, `html`, `imageUrl`, `licenseKey`, and `fingerprint`; assert they never reach DB/logs/error reporting;
- invalid enums, UUIDs, dates, counts, string lengths, duplicate dates, excessive arrays, content types, and body sizes fail safely;
- fuzz/property tests cannot create arbitrary JSONB keys;
- raw request bodies and IPs are absent from application logs.

### 19.4 Database/concurrency tests

- first upsert preserves `firstSeenAt`/`firstVersion`; later upload updates current fields/`lastSeenAt`;
- two concurrent unique batches atomically sum the same key;
- same `requestId` sent serially and concurrently increments exactly once and returns success;
- same request ID with another installation is rejected;
- forced failure midway rolls back request claim, installation change, and counters;
- `(installationId, date)` uniqueness is enforced;
- retention jobs delete eligible rows and preserve ineligible rows.

### 19.5 End-to-end tests

- simulated offline use accumulates locally and uploads after reconnection;
- lost success response followed by retry does not duplicate counters;
- service-worker termination/restart does not lose pending/in-flight state;
- extension remains fully usable when API is down;
- production-like inspection confirms only allowlisted fields at every hop.

## 20. Acceptance criteria

The feature is ready only when all are true:

- A new installation receives a random UUID in `chrome.storage.local`; no license/fingerprint value participates.
- Environment values are normalized and distribution is build-injected.
- All catalog events use exact documented semantics, including post-success screenshot counting and bounded activation failure reasons.
- No individual click causes a telemetry request; uploads are persisted 12–24-hour batches with jitter and retry.
- Acknowledged batches clear safely; failed/ambiguous batches remain; exact retries are idempotent.
- The API uses a strict v1 allowlist, bounded inputs, no raw-body logging, and fresh sanitized objects.
- Prohibited test fields cannot appear in Neon, application logs, analytics, or error reports.
- Installation lifecycle upserts preserve first values and update current values correctly.
- UsageDaily has a unique `(installationId, date)` row and concurrent JSONB increments cannot lose or duplicate counts.
- License analytics contains only `free`/`premium`, never license key or fingerprint.
- Retention deletion, rate limiting, access controls, and monitoring are operational.
- CWS Data Usage and Privacy Policy accurately match the released code, including User activity disclosure.
- Unit, integration, concurrency, retry, privacy-negative, and end-to-end tests pass.
- A privacy/security reviewer signs off before production rollout.

## 21. Future extension strategy

Schema v1 is deliberately closed. New telemetry requires a written proposal containing:

- the product question it answers;
- the minimal new field/event and exact counting semantics;
- why existing aggregate counters are insufficient;
- privacy, disclosure, retention, abuse, and migration impact;
- cardinality bounds and tests;
- removal/expiry criteria.

Rules for evolution:

- Prefer a new allowlisted counter over event properties.
- Never add a general `properties`, `metadata`, `context`, or arbitrary-error field.
- Never add page/site/content dimensions, even temporarily for debugging.
- Add enum values deliberately on both client and server; deploy server acceptance before emitting from clients.
- Use `schemaVersion: 2` for incompatible contract or semantic changes and keep version-specific parsers.
- Old clients must continue to receive deterministic responses during a documented support window.
- Unknown future fields/events from a client remain rejected/dropped; they are never opportunistically persisted.
- Review whether unused counters can be retired; data minimization includes deletion, not only collection limits.
- Any crash/error telemetry should be a separate reviewed system with its own minimized schema, not an escape hatch in this API.

## Appendix A — Recommended server constants

```ts
export const SCHEMA_VERSION = 1 as const;
export const MAX_BODY_BYTES = 16 * 1024;
export const MAX_USAGE_DAYS = 7;
export const MAX_COUNTER_PER_KEY_PER_BATCH = 1_000_000;
export const MAX_EVENT_AGE_DAYS = 7;
export const MAX_FUTURE_DATE_DAYS = 1;

export const ORDINARY_COUNTER_KEYS = TELEMETRY_EVENTS.filter(
  (event) => event !== 'monetization.activation_failed',
);

export const ACTIVATION_FAILURE_COUNTER_KEYS = ACTIVATION_FAILURE_REASONS.map(
  (reason) => `monetization.activation_failed.${reason}` as const,
);

export const ALLOWED_COUNTER_KEYS = new Set<string>([
  ...ORDINARY_COUNTER_KEYS,
  ...ACTIVATION_FAILURE_COUNTER_KEYS,
]);
```

Although `monetization.activation_failed` is the public event name, its stored counters are reason-qualified. Do not also increment an unqualified failure counter unless the reporting query derives the total by summing the reason-qualified keys; this avoids accidental double counting.

## Appendix B — Implementation review checklist

- [ ] No telemetry function accepts page data or arbitrary properties.
- [ ] No telemetry call site passes DOM objects, URLs, text, images, errors, or license objects.
- [ ] Content-script messages contain only an approved event constant and optional approved failure reason.
- [ ] Build channel is explicit and covered by artifact tests.
- [ ] Raw requests are never logged or spread into persistence objects.
- [ ] All JSONB keys originate from server constants.
- [ ] Idempotency claim and counter increments share one transaction.
- [ ] Retry preserves request ID and request body.
- [ ] Retention and disclosure are deployed, not merely documented.
- [ ] Privacy-negative tests inspect every storage/logging destination.
