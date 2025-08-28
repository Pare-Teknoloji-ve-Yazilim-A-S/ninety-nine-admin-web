import { setRequestLocale } from 'next-intl/server';

export default async function SettingsLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);

  return children;
}