import * as Sentry from '@sentry/react';

// Production Sentry konfigürasyonu
export function initSentryProduction() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured for production');
    return;
  }
  
  Sentry.init({
    dsn: dsn,
    
    // Environment
    environment: 'production',
    
    // Performance monitoring - düşük sample rate
    tracesSampleRate: 0.1,
    
    // Session replay - sadece hata durumlarında
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    
    // PII - production'da kapalı
    sendDefaultPii: false,
    
    // Debug mode kapalı
    debug: false,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true, // Production'da text'leri maskele
        blockAllMedia: true, // Media'ları engelle
      }),
    ],
    
    // Error filtering - production'da daha sıkı
    beforeSend(event, hint) {
      // Network hatalarını filtrele
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Network hatalarını filtrele
          if (error.message.includes('Network Error') || 
              error.message.includes('fetch') ||
              error.message.includes('timeout')) {
            return null;
          }
          
          // Chunk load hatalarını filtrele (hot reload)
          if (error.message.includes('Loading chunk') ||
              error.message.includes('ChunkLoadError')) {
            return null;
          }
        }
      }
      
      // 4xx hatalarını filtrele (client hataları)
      if (event.exception) {
        const error = hint.originalException as any;
        if (error?.status >= 400 && error?.status < 500) {
          return null;
        }
      }
      
      return event;
    },
    
    // Ignore patterns
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Script error',
      'Network request failed',
    ],
  });
}


