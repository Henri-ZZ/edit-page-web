-- Telemetry schema v1. Existing legacy data is intentionally not migrated.
DROP TABLE IF EXISTS "TelemetryRequest", "UsageDaily", "Installation" CASCADE;

CREATE TABLE "Installation" (
    "id" TEXT NOT NULL,
    "installationId" UUID NOT NULL,
    "firstSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstVersion" VARCHAR(32) NOT NULL,
    "currentVersion" VARCHAR(32) NOT NULL,
    "browser" VARCHAR(32) NOT NULL,
    "browserMajorVersion" INTEGER,
    "os" VARCHAR(16) NOT NULL,
    "locale" VARCHAR(35) NOT NULL,
    "distribution" VARCHAR(32) NOT NULL,
    "licenseType" VARCHAR(16) NOT NULL,

    CONSTRAINT "Installation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Installation_browser_check" CHECK ("browser" IN ('chrome', 'edge', 'brave', 'opera', 'vivaldi', 'other_chromium')),
    CONSTRAINT "Installation_browser_major_check" CHECK ("browserMajorVersion" IS NULL OR "browserMajorVersion" BETWEEN 1 AND 999),
    CONSTRAINT "Installation_os_check" CHECK ("os" IN ('windows', 'mac', 'linux', 'chromeos', 'android', 'other')),
    CONSTRAINT "Installation_distribution_check" CHECK ("distribution" IN ('chrome_web_store', 'edge_addons', 'direct', 'development')),
    CONSTRAINT "Installation_license_type_check" CHECK ("licenseType" IN ('free', 'premium'))
);

CREATE TABLE "UsageDaily" (
    "id" TEXT NOT NULL,
    "installationId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "events" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UsageDaily_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UsageDaily_events_object_check" CHECK (jsonb_typeof("events") = 'object')
);

CREATE TABLE "TelemetryRequest" (
    "requestId" UUID NOT NULL,
    "installationId" UUID NOT NULL,
    "acceptedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetryRequest_pkey" PRIMARY KEY ("requestId")
);

CREATE UNIQUE INDEX "Installation_installationId_key" ON "Installation"("installationId");
CREATE INDEX "Installation_lastSeenAt_idx" ON "Installation"("lastSeenAt");
CREATE INDEX "Installation_currentVersion_idx" ON "Installation"("currentVersion");
CREATE INDEX "Installation_licenseType_idx" ON "Installation"("licenseType");
CREATE UNIQUE INDEX "UsageDaily_installationId_date_key" ON "UsageDaily"("installationId", "date");
CREATE INDEX "UsageDaily_date_idx" ON "UsageDaily"("date");
CREATE INDEX "TelemetryRequest_acceptedAt_idx" ON "TelemetryRequest"("acceptedAt");
CREATE INDEX "TelemetryRequest_installationId_idx" ON "TelemetryRequest"("installationId");

ALTER TABLE "UsageDaily"
  ADD CONSTRAINT "UsageDaily_installationId_fkey"
  FOREIGN KEY ("installationId") REFERENCES "Installation"("installationId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TelemetryRequest"
  ADD CONSTRAINT "TelemetryRequest_installationId_fkey"
  FOREIGN KEY ("installationId") REFERENCES "Installation"("installationId")
  ON DELETE CASCADE ON UPDATE CASCADE;
