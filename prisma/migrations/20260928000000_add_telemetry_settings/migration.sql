ALTER TABLE "Installation"
ADD COLUMN "settings" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "Installation"
ADD CONSTRAINT "Installation_settings_object_check"
CHECK (jsonb_typeof("settings") = 'object');
