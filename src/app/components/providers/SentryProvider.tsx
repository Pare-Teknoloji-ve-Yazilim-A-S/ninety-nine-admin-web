'use client';

import { useEffect } from 'react';
import { initSentry } from '@/lib/sentry';

interface SentryProviderProps {
  children: React.ReactNode;
}

export default function SentryProvider({ children }: SentryProviderProps) {
  useEffect(() => {
    // Sentry'yi sadece client-side'da initialize et
    if (typeof window !== 'undefined') {
      console.log('SentryProvider: Initializing Sentry...');
      initSentry();
      console.log('SentryProvider: Sentry initialized');
      
      // Global window'a Sentry'yi ekle (debug için)
      (window as any).Sentry = require('@sentry/react');
    }
  }, []);

  return <>{children}</>;
}
