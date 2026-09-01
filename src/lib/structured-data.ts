import { CHROME_STORE_URL, EDGE_STORE_URL } from '@/lib/store-links';
import productIcon from '@/assets/edit-page-icon.svg';

export const SITE_URL = 'https://editpage.henriz.dev';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;
export const AUTHOR_ID = `${SITE_URL}/#henri-z`;

type SchemaNode = Record<string, unknown>;

export const schemaGraph = (...nodes: SchemaNode[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});

export function organizationSchema(): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Edit Page',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: new URL(productIcon.src, SITE_URL).toString(),
      contentUrl: new URL(productIcon.src, SITE_URL).toString(),
      width: 128,
      height: 128,
      caption: 'Edit Page',
    },
    email: 'henri@henriz.dev',
    founder: { '@id': AUTHOR_ID },
  };
}

export function authorSchema(): SchemaNode {
  return {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: 'Henri Z.',
    url: `${SITE_URL}/about/`,
    email: 'henri@henriz.dev',
    jobTitle: 'Creator and maintainer of Edit Page',
    knowsAbout: ['Browser extensions', 'Web development', 'Webpage editing', 'Browser screenshots'],
  };
}

export function websiteSchema(lang: 'en' | 'zh'): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'Edit Page',
    alternateName: 'EditPage',
    description: lang === 'zh'
      ? '无需代码，直接在网页上编辑文字、更改图片、移除元素并截图。'
      : 'Edit text, change images, remove elements, and capture screenshots directly on any webpage.',
    inLanguage: ['en-US', 'zh-CN'],
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function softwareSchema(lang: 'en' | 'zh'): SchemaNode {
  return {
    '@type': 'SoftwareApplication',
    '@id': SOFTWARE_ID,
    name: 'Edit Page',
    url: lang === 'zh' ? `${SITE_URL}/zh/` : `${SITE_URL}/`,
    description: lang === 'zh'
      ? '直接在网页上编辑文字、更改图片、移除元素，并截取当前视窗或整张网页。所有操作均在浏览器本地完成。'
      : 'Edit text, replace images, remove elements, and capture the current viewport or a full webpage. All editing happens locally in your browser.',
    applicationCategory: 'BrowserApplication',
    applicationSubCategory: 'Webpage editing and screenshot tool',
    operatingSystem: 'Google Chrome, Microsoft Edge',
    browserRequirements: 'Requires a Chromium-based browser with extension support.',
    image: `${SITE_URL}/promo-images/Edit_Page_Marquee_Promo_Tile_1400x560.png`,
    screenshot: `${SITE_URL}/edit-page-direct-edit-demo.webp`,
    downloadUrl: [CHROME_STORE_URL, EDGE_STORE_URL],
    featureList: [
      'Edit webpage text directly',
      'Replace webpage images',
      'Remove webpage elements',
      'Capture the current viewport',
      'Capture a full webpage',
    ],
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: CHROME_STORE_URL,
    },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: ['en-US', 'zh-CN'],
  };
}

export function webpageSchema({
  url,
  name,
  description,
  lang,
  type = 'WebPage',
}: {
  url: string;
  name: string;
  description: string;
  lang: 'en' | 'zh';
  type?: string | string[];
}): SchemaNode {
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': SOFTWARE_ID },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
