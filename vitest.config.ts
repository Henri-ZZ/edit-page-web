import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Vitest does not read `tsconfig.json` path mappings on its own, so the `@/*`
 * alias used everywhere in `src/` is mirrored here. Keep it in sync with
 * `compilerOptions.paths` in tsconfig.json.
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
