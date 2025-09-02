import { useCallback } from 'react';
import { captureException, captureMessage, addBreadcrumb, withScope } from '@/lib/sentry';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export function useSentryError() {
  const reportError = useCallback((
    error: Error | string,
    context?: ErrorContext
  ) => {
    withScope((scope) => {
      // Set context
      if (context?.component) {
        scope.setTag('component', context.component);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.userId) {
        scope.setTag('userId', context.userId);
      }
      if (context?.additionalData) {
        scope.setContext('additionalData', context.additionalData);
      }

      // Add breadcrumb
      addBreadcrumb({
        message: `Error in ${context?.component || 'unknown component'}`,
        level: 'error',
        category: 'error',
        data: context,
      });

      // Capture error
      if (typeof error === 'string') {
        captureMessage(error, 'error');
      } else {
        captureException(error);
      }
    });
  }, []);

  const reportWarning = useCallback((
    message: string,
    context?: ErrorContext
  ) => {
    withScope((scope) => {
      if (context?.component) {
        scope.setTag('component', context.component);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }

      addBreadcrumb({
        message: `Warning in ${context?.component || 'unknown component'}`,
        level: 'warning',
        category: 'warning',
        data: context,
      });

      captureMessage(message, 'warning');
    });
  }, []);

  const reportInfo = useCallback((
    message: string,
    context?: ErrorContext
  ) => {
    addBreadcrumb({
      message: `Info: ${message}`,
      level: 'info',
      category: 'info',
      data: context,
    });

    captureMessage(message, 'info');
  }, []);

  const trackUserAction = useCallback((
    action: string,
    component: string,
    additionalData?: Record<string, any>
  ) => {
    addBreadcrumb({
      message: `User action: ${action}`,
      level: 'info',
      category: 'user-action',
      data: {
        action,
        component,
        ...additionalData,
      },
    });
  }, []);

  return {
    reportError,
    reportWarning,
    reportInfo,
    trackUserAction,
  };
}


