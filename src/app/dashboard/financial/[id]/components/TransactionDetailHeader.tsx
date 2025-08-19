'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { 
  Calendar,
  Hash,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  Building,
  User
} from 'lucide-react';
import { TransactionDetail, isBillTransaction, isPaymentTransaction } from '../hooks/useTransactionDetail';
import { BILL_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS } from '@/services/types/billing.types';
import Avatar from '@/app/components/ui/Avatar';

// Dil çevirileri
const translations = {
  tr: {
    // Labels
    transactionId: 'İşlem ID',
    billAmount: 'Fatura Tutarı',
    paymentAmount: 'Ödeme Tutarı',
    creationDate: 'Oluşturulma Tarihi',
    dueDate: 'Vade Tarihi',
    paymentDate: 'Ödeme Tarihi',
    documentNumber: 'Belge Numarası',
    property: 'Mülk',
    receiptNumber: 'Makbuz Numarası',
    description: 'Açıklama',
    notes: 'Notlar',
    paymentWithMethod: 'Ödemesi',
    
    // Status labels
    paid: 'Ödendi',
    pending: 'Bekliyor',
    overdue: 'Gecikmiş',
    completed: 'Tamamlandı',
    failed: 'Başarısız',
    cancelled: 'İptal',
    
    // Property fallback
    propertyId: 'Mülk ID:'
  },
  en: {
    // Labels
    transactionId: 'Transaction ID',
    billAmount: 'Bill Amount',
    paymentAmount: 'Payment Amount',
    creationDate: 'Creation Date',
    dueDate: 'Due Date',
    paymentDate: 'Payment Date',
    documentNumber: 'Document Number',
    property: 'Property',
    receiptNumber: 'Receipt Number',
    description: 'Description',
    notes: 'Notes',
    paymentWithMethod: 'Payment',
    
    // Status labels
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    
    // Property fallback
    propertyId: 'Property ID:'
  },
  ar: {
    // Labels
    transactionId: 'معرف المعاملة',
    billAmount: 'مبلغ الفاتورة',
    paymentAmount: 'مبلغ الدفع',
    creationDate: 'تاريخ الإنشاء',
    dueDate: 'تاريخ الاستحقاق',
    paymentDate: 'تاريخ الدفع',
    documentNumber: 'رقم المستند',
    property: 'العقار',
    receiptNumber: 'رقم الإيصال',
    description: 'الوصف',
    notes: 'ملاحظات',
    paymentWithMethod: 'دفع',
    
    // Status labels
    paid: 'مدفوع',
    pending: 'معلق',
    overdue: 'متأخر',
    completed: 'مكتمل',
    failed: 'فشل',
    cancelled: 'ملغي',
    
    // Property fallback
    propertyId: 'معرف العقار:'
  }
};

interface TransactionDetailHeaderProps {
  transaction: TransactionDetail;
}

const TransactionDetailHeader: React.FC<TransactionDetailHeaderProps> = ({ 
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

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
      case 'failed':
        return 'danger';
      case 'cancelled':
      case 'canceled':
        return 'default';
      default:
        return 'info';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
      case 'failed':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return t.paid;
      case 'pending':
        return t.pending;
      case 'overdue':
        return t.overdue;
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR').format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get bill type info
  const getBillTypeInfo = (billType: string) => {
    const typeInfo = BILL_TYPE_OPTIONS.find(option => option.value === billType);
    return typeInfo || { icon: '📄', label: billType, description: '' };
  };

  // Get payment method info
  const getPaymentMethodInfo = (paymentMethod: string) => {
    const methodInfo = PAYMENT_METHOD_OPTIONS.find(option => option.value === paymentMethod);
    return methodInfo || { icon: '💳', label: paymentMethod, description: '' };
  };

  const StatusIcon = getStatusIcon(transaction.data.status);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Transaction Type and Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.transactionId}
                </span>
              </div>
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {transaction.id}
              </span>
            </div>
            
            {isBillTransaction(transaction) && (
              <div className="flex items-center gap-3">
                {getBillTypeInfo(transaction.data.billType).icon}
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {transaction.data.title}
                </span>
              </div>
            )}
            
            {isPaymentTransaction(transaction) && (
              <div className="flex items-center gap-3">
                {getPaymentMethodInfo(transaction.data.paymentMethod).icon}
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPaymentMethodInfo(transaction.data.paymentMethod).label} {t.paymentWithMethod}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Badge 
              variant={getStatusVariant(transaction.data.status)}
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {getStatusLabel(transaction.data.status)}
            </Badge>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(Number(transaction.data.amount))} IQD
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isBillTransaction(transaction) ? t.billAmount : t.paymentAmount}
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Creation Date */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {t.creationDate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(transaction.data.createdAt)}
                </div>
              </div>
            </div>

            {/* Due Date for Bills */}
            {isBillTransaction(transaction) && (
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.dueDate}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.data.dueDate)}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Date for Payments */}
            {isPaymentTransaction(transaction) && transaction.data.paymentDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.paymentDate}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.data.paymentDate)}
                  </div>
                </div>
              </div>
            )}

            {/* Document Number */}
            {isBillTransaction(transaction) && transaction.data.documentNumber && (
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.documentNumber}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.data.documentNumber}
                  </div>
                </div>
              </div>
            )}

            {/* Transaction ID for Payments */}
            {isPaymentTransaction(transaction) && transaction.data.transactionId && (
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.transactionId}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.data.transactionId}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Property Info */}
            {isBillTransaction(transaction) && transaction.data.property && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.property}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.data.property.name || `${t.propertyId} ${transaction.data.property.id}`}
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Number for Payments */}
            {isPaymentTransaction(transaction) && transaction.data.receiptNumber && (
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.receiptNumber}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.data.receiptNumber}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {transaction.data.description && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.description}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              {transaction.data.description}
            </div>
          </div>
        )}

        {/* Notes for Payments */}
        {isPaymentTransaction(transaction) && transaction.data.notes && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.notes}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              {transaction.data.notes}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TransactionDetailHeader;