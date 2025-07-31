'use client';

import React, { useState } from 'react';
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

export default function TransactionDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const { transaction, loading, error, refetch, isRefetching } = useTransactionDetail(transactionId);

  // Generate breadcrumbs
  const getBreadcrumbItems = () => {
    const baseItems = [
      { label: 'Ana Sayfa', href: '/dashboard' },
      { label: 'Finansal İşlemler', href: '/dashboard/financial' }
    ];

    if (transaction) {
      const typeLabel = isBillTransaction(transaction) ? 'Fatura' : 'Ödeme';
      return [
        ...baseItems,
        { label: `${typeLabel} Detayı`, active: true }
      ];
    }

    return [
      ...baseItems,
      { label: 'İşlem Detayı', active: true }
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
              title="İşlem Detayı Yükleniyor..."
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
              title="İşlem Detayı"
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
                    İşlem Bulunamadı
                  </h1>
                </div>
              </div>

              <Card className="p-8">
                <EmptyState
                  icon={<AlertCircle className="h-8 w-8" />}
                  title="İşlem Detayları Yüklenemedi"
                  description={error}
                  action={
                    <div className="flex gap-3">
                      <Button 
                        variant="secondary" 
                        icon={ArrowLeft}
                        onClick={handleGoBack}
                      >
                        Geri Dön
                      </Button>
                      <Button 
                        variant="primary" 
                        icon={RefreshCw}
                        onClick={handleRefresh}
                        isLoading={isRefetching}
                      >
                        Tekrar Dene
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
              title="İşlem Detayı"
              breadcrumbItems={getBreadcrumbItems()}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="p-8">
                <EmptyState
                  icon={<FileText className="h-8 w-8" />}
                  title="İşlem Bulunamadı"
                  description="Aradığınız finansal işlem bulunamadı veya silinmiş olabilir."
                  action={
                    <Button 
                      variant="primary" 
                      icon={ArrowLeft}
                      onClick={handleGoBack}
                    >
                      Finansal İşlemlere Dön
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
            title={isBillTransaction(transaction) ? 'Fatura Detayı' : 'Ödeme Detayı'}
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
                    {isBillTransaction(transaction) ? 'Fatura Detayı' : 'Ödeme Detayı'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isBillTransaction(transaction) 
                      ? transaction.data.title
                      : `${(transaction.data as any).paymentMethod} ile ödeme`
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