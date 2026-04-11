/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly LICENSE_KEY_SECRET?: string;
  readonly PADDLE_PRICE_LIFETIME?: string;
  readonly PADDLE_WEBHOOK_SECRET?: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM_EMAIL?: string;
  readonly RESEND_REPLY_TO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
