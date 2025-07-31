'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calculator,
  CreditCard,
  Clock,
  CheckCircle
} from 'lucide-react';
import { TransactionDetail, isBillTransaction, isPaymentTransaction } from '../hooks/useTransactionDetail';
import { PAYMENT_METHOD_OPTIONS } from '@/services/types/billing.types';

interface FinancialSummaryCardProps {
  transaction: TransactionDetail;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ 
  transaction 
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR').format(amount);
  };

  // Calculate payment statistics for bills
  const getPaymentStats = () => {
    if (!isBillTransaction(transaction) || !Array.isArray(transaction.relatedTransactions)) {
      return null;
    }

    const payments = transaction.relatedTransactions;
    const totalPaid = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const billAmount = transaction.data.amount;
    const remainingAmount = billAmount - totalPaid;
    const paymentProgress = billAmount > 0 ? (totalPaid / billAmount) * 100 : 0;

    return {
      totalPaid,
      remainingAmount,
      paymentProgress,
      paymentCount: payments.length,
      completedPayments: payments.filter(p => p.status === 'COMPLETED').length
    };
  };

  const paymentStats = getPaymentStats();

  // Get payment method info
  const getPaymentMethodInfo = (paymentMethod: string) => {
    const methodInfo = PAYMENT_METHOD_OPTIONS.find(option => option.value === paymentMethod);
    return methodInfo || { icon: '💳', label: paymentMethod, description: '' };
  };

  // Check if bill is overdue
  const isOverdue = () => {
    if (!isBillTransaction(transaction)) return false;
    const dueDate = new Date(transaction.data.dueDate);
    const now = new Date();
    return dueDate < now && transaction.data.status !== 'PAID';
  };

  // Calculate days overdue
  const getDaysOverdue = () => {
    if (!isOverdue()) return 0;
    const dueDate = new Date((transaction.data as any).dueDate);
    const now = new Date();
    const diffTime = now.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Finansal Özet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isBillTransaction(transaction) ? 'Fatura detayları ve ödeme durumu' : 'Ödeme detayları'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isBillTransaction(transaction) ? 'Fatura Tutarı' : 'Ödeme Tutarı'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(transaction.data.amount)} IQD
            </div>
          </div>

          {/* Payment Progress for Bills */}
          {paymentStats && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Toplam Ödenen
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(paymentStats.totalPaid)} IQD
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                %{paymentStats.paymentProgress.toFixed(1)} tamamlandı
              </div>
            </div>
          )}

          {/* Payment Method for Payments */}
          {isPaymentTransaction(transaction) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ödeme Yöntemi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getPaymentMethodInfo(transaction.data.paymentMethod).icon}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getPaymentMethodInfo(transaction.data.paymentMethod).label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Progress Bar for Bills */}
        {paymentStats && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ödeme İlerlemesi
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {paymentStats.completedPayments}/{paymentStats.paymentCount} ödeme
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(paymentStats.paymentProgress, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">
                Ödenen: {formatCurrency(paymentStats.totalPaid)} IQD
              </span>
              {paymentStats.remainingAmount > 0 ? (
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Kalan: {formatCurrency(paymentStats.remainingAmount)} IQD
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ✓ Tamamen Ödendi
                </span>
              )}
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {transaction.data.status === 'PAID' || transaction.data.status === 'COMPLETED' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Durum
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {transaction.data.status === 'PAID' ? 'Ödendi' : 
                 transaction.data.status === 'COMPLETED' ? 'Tamamlandı' :
                 transaction.data.status === 'PENDING' ? 'Bekliyor' : 
                 transaction.data.status}
              </div>
            </div>
          </div>

          {/* Overdue Warning for Bills */}
          {isOverdue() && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm font-medium text-red-900 dark:text-red-100">
                  Gecikmiş
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  {getDaysOverdue()} gün gecikme
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary for Payments */}
          {isPaymentTransaction(transaction) && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Badge 
                variant={transaction.data.status === 'COMPLETED' ? 'success' : 'warning'}
                className="flex items-center gap-1"
              >
                {transaction.data.status === 'COMPLETED' ? 'Tamamlandı' : 'İşlemde'}
              </Badge>
            </div>
          )}
        </div>

        {/* Additional Financial Details */}
        {isBillTransaction(transaction) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Fatura Bilgileri
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Fatura Türü:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {transaction.data.billType === 'DUES' ? 'Aidat' :
                   transaction.data.billType === 'MAINTENANCE' ? 'Bakım' :
                   transaction.data.billType === 'UTILITY' ? 'Fayda' :
                   transaction.data.billType === 'PENALTY' ? 'Ceza' :
                   transaction.data.billType}
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Oluşturulma:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(transaction.data.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details for Payments */}
        {isPaymentTransaction(transaction) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Ödeme Detayları
            </div>
            <div className="space-y-2 text-sm">
              {transaction.data.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Ödeme Tarihi:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(transaction.data.paymentDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Kayıt Tarihi:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(transaction.data.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FinancialSummaryCard;