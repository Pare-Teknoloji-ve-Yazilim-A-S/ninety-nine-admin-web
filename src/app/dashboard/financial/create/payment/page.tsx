'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Button from '@/app/components/ui/Button';
import { CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';
import CreatePaymentForm from '../../components/CreatePaymentForm';

export default function CreatePaymentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Finansal İşlemler', href: '/dashboard/financial' },
    { label: 'Yeni İşlem', href: '/dashboard/financial/create' },
    { label: 'Ödeme Kaydet', active: true }
  ];

  const handleCancel = () => {
    router.push('/dashboard/financial/create');
  };

  const handleSuccess = (payment: any) => {
    console.log('Payment created successfully:', payment);
    
    // Show success message and redirect
    // In a real app, you might want to show a toast notification here
    setTimeout(() => {
      router.push('/dashboard/financial');
    }, 1000);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-72">
          <DashboardHeader
            title="Ödeme Kaydet"
            breadcrumbItems={breadcrumbItems}
          />

          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={handleGoBack}
                    className="p-2"
                  />
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ödeme Kaydet
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-14">
                  Mevcut bir faturaya ödeme kaydedin
                </p>
              </div>
            </div>

            {/* Payment Creation Form */}
            <div className="space-y-6">
              <CreatePaymentForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                loading={isSubmitting}
              />
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Ödeme Kaydetme İpuçları:
                  </p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>Sadece bekleyen veya gecikmiş faturalar görüntülenir</li>
                    <li>Ödeme tutarı fatura tutarından farklı olabilir (kısmi/fazla ödeme)</li>
                    <li>Ödeme yöntemini doğru seçtiğinizden emin olun</li>
                    <li>İşlem ID ve makbuz numarası takip için önemlidir</li>
                    <li>Ödeme tarihi geçmiş bir tarih olabilir</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}