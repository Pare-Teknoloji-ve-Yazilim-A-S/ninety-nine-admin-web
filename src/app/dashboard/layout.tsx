'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [messages, setMessages] = useState<Record<string, any> | null>(null);
  const [locale, setLocale] = useState('tr'); // Default locale

  useEffect(() => {
    // Get locale from localStorage or default to 'tr'
    const savedLocale = localStorage.getItem('preferredLanguage') || 'tr';
    setLocale(savedLocale);

    // Load messages for the current locale
    const loadMessages = async () => {
      try {
        const messagesModule = await import(`../../messages/${savedLocale}.json`);
        setMessages(messagesModule.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to Turkish
        try {
          const fallbackMessages = await import(`../../messages/tr.json`);
          setMessages(fallbackMessages.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback messages:', fallbackError);
        }
      }
    };

    loadMessages();
  }, []);

  // Listen for locale changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferredLanguage' && e.newValue) {
        setLocale(e.newValue);
        // Reload messages for new locale
        const loadMessages = async () => {
          try {
            const messagesModule = await import(`../../messages/${e.newValue}.json`);
            setMessages(messagesModule.default);
          } catch (error) {
            console.error('Failed to load messages for new locale:', error);
          }
        };
        loadMessages();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}