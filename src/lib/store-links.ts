export const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/edit-page/edjbgblhciojhakodeflnpampekciifl';

export const EDGE_STORE_URL =
  'https://microsoftedge.microsoft.com/addons/detail/edit-page/kgkkdobebceimgmhbiclahicofidniik';

// Add the official listing URL here when the Firefox version is published.
export const FIREFOX_STORE_URL = '';

export const EXTENSION_STORE_URLS = {
  chrome: CHROME_STORE_URL,
  edge: EDGE_STORE_URL,
  firefox: FIREFOX_STORE_URL,
} as const;

export type BrowserStore = keyof typeof EXTENSION_STORE_URLS;

export function getBrowserStore(userAgent = ''): BrowserStore {
  if (/Edg\//i.test(userAgent)) return 'edge';
  if (/Firefox\//i.test(userAgent)) return 'firefox';
  return 'chrome';
}

export function getExtensionStoreUrl(userAgent = ''): string {
  const browserStore = getBrowserStore(userAgent);
  return EXTENSION_STORE_URLS[browserStore] || CHROME_STORE_URL;
}
