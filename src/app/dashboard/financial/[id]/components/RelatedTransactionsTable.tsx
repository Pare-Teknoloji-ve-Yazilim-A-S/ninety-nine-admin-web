'use client';

import React, { useState, useEffect } from 'react';
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
import { enumsService } from '@/services/enums.service';

// Dil çevirileri
const translations = {
  tr: {
    // Bill payments section
    paymentsForThisBill: 'Bu Faturaya Yapılan Ödemeler',
    paymentRecordsFound: 'ödeme kaydı bulundu',
    noPaymentsYet: 'Henüz Ödeme Yapılmamış',
    noPaymentsYetDesc: 'Bu faturaya henüz hiç ödeme kaydedilmemiş.',
    
    // Related bill section
    relatedBill: 'İlgili Fatura',
    relatedBillDesc: 'Bu ödemenin yapıldığı fatura bilgileri',
    relatedBillNotFound: 'İlgili Fatura Bulunamadı',
    relatedBillNotFoundDesc: 'Bu ödemeye ait fatura bilgisi bulunamadı.',
    
    // Table headers
    paymentId: 'Ödeme ID',
    method: 'Yöntem',
    amount: 'Tutar',
    date: 'Tarih',
    status: 'Durum',
    actions: 'İşlemler',
    
    // Bill info labels
    billId: 'Fatura ID:',
    billAmount: 'Fatura Tutarı',
    dueDate: 'Vade Tarihi',
    description: 'Açıklama',
    
    // Buttons
    detail: 'Detay',
    viewBill: 'Faturayı Görüntüle',
    
    // Status labels
    paid: 'Ödendi',
    pending: 'Bekliyor',
    completed: 'Tamamlandı',
    failed: 'Başarısız',
    cancelled: 'İptal'
  },
  en: {
    // Bill payments section
    paymentsForThisBill: 'Payments for This Bill',
    paymentRecordsFound: 'payment records found',
    noPaymentsYet: 'No Payments Yet',
    noPaymentsYetDesc: 'No payments have been recorded for this bill yet.',
    
    // Related bill section
    relatedBill: 'Related Bill',
    relatedBillDesc: 'Bill information for this payment',
    relatedBillNotFound: 'Related Bill Not Found',
    relatedBillNotFoundDesc: 'Bill information for this payment could not be found.',
    
    // Table headers
    paymentId: 'Payment ID',
    method: 'Method',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    actions: 'Actions',
    
    // Bill info labels
    billId: 'Bill ID:',
    billAmount: 'Bill Amount',
    dueDate: 'Due Date',
    description: 'Description',
    
    // Buttons
    detail: 'Detail',
    viewBill: 'View Bill',
    
    // Status labels
    paid: 'Paid',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled'
  },
  ar: {
    // Bill payments section
    paymentsForThisBill: 'المدفوعات لهذه الفاتورة',
    paymentRecordsFound: 'سجل دفع موجود',
    noPaymentsYet: 'لا توجد مدفوعات بعد',
    noPaymentsYetDesc: 'لم يتم تسجيل أي مدفوعات لهذه الفاتورة بعد.',
    
    // Related bill section
    relatedBill: 'الفاتورة المرتبطة',
    relatedBillDesc: 'معلومات الفاتورة لهذا الدفع',
    relatedBillNotFound: 'الفاتورة المرتبطة غير موجودة',
    relatedBillNotFoundDesc: 'لا يمكن العثور على معلومات الفاتورة لهذا الدفع.',
    
    // Table headers
    paymentId: 'معرف الدفع',
    method: 'الطريقة',
    amount: 'المبلغ',
    date: 'التاريخ',
    status: 'الحالة',
    actions: 'الإجراءات',
    
    // Bill info labels
    billId: 'معرف الفاتورة:',
    billAmount: 'مبلغ الفاتورة',
    dueDate: 'تاريخ الاستحقاق',
    description: 'الوصف',
    
    // Buttons
    detail: 'التفاصيل',
    viewBill: 'عرض الفاتورة',
    
    // Status labels
    paid: 'مدفوع',
    pending: 'معلق',
    completed: 'مكتمل',
    failed: 'فشل',
    cancelled: 'ملغي'
  }
};

interface RelatedTransactionsTableProps {
  transaction: TransactionDetail;
}

const RelatedTransactionsTable: React.FC<RelatedTransactionsTableProps> = ({ 
  transaction 
}) => {
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

  const appEnums = (typeof window !== 'undefined') ? enumsService.getFromCache() : null;
  const dynamicPaymentMethodOptions = (appEnums?.data?.payment?.paymentMethod as string[] | undefined)
    ? (appEnums!.data!.payment!.paymentMethod as string[]).map((code) => {
        const fallback = PAYMENT_METHOD_OPTIONS.find(o => String(o.value) === code);
        return {
          value: fallback?.value ?? code,
          label: fallback?.label ?? code,
          icon: fallback?.icon ?? '💳',
        };
      })
    : PAYMENT_METHOD_OPTIONS;
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
        return t.paid;
      case 'pending':
        return t.pending;
      case 'completed':
        return t.completed;
      case 'failed':
        return t.failed;
      case 'cancelled':
      case 'canceled':
        return t.cancelled;
      default:
        return status;
    }
  };

  // Get payment method info
  const getPaymentMethodInfo = (paymentMethod: string) => {
    const methodInfo = dynamicPaymentMethodOptions.find(option => option.value === paymentMethod);
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
                {t.paymentsForThisBill}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {payments.length} {t.paymentRecordsFound}
              </p>
            </div>
          </div>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-8 w-8" />}
            title={t.noPaymentsYet}
            description={t.noPaymentsYetDesc}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {t.paymentId}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {t.method}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {t.amount}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {t.date}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {t.status}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {t.actions}
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
                        {t.detail}
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
                {t.relatedBill}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.relatedBillDesc}
              </p>
            </div>
          </div>
        </div>

        {!bill ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title={t.relatedBillNotFound}
            description={t.relatedBillNotFoundDesc}
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
                      {t.billId} {bill.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t.billAmount}
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
                        {t.dueDate}
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
                        {t.status}
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
                      {t.description}
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
                  {t.viewBill}
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