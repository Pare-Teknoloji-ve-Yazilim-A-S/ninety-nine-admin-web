'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import EmptyState from '@/app/components/ui/EmptyState';
import { 
  ArrowUpRight,
  CreditCard,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  Receipt
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TransactionDetail, isBillTransaction, isPaymentTransaction } from '../hooks/useTransactionDetail';
import { PAYMENT_METHOD_OPTIONS } from '@/services/types/billing.types';

interface RelatedTransactionsTableProps {
  transaction: TransactionDetail;
}

const RelatedTransactionsTable: React.FC<RelatedTransactionsTableProps> = ({ 
  transaction 
}) => {
  const router = useRouter();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR').format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'cancelled':
      case 'canceled':
        return 'default';
      default:
        return 'info';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'Ödendi';
      case 'pending':
        return 'Bekliyor';
      case 'completed':
        return 'Tamamlandı';
      case 'failed':
        return 'Başarısız';
      case 'cancelled':
      case 'canceled':
        return 'İptal';
      default:
        return status;
    }
  };

  // Get payment method info
  const getPaymentMethodInfo = (paymentMethod: string) => {
    const methodInfo = PAYMENT_METHOD_OPTIONS.find(option => option.value === paymentMethod);
    return methodInfo || { icon: '💳', label: paymentMethod, description: '' };
  };

  // Handle view transaction
  const handleViewTransaction = (transactionId: string) => {
    router.push(`/dashboard/financial/${transactionId}`);
  };

  // Render for Bill (showing related payments)
  if (isBillTransaction(transaction)) {
    const payments = Array.isArray(transaction.relatedTransactions) ? transaction.relatedTransactions : [];

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bu Faturaya Yapılan Ödemeler
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {payments.length} ödeme kaydı bulundu
              </p>
            </div>
          </div>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-8 w-8" />}
            title="Henüz Ödeme Yapılmamış"
            description="Bu faturaya henüz hiç ödeme kaydedilmemiş."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Ödeme ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Yöntem
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Durum
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr 
                    key={payment.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                        {payment.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {getPaymentMethodInfo(payment.paymentMethod).icon}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {getPaymentMethodInfo(payment.paymentMethod).label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount)} IQD
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.paymentDate || payment.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusVariant(payment.status)}>
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleViewTransaction(payment.id)}
                      >
                        Detay
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    );
  }

  // Render for Payment (showing related bill)
  if (isPaymentTransaction(transaction)) {
    const bill = transaction.relatedTransactions as any;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-gold/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                İlgili Fatura
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bu ödemenin yapıldığı fatura bilgileri
              </p>
            </div>
          </div>
        </div>

        {!bill ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="İlgili Fatura Bulunamadı"
            description="Bu ödemeye ait fatura bilgisi bulunamadı."
          />
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary-gold" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {bill.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Fatura ID: {bill.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Fatura Tutarı
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(bill.amount)} IQD
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Vade Tarihi
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {new Date(bill.dueDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Durum
                      </div>
                      <Badge variant={getStatusVariant(bill.status)}>
                        {getStatusLabel(bill.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {bill.description && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Açıklama
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {bill.description}
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpRight}
                  onClick={() => handleViewTransaction(bill.id)}
                >
                  Faturayı Görüntüle
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return null;
};

export default RelatedTransactionsTable;