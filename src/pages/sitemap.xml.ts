import type { APIRoute } from 'astro';

export const prerender = true;

const SITE = 'https://editpage.henriz.dev';

type PathPair = { en: string; zh: string };

const PAGES: PathPair[] = [
  { en: '/', zh: '/zh/' },
  { en: '/getting-started/', zh: '/zh/getting-started/' },
  { en: '/about/', zh: '/zh/about/' },
  { en: '/contact/', zh: '/zh/contact/' },
  { en: '/privacy/', zh: '/zh/privacy/' },
  { en: '/terms/', zh: '/zh/terms/' },
  { en: '/refund/', zh: '/zh/refund/' },
  { en: '/edit-text-on-webpage/', zh: '/zh/edit-text-on-webpage/' },
  { en: '/replace-images-on-webpage/', zh: '/zh/replace-images-on-webpage/' },
  { en: '/remove-elements-from-webpage/', zh: '/zh/remove-elements-from-webpage/' },
  { en: '/full-page-screenshot/', zh: '/zh/full-page-screenshot/' }
];

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const LASTMOD = new Date().toISOString().slice(0, 10);

function urlEntry(url: string, enUrl: string, zhUrl: string): string[] {
  const enFull = escapeXml(enUrl);
  const zhFull = escapeXml(zhUrl);
  const loc = escapeXml(url);
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${LASTMOD}</lastmod>`,
    `    <xhtml:link rel="alternate" hreflang="en-US" href="${enFull}"/>`,
    `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhFull}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${enFull}"/>`,
    '  </url>'
  ];
}

function buildBody(): string {
  const entries: string[] = [];
  for (const pair of PAGES) {
    const enUrl = new URL(pair.en, SITE).toString();
    const zhUrl = new URL(pair.zh, SITE).toString();
    entries.push(...urlEntry(enUrl, enUrl, zhUrl));
    entries.push(...urlEntry(zhUrl, enUrl, zhUrl));
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    ''
  ].join('\n');
}

export const GET: APIRoute = () => {
  const body = buildBody();
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
