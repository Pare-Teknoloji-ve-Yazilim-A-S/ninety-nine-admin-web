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
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

// Path oluşturma yardımcısı
export function createLocalizedPath(path: string, locale: Locale): string {
  // Eğer path zaten locale içeriyorsa, sadece locale'i değiştir
  const pathSegments = path.split('/');
  const firstSegment = pathSegments[1];
  
  if (locales.includes(firstSegment as Locale)) {
    // Path zaten locale içeriyor, sadece locale'i değiştir
    pathSegments[1] = locale;
    return pathSegments.join('/');
  } else {
    // Path locale içermiyor, başına locale ekle
    if (path === '/') {
      return `/${locale}`;
    }
    return `/${locale}${path}`;
  }
}
