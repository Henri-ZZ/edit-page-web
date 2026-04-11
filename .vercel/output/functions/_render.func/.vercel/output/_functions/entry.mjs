import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BJvr_Xkp.mjs';
import { manifest } from './manifest_W1nb31_r.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/paddle-webhook.astro.mjs');
const _page2 = () => import('./pages/privacy.astro.mjs');
const _page3 = () => import('./pages/refund.astro.mjs');
const _page4 = () => import('./pages/terms.astro.mjs');
const _page5 = () => import('./pages/zh/privacy.astro.mjs');
const _page6 = () => import('./pages/zh/refund.astro.mjs');
const _page7 = () => import('./pages/zh/terms.astro.mjs');
const _page8 = () => import('./pages/zh.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/paddle-webhook.ts", _page1],
    ["src/pages/privacy.astro", _page2],
    ["src/pages/refund.astro", _page3],
    ["src/pages/terms.astro", _page4],
    ["src/pages/zh/privacy.astro", _page5],
    ["src/pages/zh/refund.astro", _page6],
    ["src/pages/zh/terms.astro", _page7],
    ["src/pages/zh/index.astro", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "f495d437-a804-4c30-ad9d-af0429c28e34",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
