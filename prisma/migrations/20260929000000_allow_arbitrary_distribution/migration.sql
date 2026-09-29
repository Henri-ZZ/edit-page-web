-- Distribution values are owned by each release build (for example `cws` or
-- `edge`) rather than by the telemetry service. Length remains bounded by the
-- existing VARCHAR(32) column and API validation.
ALTER TABLE "Installation"
DROP CONSTRAINT IF EXISTS "Installation_distribution_check";
