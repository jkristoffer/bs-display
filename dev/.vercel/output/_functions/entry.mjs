import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DFuuHSwl.mjs';
import { manifest } from './manifest_N__MjanW.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/contact.astro.mjs');
const _page2 = () => import('./pages/contact.astro.mjs');
const _page3 = () => import('./pages/lecterns.astro.mjs');
const _page4 = () => import('./pages/products/_brand_/_id_.astro.mjs');
const _page5 = () => import('./pages/products/_brand_.astro.mjs');
const _page6 = () => import('./pages/products.astro.mjs');
const _page7 = () => import('./pages/robots.txt.astro.mjs');
const _page8 = () => import('./pages/smart-whiteboard-buying-guide.astro.mjs');
const _page9 = () => import('./pages/smartboards.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/contact.ts", _page1],
    ["src/pages/contact.astro", _page2],
    ["src/pages/lecterns.astro", _page3],
    ["src/pages/products/[brand]/[id].astro", _page4],
    ["src/pages/products/[brand]/index.astro", _page5],
    ["src/pages/products/index.astro", _page6],
    ["src/pages/robots.txt.ts", _page7],
    ["src/pages/smart-whiteboard-buying-guide.astro", _page8],
    ["src/pages/smartboards.astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "54d5be23-73ac-44c6-8f8d-582b1327d983",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
