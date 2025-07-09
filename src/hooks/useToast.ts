'use client';

import { useState, useCallback } from 'react';

export interface ToastData {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastData = {
            ...toast,
            id,
            duration: toast.duration || 5000,
        };

        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Auto remove after duration
        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string) => {
        addToast({ 
            type: 'success', 
            title, 
            message: message || title,
            duration: 4000 
        });
    }, [addToast]);

    const error = useCallback((title: string, message?: string) => {
        addToast({ 
            type: 'error', 
            title, 
            message: message || title,
            duration: 7000 
        });
    }, [addToast]);

    const warning = useCallback((title: string, message?: string) => {
        addToast({ 
            type: 'warning', 
            title, 
            message: message || title,
            duration: 5000 
        });
    }, [addToast]);

    const info = useCallback((title: string, message?: string) => {
        addToast({ 
            type: 'info', 
            title, 
            message: message || title,
            duration: 5000 
        });
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};