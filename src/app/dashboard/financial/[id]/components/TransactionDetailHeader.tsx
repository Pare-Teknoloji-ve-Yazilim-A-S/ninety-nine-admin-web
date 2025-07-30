'use client';

import React from 'react';
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

interface TransactionDetailHeaderProps {
  transaction: TransactionDetail;
}

const TransactionDetailHeader: React.FC<TransactionDetailHeaderProps> = ({ 
  transaction 
}) => {
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
        return 'secondary';
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
        return 'Ödendi';
      case 'pending':
        return 'Bekliyor';
      case 'overdue':
        return 'Gecikmiş';
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
                  İşlem ID
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
                  {getPaymentMethodInfo(transaction.data.paymentMethod).label} Ödemesi
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
              {formatCurrency(transaction.data.amount)} IQD
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isBillTransaction(transaction) ? 'Fatura Tutarı' : 'Ödeme Tutarı'}
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
                  Oluşturulma Tarihi
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
                    Vade Tarihi
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
                    Ödeme Tarihi
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
                    Belge Numarası
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
                    İşlem ID
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
            {isBillTransaction(transaction) && transaction.data.propertyId && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Mülk
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {/* Property info would come from API - showing ID for now */}
                    Mülk ID: {transaction.data.propertyId}
                  </div>
                </div>
              </div>
            )}

            {/* Assigned To */}
            {isBillTransaction(transaction) && transaction.data.assignedToId && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Atanan Kişi
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {/* User info would come from API - showing ID for now */}
                    Kullanıcı ID: {transaction.data.assignedToId}
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
                    Makbuz Numarası
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
              Açıklama
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
              Notlar
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