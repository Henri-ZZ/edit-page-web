import { d as createComponent, e as renderTemplate, r as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_C3K6ID1F.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, t as translations } from '../chunks/BaseLayout_BPBCk3WP.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const lang = "en";
  const t = translations[lang];
  return renderTemplate(_a || (_a = __template(["", " <script>\n  // Open Paddle checkout\n  function openCheckout(productId) {\n    if (!productId) {\n      alert('Product ID not configured. Please check back later.');\n      return;\n    }\n\n    if (typeof Paddle === 'undefined') {\n      alert('Paddle not initialized. Please refresh the page.');\n      return;\n    }\n\n    Paddle.Checkout.open({\n      items: [{ priceId: productId, quantity: 1 }]\n    });\n  }\n\n  // Get product ID from config based on plan\n  function getProductId(plan) {\n    const cfg = window.EDIT_PAGE_PADDLE_CONFIG;\n    if (!cfg || !cfg.priceIds) return null;\n    return cfg.priceIds[plan];\n  }\n\n  // Add click handlers to buy buttons\n  document.addEventListener('DOMContentLoaded', function() {\n    const buttons = document.querySelectorAll('.pricing-buy-button[data-plan]');\n    buttons.forEach(button => {\n      button.addEventListener('click', function() {\n        const plan = this.getAttribute('data-plan');\n        const productId = getProductId(plan);\n        openCheckout(productId);\n      });\n    });\n  });\n\n  // Auto-detect browser language and redirect if needed\n  (function() {\n    // Check if user has already been redirected in this session\n    if (sessionStorage.getItem('langRedirected')) {\n      return;\n    }\n\n    // Get browser language\n    const browserLang = navigator.language || navigator.userLanguage;\n\n    // If browser language is Chinese, redirect to Chinese version\n    if (browserLang && browserLang.startsWith('zh')) {\n      sessionStorage.setItem('langRedirected', 'true');\n      window.location.href = '/zh/';\n    }\n  })();\n<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "lang": lang, "title": "Edit Page - Edit any webpage" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero"> <div class="container"> <h1>${t.hero.title}</h1> <p class="subtitle">${t.hero.subtitle}</p> <p class="description">${t.hero.description}</p> <a href="https://chrome.google.com/webstore" class="cta-button" target="_blank">${t.hero.cta}</a> </div> </section> <section class="features"> <div class="container"> <h2>${t.features.title}</h2> <div class="feature-grid"> ${t.features.list.map((feature) => renderTemplate`<div class="feature-card"> <h3>${feature.title}</h3> <p>${feature.desc}</p> </div>`)} </div> </div> </section> <section class="pricing"> <div class="container"> <h2>${t.pricing.title}</h2> <div class="pricing-grid" style="max-width: 400px; margin: 0 auto;"> <div class="pricing-card featured"> <h3>${t.pricing.list[0].title}</h3> <div class="price">${t.pricing.list[0].price}</div> <p>${t.pricing.list[0].desc}</p> <button class="pricing-buy-button" data-plan="lifetime">
Buy Now
</button> </div> </div> </div> </section> <section class="browsers"> <div class="container"> <h2>${t.browsers.title}</h2> <p>${t.browsers.desc}</p> </div> </section> <section class="contact"> <div class="container"> <h2>${t.contact.title}</h2> <p>${t.contact.email}</p> </div> </section> ` }));
}, "/Users/conghua/code/edit-page-web/src/pages/index.astro", void 0);

const $$file = "/Users/conghua/code/edit-page-web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
