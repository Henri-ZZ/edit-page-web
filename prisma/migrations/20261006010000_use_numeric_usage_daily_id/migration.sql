-- UsageDaily.id is an internal row key and is not referenced by other tables.
-- The installation relation continues to use installationId (UUID). Alter the
-- column in place so it remains in the same position in database viewers.
CREATE SEQUENCE "UsageDaily_id_seq" AS INTEGER;

ALTER TABLE "UsageDaily"
  DROP CONSTRAINT "UsageDaily_pkey",
  ALTER COLUMN "id" DROP DEFAULT,
  ALTER COLUMN "id" TYPE INTEGER
    USING (nextval('"UsageDaily_id_seq"'::regclass)::integer),
  ALTER COLUMN "id" SET DEFAULT nextval('"UsageDaily_id_seq"'::regclass);

ALTER SEQUENCE "UsageDaily_id_seq"
  OWNED BY "UsageDaily"."id";

ALTER TABLE "UsageDaily"
  ADD CONSTRAINT "UsageDaily_pkey" PRIMARY KEY ("id");
