import en from './en';
import zh from './zh';

export type Language = 'en' | 'zh';
export type Translation = typeof en;

export const translations: Record<Language, Translation> = { en, zh };

export function getLocaleFromUrl(url: URL): Language {
  const path = url.pathname;
  if (path.startsWith('/zh')) return 'zh';
  return 'en';
}
