'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import SentryTestButton from '@/app/components/ui/SentryTestButton';
import ErrorBoundary from '@/app/components/ui/ErrorBoundary';
import * as Sentry from '@sentry/react';

export default function SentryDebugPage() {
  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-on-light dark:text-on-dark mb-2">
            Sentry Debug Sayfası
          </h1>
          <p className="text-text-light-secondary dark:text-text-secondary">
            Sentry entegrasyonunu test etmek için bu sayfayı kullanın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <SentryTestButton />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-on-light dark:text-on-dark mb-4">
              Sentry Resmi Test Butonları
            </h3>
            <p className="text-text-light-secondary dark:text-text-secondary mb-4">
              Bu Sentry'nin kendi önerdiği test butonlarıdır. Tıklayın ve Sentry dashboard'da görün.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  console.log('🚨 Break the world button clicked');
                  throw new Error('This is your first error!');
                }}
                className="w-full px-4 py-2 bg-primary-red text-white rounded hover:bg-primary-red/90 transition-colors"
              >
                Break the world
              </button>
              
              <button
                onClick={() => {
                  console.log('📝 Test message button clicked');
                  Sentry.captureMessage('Test message from debug page', 'info');
                }}
                className="w-full px-4 py-2 bg-primary-blue text-white rounded hover:bg-primary-blue/90 transition-colors"
              >
                Send Test Message
              </button>
              
              <button
                onClick={() => {
                  console.log('🔍 Test exception button clicked');
                  Sentry.captureException(new Error('Test exception from debug page'));
                }}
                className="w-full px-4 py-2 bg-primary-gold text-primary-dark-gray rounded hover:opacity-90 transition-colors"
              >
                Send Test Exception
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-on-light dark:text-on-dark mb-4">
              Error Boundary Test
            </h3>
            <ErrorBoundary>
              <div className="space-y-3">
                <p className="text-text-light-secondary dark:text-text-secondary">
                  Bu alan Error Boundary ile sarılmıştır. Aşağıdaki butona tıklayarak 
                  Error Boundary'nin çalışıp çalışmadığını test edebilirsiniz.
                </p>
                <button
                  onClick={() => {
                    throw new Error('Error Boundary test hatası!');
                  }}
                  className="px-4 py-2 bg-primary-red text-white rounded hover:bg-primary-red/90 transition-colors"
                >
                  Error Boundary Test Et
                </button>
              </div>
            </ErrorBoundary>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-on-light dark:text-on-dark mb-4">
            Sentry Konfigürasyon Bilgileri
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-on-light dark:text-on-dark">Environment:</span>{' '}
              <span className="text-text-light-secondary dark:text-text-secondary">
                {process.env.NODE_ENV}
              </span>
            </p>
            <p>
              <span className="font-medium text-on-light dark:text-on-dark">DSN:</span>{' '}
              <span className="text-text-light-secondary dark:text-text-secondary">
                {process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Ayarlanmış' : 'Varsayılan kullanılıyor'}
              </span>
            </p>
            <p>
              <span className="font-medium text-on-light dark:text-on-dark">Debug Mode:</span>{' '}
              <span className="text-text-light-secondary dark:text-text-secondary">
                {process.env.NODE_ENV === 'development' ? 'Açık' : 'Kapalı'}
              </span>
            </p>
            <p>
              <span className="font-medium text-on-light dark:text-on-dark">Sentry Client:</span>{' '}
              <span className="text-text-light-secondary dark:text-text-secondary">
                {typeof window !== 'undefined' && (window as any).Sentry ? 'Yüklü' : 'Yüklenmemiş'}
              </span>
            </p>
            <p>
              <span className="font-medium text-on-light dark:text-on-dark">Sentry DSN:</span>{' '}
              <span className="text-text-light-secondary dark:text-text-secondary text-xs break-all">
                {typeof window !== 'undefined' && (window as any).Sentry?.getCurrentHub?.()?.getClient?.()?.getDsn?.()?.toString() || 'Bilinmiyor'}
              </span>
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-background-light-secondary dark:bg-background-secondary rounded">
            <h4 className="font-medium text-on-light dark:text-on-dark mb-2">Debug Actions:</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  console.log('🔍 Sentry Client:', (window as any).Sentry);
                  console.log('🔍 Sentry DSN:', (window as any).Sentry?.getCurrentHub?.()?.getClient?.()?.getDsn?.());
                  console.log('🔍 Sentry Options:', (window as any).Sentry?.getCurrentHub?.()?.getClient?.()?.getOptions?.());
                  console.log('🔍 Sentry Transport:', (window as any).Sentry?.getCurrentHub?.()?.getClient?.()?.getTransport?.());
                }}
                className="px-3 py-1 bg-primary-gold text-primary-dark-gray rounded text-sm hover:opacity-90"
              >
                Console'da Sentry Bilgilerini Göster
              </button>
              
              <button
                onClick={() => {
                  console.log('🌐 Network tab\'ı açın ve Sentry isteklerini kontrol edin');
                  console.log('📡 Sentry endpoint:', 'https://o4509943321001984.ingest.de.sentry.io/api/4509943356850256/store/');
                  Sentry.captureMessage('Network test message', 'info');
                }}
                className="px-3 py-1 bg-primary-blue text-white rounded text-sm hover:opacity-90"
              >
                Network Test & Info
              </button>
            </div>
            
            <div className="mt-3 p-2 bg-background-primary rounded text-xs">
              <p className="text-text-light-muted dark:text-text-muted">
                <strong>Network Kontrolü:</strong> F12 → Network tab → "Break the world" butonuna tıklayın → 
                "sentry.io" isteklerini arayın
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
