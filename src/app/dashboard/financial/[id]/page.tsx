'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Skeleton from '@/app/components/ui/Skeleton';
import EmptyState from '@/app/components/ui/EmptyState';
import { 
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  FileText,
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransactionDetail, isBillTransaction, isPaymentTransaction } from './hooks/useTransactionDetail';
import TransactionDetailHeader from './components/TransactionDetailHeader';
import FinancialSummaryCard from './components/FinancialSummaryCard';
import RelatedTransactionsTable from './components/RelatedTransactionsTable';
import TransactionActions from './components/TransactionActions';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    transactionDetailLoading: 'İşlem Detayı Yükleniyor...',
    transactionDetail: 'İşlem Detayı',
    billDetail: 'Fatura Detayı',
    paymentDetail: 'Ödeme Detayı',
    
    // Breadcrumbs
    home: 'Ana Sayfa',
    financialTransactions: 'Finansal İşlemler',
    billDetailBreadcrumb: 'Fatura Detayı',
    paymentDetailBreadcrumb: 'Ödeme Detayı',
    transactionDetailBreadcrumb: 'İşlem Detayı',
    
    // Error states
    transactionNotFound: 'İşlem Bulunamadı',
    transactionDetailsFailed: 'İşlem Detayları Yüklenemedi',
    transactionNotFoundDesc: 'Aradığınız finansal işlem bulunamadı veya silinmiş olabilir.',
    goBack: 'Geri Dön',
    tryAgain: 'Tekrar Dene',
    returnToFinancial: 'Finansal İşlemlere Dön',
    
    // Payment method descriptions
    paymentWithMethod: 'ile ödeme'
  },
  en: {
    // Page titles
    transactionDetailLoading: 'Loading Transaction Detail...',
    transactionDetail: 'Transaction Detail',
    billDetail: 'Bill Detail',
    paymentDetail: 'Payment Detail',
    
    // Breadcrumbs
    home: 'Home',
    financialTransactions: 'Financial Transactions',
    billDetailBreadcrumb: 'Bill Detail',
    paymentDetailBreadcrumb: 'Payment Detail',
    transactionDetailBreadcrumb: 'Transaction Detail',
    
    // Error states
    transactionNotFound: 'Transaction Not Found',
    transactionDetailsFailed: 'Failed to Load Transaction Details',
    transactionNotFoundDesc: 'The financial transaction you are looking for could not be found or may have been deleted.',
    goBack: 'Go Back',
    tryAgain: 'Try Again',
    returnToFinancial: 'Return to Financial Transactions',
    
    // Payment method descriptions
    paymentWithMethod: 'payment with'
  },
  ar: {
    // Page titles
    transactionDetailLoading: 'جاري تحميل تفاصيل المعاملة...',
    transactionDetail: 'تفاصيل المعاملة',
    billDetail: 'تفاصيل الفاتورة',
    paymentDetail: 'تفاصيل الدفع',
    
    // Breadcrumbs
    home: 'الرئيسية',
    financialTransactions: 'المعاملات المالية',
    billDetailBreadcrumb: 'تفاصيل الفاتورة',
    paymentDetailBreadcrumb: 'تفاصيل الدفع',
    transactionDetailBreadcrumb: 'تفاصيل المعاملة',
    
    // Error states
    transactionNotFound: 'المعاملة غير موجودة',
    transactionDetailsFailed: 'فشل في تحميل تفاصيل المعاملة',
    transactionNotFoundDesc: 'المعاملة المالية التي تبحث عنها غير موجودة أو قد تكون محذوفة.',
    goBack: 'العودة',
    tryAgain: 'حاول مرة أخرى',
    returnToFinancial: 'العودة إلى المعاملات المالية',
    
    // Payment method descriptions
    paymentWithMethod: 'دفع بـ'
  }
};

