'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import { Plus } from 'lucide-react';
import TransactionTypeSelector from './components/TransactionTypeSelector';

export default function CreateTransactionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Finansal İşlemler', href: '/dashboard/financial' },
    { label: 'Yeni İşlem', active: true }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-72">
          <DashboardHeader
            title="Yeni İşlem Oluştur"
            breadcrumbItems={breadcrumbItems}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary-gold/10 rounded-lg">
                    <Plus className="h-5 w-5 text-primary-gold" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Yeni İşlem Oluştur
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Fatura oluşturun veya mevcut bir faturaya ödeme kaydedin
                </p>
              </div>
            </div>

            {/* Transaction Type Selection */}
            <Card className="p-8">
              <TransactionTypeSelector />
            </Card>

            {/* Help Section */}
            <Card className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    İşlem Türleri Hakkında
                  </h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p>
                      <strong>Fatura Oluştur:</strong> Yeni aidat, bakım, fayda veya ceza faturası oluşturmak için kullanın.
                    </p>
                    <p>
                      <strong>Ödeme Kaydet:</strong> Daha önce oluşturulmuş bekleyen veya gecikmiş faturalara ödeme kaydetmek için kullanın.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}