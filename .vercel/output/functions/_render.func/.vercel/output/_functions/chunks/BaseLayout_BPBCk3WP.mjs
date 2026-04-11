import { c as createAstro, d as createComponent, e as renderTemplate, f as addAttribute, g as renderSlot, h as renderHead } from './astro/server_C3K6ID1F.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */

const en = {
  nav: {
    home: "Home",
    install: "Install"
  },
  hero: {
    title: "Edit Page",
    subtitle: "A powerful browser tool for editing any webpage content in real-time",
    description: "A powerful browser tool that supports real-time editing of any webpage content. Runs 100% locally, no user data collection, privacy and security guaranteed.",
    cta: "Add to Chrome"
  },
  features: {
    title: "Features",
    list: [
      { title: "Edit Webpage Text with One Click", desc: "Edit any text content on webpages in real-time" },
      { title: "Freely Replace Webpage Images", desc: "Replace images on the page with your own" },
      { title: "One-Click Full Page Screenshot Export", desc: "Export edited pages as screenshots with one click" },
      { title: "Privacy and Security", desc: "Runs 100% locally, no user data collection" }
    ]
  },
  pricing: {
    title: "Pricing",
    list: [
      { title: "Perpetual License", price: "$9.99", desc: "One-time payment, permanent use, includes all future free updates" }
    ]
  },
  browsers: {
    title: "Supported Browsers",
    desc: "Chrome / Edge / Firefox and other major Chromium-based browsers"
  },
  contact: {
    title: "Contact Us",
    email: "Email: henrizhang@henri.ren"
  },
  footer: {
    terms: "Terms of Service",
    refund: "Refund Policy",
    privacy: "Privacy Policy",
    copyright: "© 2026 Edit Page. All rights reserved."
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "Last Updated: April 2026",
    sections: [
      {
        title: "1. Business Information",
        content: "This service is provided by edit page extension."
      },
      {
        title: "2. Usage License",
        content: "This browser extension is intended for personal non-commercial use only. Any commercial use, illegal use, or operations that violate website terms of service are prohibited."
      },
      {
        title: "3. User Responsibility",
        content: "When using this tool, users must comply with the laws and regulations of their country/region and the usage rules of the corresponding websites. All responsibilities arising from violating use shall be borne by the user."
      },
      {
        title: "4. Payment Processing",
        content: "All payment processes are securely handled by the Paddle platform. This tool only provides software authorization and does not store any user payment information."
      },
      {
        title: "5. Digital Product Notice",
        content: "This extension is a digital product, delivered immediately upon successful payment. By confirming your purchase, you agree to immediate delivery. Your 14-day right of withdrawal expires once you download or start using the product."
      },
      {
        title: "6. Terms Updates",
        content: "We reserve the right to update extension features and adjust these terms of service at any time. Updates will be posted on the product page."
      }
    ]
  },
  refund: {
    title: "Refund Policy",
    lastUpdated: "Last Updated: April 2026",
    sections: [
      {
        title: "1. Digital Product Notice",
        content: "This extension is a digital product, delivered immediately upon successful payment. By confirming your purchase, you agree to immediate delivery. Your 14-day right of withdrawal expires once you download or start using the product."
      },
      {
        title: "2. Refund Eligibility",
        content: "Refunds are only available in cases of product malfunction, inability to use, or significant discrepancy from the description (not subjective dislike). Refunds are reviewed and processed by Paddle."
      },
      {
        title: "3. How to Apply for a Refund",
        content: "Refund applications must be submitted through the Paddle platform. We can assist by providing order/usage records, but final approval authority lies with Paddle."
      }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: April 2026",
    sections: [
      {
        title: "1. Data Collection",
        content: "This browser extension does not collect, store, or transmit any personal sensitive data of users, including but not limited to passwords, browsing history, payment information, and personal identity information."
      },
      {
        title: "2. Data Storage",
        content: "All configurations and authorization status of the extension are stored only on the user's local device and will not be uploaded to any external servers."
      },
      {
        title: "3. Third-Party Sharing",
        content: "We will not share or sell user data with any third parties, and will only provide necessary information to regulatory authorities in compliance with legal requirements."
      },
      {
        title: "4. Payment Data",
        content: "Payment-related data is independently processed by the Paddle platform in accordance with its privacy policy. This tool does not obtain any payment-related information."
      }
    ]
  }
};

const zh = {
  nav: {
    home: "首页",
    install: "安装"
  },
  hero: {
    title: "Edit Page",
    subtitle: "一款功能强大的浏览器工具，支持实时编辑任意网页内容",
    description: "一款功能强大的浏览器工具，支持实时编辑任意网页内容。100%本地运行，不收集用户数据，隐私安全。",
    cta: "添加到 Chrome"
  },
  features: {
    title: "功能特点",
    list: [
      { title: "一键修改网页文字内容", desc: "实时编辑网页上的任何文字内容" },
      { title: "自由替换网页图片", desc: "用您自己的图片替换页面上的图片" },
      { title: "全屏截图一键导出", desc: "将编辑后的页面一键导出为截图" },
      { title: "隐私安全", desc: "100%本地运行，不收集用户数据" }
    ]
  },
  pricing: {
    title: "定价",
    list: [
      { title: "永久授权", price: "¥59", desc: "一次性付费，永久使用，包含所有后续免费更新" }
    ]
  },
  browsers: {
    title: "适用浏览器",
    desc: "Chrome / Edge / Firefox 等主流Chromium内核浏览器"
  },
  contact: {
    title: "联系我们",
    email: "客服邮箱：henrizhang@henri.ren"
  },
  footer: {
    terms: "服务条款",
    refund: "退款政策",
    privacy: "隐私政策",
    copyright: "© 2026 Edit Page。保留所有权利。"
  },
  terms: {
    title: "服务条款",
    lastUpdated: "最后更新：2026年4月",
    sections: [
      {
        title: "1. 业务信息",
        content: "本服务由 edit page extension 提供。"
      },
      {
        title: "2. 使用许可",
        content: "本浏览器插件仅面向个人非商业使用，禁止用于任何商业用途、非法用途或违反网站服务条款的操作。"
      },
      {
        title: "3. 用户责任",
        content: "用户使用本工具时，需自行遵守所在国家/地区的法律法规及对应网站的使用规则，因违规使用产生的一切责任由用户自行承担。"
      },
      {
        title: "4. 支付处理",
        content: "所有支付流程由Paddle平台安全处理，本工具仅提供软件授权，不存储用户任何支付信息。"
      },
      {
        title: "5. 数字商品说明",
        content: "本插件为数字商品，支付成功后即时交付使用。用户确认购买即表示同意立即交付，下载/开始使用后，14天无理由退款权失效。"
      },
      {
        title: "6. 条款更新",
        content: "我们保留随时更新插件功能、调整服务条款的权利，更新后将在产品页公示。"
      }
    ]
  },
  refund: {
    title: "退款政策",
    lastUpdated: "最后更新：2026年4月",
    sections: [
      {
        title: "1. 数字商品说明",
        content: "本插件为数字商品，支付成功后即时交付使用。用户确认购买即表示同意立即交付，下载/开始使用后，14天无理由退款权失效。"
      },
      {
        title: "2. 可退款情形",
        content: "仅在产品故障、无法使用、与描述严重不符（非主观不喜欢）的情况下，可申请退款。退款由Paddle平台审核处理。"
      },
      {
        title: "3. 退款申请方式",
        content: "退款申请需通过Paddle平台提交，我们可协助提供订单/使用记录，但最终审批权在Paddle。"
      }
    ]
  },
  privacy: {
    title: "隐私政策",
    lastUpdated: "最后更新：2026年4月",
    sections: [
      {
        title: "1. 数据收集",
        content: "本浏览器插件不会收集、存储、传输用户的任何个人敏感数据，包括但不限于密码、浏览历史、支付信息、个人身份信息。"
      },
      {
        title: "2. 数据存储",
        content: "插件的所有配置、授权状态仅存储在用户本地设备，不会上传至任何外部服务器。"
      },
      {
        title: "3. 第三方共享",
        content: "我们不会向任何第三方共享、出售用户数据，仅在法律要求的情况下配合监管机构提供必要信息。"
      },
      {
        title: "4. 支付数据",
        content: "支付相关数据由Paddle平台独立处理，遵循其隐私政策，本工具不获取任何支付相关信息。"
      }
    ]
  }
};

const translations = { en, zh };

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://edit-page.yourdomain.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { lang = "en", title = "Edit Page" } = Astro2.props;
  const t = translations[lang];
  return renderTemplate(_a || (_a = __template(["<html", '> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', "</title><!-- Paddle.js -->", '</head> <body> <nav> <div class="container"> <div class="nav-content"> <a', ' class="logo">Edit Page</a> <div class="nav-links"> <a', ">", '</a> <a href="https://chrome.google.com/webstore" class="cta-button" target="_blank">', "</a> <a", ' class="lang-toggle"> ', " </a> </div> </div> </div> </nav> ", ' <footer> <div class="container"> <div class="footer-links"> <a', ">", "</a> <a", ">", "</a> <a", ">", '</a> </div> <p class="copyright">', "</p> </div> </footer> <script>\n    // Paddle Configuration\n    const PADDLE_ENVIRONMENTS = {\n      sandbox: {\n        clientToken: 'test_b199863fe4c1ba4aee821473731',\n        priceIds: {\n          lifetime: 'pri_01knvyjwd2zs93wkqhb5xk9npg'\n        }\n      },\n      production: {\n        clientToken: 'live_4388271e25ce3173f9764070f47',\n        priceIds: {\n          lifetime: 'pri_01knvsqmajmgk7tfmzzq0sxzyb'\n        }\n      }\n    };\n\n    // Auto-detect environment based on hostname\n    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';\n    const ACTIVE_ENVIRONMENT = isLocalhost ? 'sandbox' : 'production';\n    const envConfig = PADDLE_ENVIRONMENTS[ACTIVE_ENVIRONMENT];\n    console.log('Paddle environment:', ACTIVE_ENVIRONMENT, '(localhost:', isLocalhost, ')');\n\n    // Store config globally for other scripts\n    window.EDIT_PAGE_PADDLE_CONFIG = {\n      clientToken: envConfig.clientToken,\n      environment: ACTIVE_ENVIRONMENT,\n      priceIds: envConfig.priceIds\n    };\n\n    // Wait for Paddle.js to load and initialize\n    function initPaddle() {\n      if (window.Paddle) {\n        console.log('Paddle loaded, initializing...');\n        Paddle.Environment.set(ACTIVE_ENVIRONMENT);\n        Paddle.Initialize({\n          token: envConfig.clientToken\n        });\n        console.log('\u2705 Paddle initialized');\n      } else {\n        console.log('Waiting for Paddle...');\n        setTimeout(initPaddle, 50);\n      }\n    }\n\n    // Start initialization when DOM is ready\n    if (document.readyState === 'loading') {\n      document.addEventListener('DOMContentLoaded', initPaddle);\n    } else {\n      initPaddle();\n    }\n  <\/script> </body> </html>"])), addAttribute(lang, "lang"), title, renderHead(), addAttribute(lang === "en" ? "/" : "/zh/", "href"), addAttribute(lang === "en" ? "/" : "/zh/", "href"), t.nav.home, t.nav.install, addAttribute(lang === "en" ? "/zh/" : "/", "href"), lang === "en" ? "\u4E2D\u6587" : "EN", renderSlot($$result, $$slots["default"]), addAttribute(lang === "en" ? "/terms" : "/zh/terms", "href"), t.footer.terms, addAttribute(lang === "en" ? "/refund" : "/zh/refund", "href"), t.footer.refund, addAttribute(lang === "en" ? "/privacy" : "/zh/privacy", "href"), t.footer.privacy, t.footer.copyright);
}, "/Users/conghua/code/edit-page-web/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, translations as t };
