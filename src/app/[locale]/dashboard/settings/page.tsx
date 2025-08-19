'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { unitPricesService } from '@/services/unit-prices.service';
import enumsService from '@/services/enums.service';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', active: true }
];

export default function DashboardSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader 
            title="Ayarlar" 
            breadcrumbItems={BREADCRUMB_ITEMS}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                  Ayarlar
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Sistem genelindeki ayarları, entegrasyonları ve bakımı yapılandırın
                </p>
              </div>
              <div className="flex gap-3">
                <LanguageSwitcher />
                <button
                  onClick={() => window.location.href = '/dashboard/settings/device-settings'}
                  className="inline-flex items-center px-4 py-2 bg-primary-gold text-white text-sm font-medium rounded-md hover:bg-primary-gold/80 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Cihaz Ayarları
                </button>
              </div>
            </div>

            {/* Dil Ayarları Kartı */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                  Dil Ayarları
                </h3>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-4">
                  Uygulama dilini değiştirin. Değişiklik anında uygulanacaktır.
                </p>
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <div className="text-sm text-text-light-muted dark:text-text-muted">
                    Şu anda aktif dil: <span className="font-medium">Türkçe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diğer Ayarlar */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                  Diğer Ayarlar
                </h3>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Bu bölümde diğer sistem ayarları yer alacak.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
