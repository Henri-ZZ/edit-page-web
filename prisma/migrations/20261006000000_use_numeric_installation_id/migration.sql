-- Installation.id is an internal database-only key. Relations continue to use
-- installationId (UUID), so replacing the CUID values does not affect the API
-- contract or any foreign keys. Alter the existing column in place to preserve
-- its position in database viewers.
CREATE SEQUENCE "Installation_id_seq" AS INTEGER;

ALTER TABLE "Installation"
  DROP CONSTRAINT "Installation_pkey",
  ALTER COLUMN "id" DROP DEFAULT,
  ALTER COLUMN "id" TYPE INTEGER
    USING (nextval('"Installation_id_seq"'::regclass)::integer),
  ALTER COLUMN "id" SET DEFAULT nextval('"Installation_id_seq"'::regclass);

ALTER SEQUENCE "Installation_id_seq"
  OWNED BY "Installation"."id";

ALTER TABLE "Installation"
  ADD CONSTRAINT "Installation_pkey" PRIMARY KEY ("id");
