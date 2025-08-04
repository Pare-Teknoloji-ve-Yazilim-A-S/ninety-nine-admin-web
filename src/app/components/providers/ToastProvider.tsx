'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '@/app/components/ui/Toast';

interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
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
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => {
    addToast({ 
      type: 'success', 
      title, 
      message,
      duration: 4000 
    });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ 
      type: 'error', 
      title, 
      message,
      duration: 7000 
    });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ 
      type: 'warning', 
      title, 
      message,
      duration: 5000 
    });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ 
      type: 'info', 
      title, 
      message,
      duration: 5000 
    });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
      />
    </ToastContext.Provider>
  );
}