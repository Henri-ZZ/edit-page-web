import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://edit-page.yourdomain.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
