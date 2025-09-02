'use client';

import React from 'react';
import Button from './Button';
import { Bug, AlertTriangle, Zap } from 'lucide-react';
import { captureException, captureMessage, addBreadcrumb } from '@/lib/sentry';

interface SentryTestButtonProps {
  className?: string;
}

export default function SentryTestButton({ className }: SentryTestButtonProps) {
  const throwError = () => {
    addBreadcrumb({
      message: 'Test error button clicked',
      level: 'info',
      category: 'user-action',
    });
    
    throw new Error('Bu test hatasıdır! Sentry entegrasyonu çalışıyor.');
  };

  const throwAsyncError = async () => {
    addBreadcrumb({
      message: 'Test async error button clicked',
      level: 'info',
      category: 'user-action',
    });
    
    // Async error simulation
    setTimeout(() => {
      throw new Error('Bu async test hatasıdır!');
    }, 100);
  };

  const captureCustomMessage = () => {
    addBreadcrumb({
      message: 'Custom message button clicked',
      level: 'info',
      category: 'user-action',
    });
    
    captureMessage('Bu özel bir test mesajıdır!', 'info');
  };

  const captureCustomException = () => {
    addBreadcrumb({
      message: 'Custom exception button clicked',
      level: 'info',
      category: 'user-action',
    });
    
    const customError = new Error('Bu özel bir test exception\'ıdır!');
    customError.name = 'CustomTestError';
    captureException(customError);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-on-light dark:text-on-dark">
        Sentry Test Butonları
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={throwError}
          variant="danger"
          size="sm"
          icon={Bug}
          className="w-full"
        >
          Sync Error Fırlat
        </Button>
        
        <Button
          onClick={throwAsyncError}
          variant="danger"
          size="sm"
          icon={AlertTriangle}
          className="w-full"
        >
          Async Error Fırlat
        </Button>
        
        <Button
          onClick={captureCustomMessage}
          variant="secondary"
          size="sm"
          icon={Zap}
          className="w-full"
        >
          Custom Message
        </Button>
        
        <Button
          onClick={captureCustomException}
          variant="secondary"
          size="sm"
          icon={Bug}
          className="w-full"
        >
          Custom Exception
        </Button>
      </div>
      
      <p className="text-xs text-text-light-muted dark:text-text-muted">
        Bu butonlar Sentry entegrasyonunu test etmek içindir. 
        Production'da bu butonları kaldırın.
      </p>
    </div>
  );
}
