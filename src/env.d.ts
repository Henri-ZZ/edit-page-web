/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PADDLE_CLIENT_TOKEN?: string;
  readonly PADDLE_ENVIRONMENT?: 'sandbox' | 'production';
  readonly PADDLE_PRICE_LIFETIME?: string;
  readonly DATABASE_URL?: string;
  readonly CRON_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
