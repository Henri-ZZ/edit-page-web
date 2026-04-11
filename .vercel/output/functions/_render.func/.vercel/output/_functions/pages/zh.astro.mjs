import { d as createComponent, e as renderTemplate, r as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_C3K6ID1F.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, t as translations } from '../chunks/BaseLayout_BPBCk3WP.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const lang = "zh";
  const t = translations[lang];
  return renderTemplate(_a || (_a = __template(["", " <script>\n  // Open Paddle checkout\n  function openCheckout(productId) {\n    if (!productId) {\n      alert('\u4EA7\u54C1 ID \u672A\u914D\u7F6E\u3002\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002');\n      return;\n    }\n\n    if (typeof Paddle === 'undefined') {\n      alert('Paddle \u672A\u521D\u59CB\u5316\u3002\u8BF7\u5237\u65B0\u9875\u9762\u3002');\n      return;\n    }\n\n    Paddle.Checkout.open({\n      items: [{ priceId: productId, quantity: 1 }],\n      successCallback: function(data) {\n        const orderId = data.transaction_id || data.id;\n        alert(\n          '\u4ED8\u6B3E\u6210\u529F\uFF01\\n\\n' +\n          '\u60A8\u7684\u8BA2\u5355\u53F7\uFF1A' + orderId + '\\n\\n' +\n          '\u8BF7\u4F7F\u7528\u6B64\u8BA2\u5355\u53F7\u5728\u63D2\u4EF6\u4E2D\u6FC0\u6D3B\u3002\\n\\n' +\n          '\u60A8\u4E5F\u53EF\u4EE5\u5728\u6536\u636E\u90AE\u4EF6\u7684invoice\u9644\u4EF6\u4E2D\u627E\u5230\u8BA2\u5355\u53F7\u3002'\n        );\n      }\n    });\n  }\n\n  // Get product ID from config based on plan\n  function getProductId(plan) {\n    const cfg = window.EDIT_PAGE_PADDLE_CONFIG;\n    if (!cfg || !cfg.priceIds) return null;\n    return cfg.priceIds[plan];\n  }\n\n  // Add click handlers to buy buttons\n  document.addEventListener('DOMContentLoaded', function() {\n    const buttons = document.querySelectorAll('.pricing-buy-button[data-plan]');\n    buttons.forEach(button => {\n      button.addEventListener('click', function() {\n        const plan = this.getAttribute('data-plan');\n        const productId = getProductId(plan);\n        openCheckout(productId);\n      });\n    });\n  });\n\n  // Mark that user has been redirected to prevent looping\n  sessionStorage.setItem('langRedirected', 'true');\n<\/script>"], ["", " <script>\n  // Open Paddle checkout\n  function openCheckout(productId) {\n    if (!productId) {\n      alert('\u4EA7\u54C1 ID \u672A\u914D\u7F6E\u3002\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002');\n      return;\n    }\n\n    if (typeof Paddle === 'undefined') {\n      alert('Paddle \u672A\u521D\u59CB\u5316\u3002\u8BF7\u5237\u65B0\u9875\u9762\u3002');\n      return;\n    }\n\n    Paddle.Checkout.open({\n      items: [{ priceId: productId, quantity: 1 }],\n      successCallback: function(data) {\n        const orderId = data.transaction_id || data.id;\n        alert(\n          '\u4ED8\u6B3E\u6210\u529F\uFF01\\\\n\\\\n' +\n          '\u60A8\u7684\u8BA2\u5355\u53F7\uFF1A' + orderId + '\\\\n\\\\n' +\n          '\u8BF7\u4F7F\u7528\u6B64\u8BA2\u5355\u53F7\u5728\u63D2\u4EF6\u4E2D\u6FC0\u6D3B\u3002\\\\n\\\\n' +\n          '\u60A8\u4E5F\u53EF\u4EE5\u5728\u6536\u636E\u90AE\u4EF6\u7684invoice\u9644\u4EF6\u4E2D\u627E\u5230\u8BA2\u5355\u53F7\u3002'\n        );\n      }\n    });\n  }\n\n  // Get product ID from config based on plan\n  function getProductId(plan) {\n    const cfg = window.EDIT_PAGE_PADDLE_CONFIG;\n    if (!cfg || !cfg.priceIds) return null;\n    return cfg.priceIds[plan];\n  }\n\n  // Add click handlers to buy buttons\n  document.addEventListener('DOMContentLoaded', function() {\n    const buttons = document.querySelectorAll('.pricing-buy-button[data-plan]');\n    buttons.forEach(button => {\n      button.addEventListener('click', function() {\n        const plan = this.getAttribute('data-plan');\n        const productId = getProductId(plan);\n        openCheckout(productId);\n      });\n    });\n  });\n\n  // Mark that user has been redirected to prevent looping\n  sessionStorage.setItem('langRedirected', 'true');\n<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "lang": lang, "title": "Edit Page - \u7F16\u8F91\u4EFB\u4F55\u7F51\u9875" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero"> <div class="container"> <h1>${t.hero.title}</h1> <p class="subtitle">${t.hero.subtitle}</p> <p class="description">${t.hero.description}</p> <a href="https://chrome.google.com/webstore" class="cta-button" target="_blank">${t.hero.cta}</a> </div> </section> <section class="features"> <div class="container"> <h2>${t.features.title}</h2> <div class="feature-grid"> ${t.features.list.map((feature) => renderTemplate`<div class="feature-card"> <h3>${feature.title}</h3> <p>${feature.desc}</p> </div>`)} </div> </div> </section> <section class="pricing"> <div class="container"> <h2>${t.pricing.title}</h2> <div class="pricing-grid" style="max-width: 400px; margin: 0 auto;"> <div class="pricing-card featured"> <h3>${t.pricing.list[0].title}</h3> <div class="price">${t.pricing.list[0].price}</div> <p>${t.pricing.list[0].desc}</p> <button class="pricing-buy-button" data-plan="lifetime">
立即购买
</button> </div> </div> </div> </section> <section class="browsers"> <div class="container"> <h2>${t.browsers.title}</h2> <p>${t.browsers.desc}</p> </div> </section> <section class="contact"> <div class="container"> <h2>${t.contact.title}</h2> <p>${t.contact.email}</p> </div> </section> ` }));
}, "/Users/conghua/code/edit-page-web/src/pages/zh/index.astro", void 0);

const $$file = "/Users/conghua/code/edit-page-web/src/pages/zh/index.astro";
const $$url = "/zh";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
