'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/auth/AuthProvider';
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import {
  Building,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Bell,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  CreditCard
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while determining authentication status
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          99Club Admin
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Yükleniyor...
        </p>
      </div>
    </div>
  );
}