'use client';

import React from 'react';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  eventId: string | null;
}

function ErrorFallback({ error, resetError, eventId }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-primary-red" />
        </div>
        
        <h1 className="text-2xl font-bold text-on-light dark:text-on-dark mb-2">
          Bir Hata Oluştu
        </h1>
        
        <p className="text-text-light-secondary dark:text-text-secondary mb-4">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-text-light-muted dark:text-text-muted mb-2">
              Hata Detayları
            </summary>
            <pre className="text-xs bg-background-light-secondary dark:bg-background-secondary p-3 rounded border overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        {eventId && (
          <p className="text-xs text-text-light-muted dark:text-text-muted mb-4">
            Hata ID: {eventId}
          </p>
        )}
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={resetError}
            variant="primary"
            size="md"
            icon={RefreshCw}
          >
            Sayfayı Yenile
          </Button>
          
          <Button
            onClick={() => window.location.href = '/dashboard'}
            variant="secondary"
            size="md"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  showDialog?: boolean;
}

export default function ErrorBoundary({ 
  children, 
  fallback = ErrorFallback,
  showDialog = false 
}: ErrorBoundaryProps) {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError, eventId }) => {
        const FallbackComponent = fallback;
        return <FallbackComponent error={error as Error} resetError={resetError} eventId={eventId} />;
      }}
      showDialog={showDialog}
      beforeCapture={(scope) => {
        // Error context'ini zenginleştir
        scope.setTag('errorBoundary', true);
        scope.setContext('errorInfo', {
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        });
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
}
