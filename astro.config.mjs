import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// Vercel supports Node 20/22/24 (18 was removed), but @astrojs/vercel 7.x ships a
// hardcoded support table that only knows 18 and 20. Building on any other major
// version makes it silently fall back to `nodejs18.x`, which Vercel no longer
// supports. This wrapper runs the adapter's own `astro:build:done` first and then
// rewrites the generated function runtime to the version this project targets.
// See https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
const NODE_RUNTIME = 'nodejs24.x';

async function syncFunctionRuntime(logger) {
  const functionsDir = path.resolve(process.cwd(), '.vercel/output/functions');
  if (!existsSync(functionsDir)) {
    logger.warn(`could not find ${functionsDir} to set the Node.js runtime`);
    return;
  }
  const entries = await readdir(functionsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.endsWith('.func')) continue;
    const configPath = path.join(functionsDir, entry.name, '.vc-config.json');
    if (!existsSync(configPath)) continue;
    const config = JSON.parse(await readFile(configPath, 'utf8'));
    if (!config.runtime?.startsWith('nodejs') || config.runtime === NODE_RUNTIME) continue;
    await writeFile(configPath, `${JSON.stringify({ ...config, runtime: NODE_RUNTIME }, null, '\t')}\n`);
    logger.info(`${entry.name}: function runtime ${config.runtime} -> ${NODE_RUNTIME}`);
  }
}

const vercelNode24 = () => {
  const adapter = vercel();
  const buildDone = adapter.hooks['astro:build:done'];
  return {
    ...adapter,
    hooks: {
      ...adapter.hooks,
      'astro:build:done': async (options) => {
        await buildDone(options);
        await syncFunctionRuntime(options.logger);
      },
    },
  };
};

export default defineConfig({
  // 'hybrid' prerenders every content page at build time (static assets served
  // straight from the CDN) while API routes and pages that opt out with
  // `export const prerender = false` keep running as serverless functions.
  output: 'hybrid',
  adapter: vercelNode24(),
  site: 'https://editpage.henriz.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  // Astro 4's Vite dev server answers OPTIONS before API route handlers.
  // Reflect only extension origins in development so the extension can call
  // localhost without adding a host permission, matching production CORS.
  vite: {
    server: {
      cors: {
        origin: /^(?:(?:chrome|moz|safari-web)-extension|extension):\/\/[a-z0-9._-]+$/i,
        methods: ['POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        maxAge: 86400,
      },
    },
  }
});
