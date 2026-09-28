ALTER TABLE "Installation"
ADD COLUMN "optionalPermissions" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "Installation"
ADD CONSTRAINT "Installation_optional_permissions_object_check"
CHECK (jsonb_typeof("optionalPermissions") = 'object');