export default function TransactionDetailPage() {
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
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const { transaction, loading, error, refetch, isRefetching } = useTransactionDetail(transactionId);

  // Generate breadcrumbs
  const getBreadcrumbItems = () => {
    const baseItems = [
      { label: t.home, href: '/dashboard' },
      { label: t.financialTransactions, href: '/dashboard/financial' }
    ];

    if (transaction) {
      const typeLabel = isBillTransaction(transaction) ? t.billDetailBreadcrumb : t.paymentDetailBreadcrumb;
      return [
        ...baseItems,
        { label: typeLabel, active: true }
      ];
    }

    return [
      ...baseItems,
      { label: t.transactionDetailBreadcrumb, active: true }
    ];
  };

  const handleGoBack = () => {
    router.push('/dashboard/financial');
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading State
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="lg:ml-72">
            <DashboardHeader
              title={t.transactionDetailLoading}
              breadcrumbItems={getBreadcrumbItems()}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header Skeleton */}
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="w-64 h-6 mb-2" />
                  <Skeleton className="w-96 h-4" />
                </div>
              </div>

              {/* Cards Grid Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="w-full h-64 rounded-2xl" />
                  <Skeleton className="w-full h-96 rounded-2xl" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="w-full h-80 rounded-2xl" />
                  <Skeleton className="w-full h-48 rounded-2xl" />
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error State
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="lg:ml-72">
            <DashboardHeader
              title={t.transactionDetail}
              breadcrumbItems={getBreadcrumbItems()}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Back Button */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowLeft}
                  onClick={handleGoBack}
                  className="p-2"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t.transactionNotFound}
                  </h1>
                </div>
              </div>

              <Card className="p-8">
                <EmptyState
                  icon={<AlertCircle className="h-8 w-8" />}
                  title={t.transactionDetailsFailed}
                  description={error}
                  action={
                    <div className="flex gap-3">
                      <Button 
                        variant="secondary" 
                        icon={ArrowLeft}
                        onClick={handleGoBack}
                      >
                        {t.goBack}
                      </Button>
                      <Button 
                        variant="primary" 
                        icon={RefreshCw}
                        onClick={handleRefresh}
                        isLoading={isRefetching}
                      >
                        {t.tryAgain}
                      </Button>
                    </div>
                  }
                />
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // No transaction found
  if (!transaction) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="lg:ml-72">
            <DashboardHeader
              title={t.transactionDetail}
              breadcrumbItems={getBreadcrumbItems()}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="p-8">
                <EmptyState
                  icon={<FileText className="h-8 w-8" />}
                  title={t.transactionNotFound}
                  description={t.transactionNotFoundDesc}
                  action={
                    <Button 
                      variant="primary" 
                      icon={ArrowLeft}
                      onClick={handleGoBack}
                    >
                      {t.returnToFinancial}
                    </Button>
                  }
                />
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Main Content
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-72">
          <DashboardHeader
            title={isBillTransaction(transaction) ? t.billDetail : t.paymentDetail}
            breadcrumbItems={getBreadcrumbItems()}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={handleGoBack}
                className="p-2"
              />
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isBillTransaction(transaction) 
                    ? 'bg-primary-gold/10' 
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}>
                  {isBillTransaction(transaction) ? (
                    <FileText className={`h-5 w-5 ${
                      isBillTransaction(transaction) 
                        ? 'text-primary-gold' 
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                  ) : (
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isBillTransaction(transaction) ? t.billDetail : t.paymentDetail}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isBillTransaction(transaction) 
                      ? transaction.data.title
                      : `${t.paymentWithMethod} ${(transaction.data as any).paymentMethod}`
                    }
                  </p>
                </div>
              </div>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RefreshCw}
                  onClick={handleRefresh}
                  isLoading={isRefetching}
                  disabled={isRefetching}
                />
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Transaction Header Details */}
                <TransactionDetailHeader transaction={transaction} />
                
                {/* Financial Summary */}
                <FinancialSummaryCard transaction={transaction} />
                
                {/* Related Transactions */}
                <RelatedTransactionsTable transaction={transaction} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Actions */}
                <TransactionActions 
                  transaction={transaction} 
                  onUpdate={refetch}
                />
                
                {/* Additional Info Cards will go here */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}