'use client';

import { useToastContext } from '@/app/components/providers/ToastProvider';

export interface ToastData {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
}

export const useToast = () => {
    const context = useToastContext();
    
    return {
        toasts: context.toasts,
        addToast: context.addToast,
        removeToast: context.removeToast,
        success: context.success,
        error: context.error,
        warning: context.warning,
        info: context.info,
    };
};