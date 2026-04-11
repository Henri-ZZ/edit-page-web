import { d as createComponent, r as renderComponent, e as renderTemplate } from '../chunks/astro/server_C3K6ID1F.mjs';
import 'kleur/colors';
import { $ as $$PageLayout } from '../chunks/PageLayout_C-hzCgto.mjs';
import { t as translations } from '../chunks/BaseLayout_BPBCk3WP.mjs';
export { renderers } from '../renderers.mjs';

const $$Refund = createComponent(($$result, $$props, $$slots) => {
  const lang = "en";
  const t = translations[lang];
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "lang": lang, "title": `${t.refund.title} | Edit Page`, "content": t.refund })}`;
}, "/Users/conghua/code/edit-page-web/src/pages/refund.astro", void 0);

const $$file = "/Users/conghua/code/edit-page-web/src/pages/refund.astro";
const $$url = "/refund";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Refund,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
