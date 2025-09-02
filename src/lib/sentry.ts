import * as Sentry from '@sentry/react';
import { initSentryProduction } from './sentry-production';

// Sentry konfigürasyonu - Environment based
export function initSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || "https://92a96eb68d3c398016dd5f6d355e9b96@o4509943321001984.ingest.de.sentry.io/4509943356850256";
  
  console.log('🚀 Sentry initializing with DSN:', dsn);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  
  if (process.env.NODE_ENV === 'production') {
    // Production konfigürasyonu
    initSentryProduction();
  } else {
    // Development konfigürasyonu
    Sentry.init({
      dsn: dsn,
      sendDefaultPii: true,
      debug: true,
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: 'development',
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      integrations: [
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      beforeSend(event, hint) {
        console.log('Sentry Event:', event);
        return event;
      },
    });
  }
  
  console.log('✅ Sentry initialized successfully');
}

// Error boundary için Sentry wrapper
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Performance monitoring
export const withScope = Sentry.withScope;

// Custom error reporting
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const addBreadcrumb = Sentry.addBreadcrumb;

// User context ayarlama
export const setUser = Sentry.setUser;
export const setTag = Sentry.setTag;
export const setContext = Sentry.setContext;
