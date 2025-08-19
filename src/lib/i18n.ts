import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Desteklenen diller
export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

// Varsayılan dil
export const defaultLocale: Locale = 'tr';

// Dil konfigürasyonu
export default getRequestConfig(async ({ locale }) => {
  // Desteklenmeyen diller için 404
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

// Dil yönlendirme yardımcısı
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  
  if (locales.includes(locale)) {
    return locale;
  }
  
  return defaultLocale;
}

// Path oluşturma yardımcısı
export function createLocalizedPath(path: string, locale: Locale): string {
  if (path === '/') {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}
