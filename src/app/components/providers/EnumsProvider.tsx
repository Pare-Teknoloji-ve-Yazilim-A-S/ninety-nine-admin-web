'use client';

import React, { useEffect } from 'react';
import { enumsService } from '@/services/enums.service';
import { useAuth } from '@/app/components/auth/AuthProvider';

interface EnumsProviderProps {
  children: React.ReactNode;
}

export default function EnumsProvider({ children }: EnumsProviderProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Prefetch enums when user is authenticated
    enumsService.getAllEnums().catch((error) => {
      console.warn('Failed to prefetch enums:', error);
    });
  }, [isAuthenticated]);

  return <>{children}</>;
}




