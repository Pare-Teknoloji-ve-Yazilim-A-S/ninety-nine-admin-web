'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import { Plus } from 'lucide-react';
import TransactionTypeSelector from './components/TransactionTypeSelector';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Yeni İşlem Oluştur',
    newTransaction: 'Yeni İşlem',
    financialTransactions: 'Finansal İşlemler',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    
    // Page header
    createNewTransaction: 'Yeni İşlem Oluştur',
    createBillOrPayment: 'Fatura oluşturun veya mevcut bir faturaya ödeme kaydedin',
    
    // Help section
    aboutTransactionTypes: 'İşlem Türleri Hakkında',
    createBill: 'Fatura Oluştur:',
    createBillDesc: 'Yeni aidat, bakım, fayda veya ceza faturası oluşturmak için kullanın.',
    recordPayment: 'Ödeme Kaydet:',
    recordPaymentDesc: 'Daha önce oluşturulmuş bekleyen veya gecikmiş faturalara ödeme kaydetmek için kullanın.'
  },
  en: {
    // Page titles
    pageTitle: 'Create New Transaction',
    newTransaction: 'New Transaction',
    financialTransactions: 'Financial Transactions',
    
    // Breadcrumb
    home: 'Home',
    
    // Page header
    createNewTransaction: 'Create New Transaction',
    createBillOrPayment: 'Create a bill or record payment for an existing bill',
    
    // Help section
    aboutTransactionTypes: 'About Transaction Types',
    createBill: 'Create Bill:',
    createBillDesc: 'Use to create new dues, maintenance, utility or penalty bills.',
    recordPayment: 'Record Payment:',
    recordPaymentDesc: 'Use to record payment for previously created pending or overdue bills.'
  },
  ar: {
    // Page titles
    pageTitle: 'إنشاء معاملة جديدة',
    newTransaction: 'معاملة جديدة',
    financialTransactions: 'المعاملات المالية',
    
    // Breadcrumb
    home: 'الرئيسية',
    
    // Page header
    createNewTransaction: 'إنشاء معاملة جديدة',
    createBillOrPayment: 'إنشاء فاتورة أو تسجيل دفعة لفاتورة موجودة',
    
    // Help section
    aboutTransactionTypes: 'حول أنواع المعاملات',
    createBill: 'إنشاء فاتورة:',
    createBillDesc: 'استخدم لإنشاء فواتير رسوم أو صيانة أو مرافق أو غرامات جديدة.',
    recordPayment: 'تسجيل دفعة:',
    recordPaymentDesc: 'استخدم لتسجيل دفعة للفواتير المعلقة أو المتأخرة التي تم إنشاؤها مسبقاً.'
  }
};

export default function CreateTransactionPage() {
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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t.home, href: '/dashboard' },
    { label: t.financialTransactions, href: '/dashboard/financial' },
    { label: t.newTransaction, active: true }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-72">
          <DashboardHeader
            title={t.pageTitle}
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
                    {t.createNewTransaction}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.createBillOrPayment}
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
                    {t.aboutTransactionTypes}
                  </h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p>
                      <strong>{t.createBill}</strong> {t.createBillDesc}
                    </p>
                    <p>
                      <strong>{t.recordPayment}</strong> {t.recordPaymentDesc}
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