'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Button from '@/app/components/ui/Button';
import { FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import CreateBillForm from '../../components/CreateBillForm';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Fatura Oluştur',
    createBill: 'Fatura Oluştur',
    newTransaction: 'Yeni İşlem',
    financialTransactions: 'Finansal İşlemler',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    
    // Page header
    createNewBill: 'Yeni Fatura Oluştur',
    createBillDesc: 'Aidat, bakım, fayda veya ceza faturası oluşturun',
    
    // Help section
    billCreationTips: 'Fatura Oluşturma İpuçları:',
    tip1: 'Fatura türünü doğru seçtiğinizden emin olun',
    tip2: 'Vade tarihini gelecek bir tarih olarak belirleyin',
    tip3: 'Mülk ve sorumlu kişi bilgilerini kontrol edin',
    tip4: 'Belge numarası isteğe bağlıdır ancak takip için yararlıdır'
  },
  en: {
    // Page titles
    pageTitle: 'Create Bill',
    createBill: 'Create Bill',
    newTransaction: 'New Transaction',
    financialTransactions: 'Financial Transactions',
    
    // Breadcrumb
    home: 'Home',
    
    // Page header
    createNewBill: 'Create New Bill',
    createBillDesc: 'Create dues, maintenance, utility or penalty bills',
    
    // Help section
    billCreationTips: 'Bill Creation Tips:',
    tip1: 'Make sure you select the correct bill type',
    tip2: 'Set the due date as a future date',
    tip3: 'Check property and responsible person information',
    tip4: 'Document number is optional but useful for tracking'
  },
  ar: {
    // Page titles
    pageTitle: 'إنشاء فاتورة',
    createBill: 'إنشاء فاتورة',
    newTransaction: 'معاملة جديدة',
    financialTransactions: 'المعاملات المالية',
    
    // Breadcrumb
    home: 'الرئيسية',
    
    // Page header
    createNewBill: 'إنشاء فاتورة جديدة',
    createBillDesc: 'إنشاء فواتير رسوم أو صيانة أو مرافق أو غرامات',
    
    // Help section
    billCreationTips: 'نصائح إنشاء الفاتورة:',
    tip1: 'تأكد من اختيار نوع الفاتورة الصحيح',
    tip2: 'حدد تاريخ الاستحقاق كتاريخ مستقبلي',
    tip3: 'تحقق من معلومات الممتلكات والشخص المسؤول',
    tip4: 'رقم المستند اختياري ولكنه مفيد للمتابعة'
  }
};

export default function CreateBillPage() {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t.home, href: '/dashboard' },
    { label: t.financialTransactions, href: '/dashboard/financial' },
    { label: t.newTransaction, href: '/dashboard/financial/create' },
    { label: t.createBill, active: true }
  ];

  const handleCancel = () => {
    router.push('/dashboard/financial/create');
  };

  const handleSuccess = (bill: any) => {
    console.log('Bill created successfully:', bill);
    
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
            title={t.pageTitle}
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
                  <div className="p-2 bg-primary-gold/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary-gold" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t.createNewBill}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-14">
                  {t.createBillDesc}
                </p>
              </div>
            </div>

            {/* Bill Creation Form */}
            <div className="space-y-6">
              <CreateBillForm
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
                    {t.billCreationTips}
                  </p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>{t.tip1}</li>
                    <li>{t.tip2}</li>
                    <li>{t.tip3}</li>
                    <li>{t.tip4}</li>
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