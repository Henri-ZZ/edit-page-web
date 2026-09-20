import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // 'hybrid' prerenders every content page at build time (static assets served
  // straight from the CDN) while API routes and pages that opt out with
  // `export const prerender = false` keep running as serverless functions.
  output: 'hybrid',
  adapter: vercel(),
  site: 'https://editpage.henriz.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
