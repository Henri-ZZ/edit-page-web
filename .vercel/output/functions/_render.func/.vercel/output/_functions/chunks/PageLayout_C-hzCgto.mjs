import { c as createAstro, d as createComponent, r as renderComponent, e as renderTemplate, m as maybeRenderHead } from './astro/server_C3K6ID1F.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from './BaseLayout_BPBCk3WP.mjs';
/* empty css                           */

const $$Astro = createAstro("https://edit-page.yourdomain.com");
const $$PageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { lang = "en", title, content } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "lang": lang, "title": title, "data-astro-cid-3zbxo6iv": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="container" data-astro-cid-3zbxo6iv> <div class="page-content" data-astro-cid-3zbxo6iv> <h1 data-astro-cid-3zbxo6iv>${content.title}</h1> <p class="last-updated" data-astro-cid-3zbxo6iv>${content.lastUpdated}</p> ${content.sections.map((section) => renderTemplate`<section data-astro-cid-3zbxo6iv> <h2 data-astro-cid-3zbxo6iv>${section.title}</h2> <p data-astro-cid-3zbxo6iv>${section.content}</p> </section>`)} </div> </div> ` })}`;
}, "/Users/conghua/code/edit-page-web/src/layouts/PageLayout.astro", void 0);

export { $$PageLayout as $ };
