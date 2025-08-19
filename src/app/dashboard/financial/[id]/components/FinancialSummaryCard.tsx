'use client';

import React, { useState, useEffect } from 'react';
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
import { enumsService } from '@/services/enums.service';

// Dil çevirileri
const translations = {
  tr: {
    // Card header
    financialSummary: 'Finansal Özet',
    billDetailsAndPaymentStatus: 'Fatura detayları ve ödeme durumu',
    paymentDetails: 'Ödeme detayları',
    
    // Amount labels
    billAmount: 'Fatura Tutarı',
    paymentAmount: 'Ödeme Tutarı',
    totalPaid: 'Toplam Ödenen',
    paymentMethod: 'Ödeme Yöntemi',
    
    // Progress labels
    paymentProgress: 'Ödeme İlerlemesi',
    payment: 'ödeme',
    completedProgress: 'tamamlandı',
    paidAmount: 'Ödenen:',
    remaining: 'Kalan:',
    fullyPaid: '✓ Tamamen Ödendi',
    
    // Status labels
    status: 'Durum',
    paid: 'Ödendi',
    completed: 'Tamamlandı',
    pending: 'Bekliyor',
    overdue: 'Gecikmiş',
    daysOverdue: 'gün gecikme',
    inProgress: 'İşlemde',
    
    // Bill information
    billInformation: 'Fatura Bilgileri',
    billType: 'Fatura Türü:',
    creation: 'Oluşturulma:',
    
    // Bill types
    dues: 'Aidat',
    maintenance: 'Bakım',
    utility: 'Fayda',
    penalty: 'Ceza',
    
    // Payment details
    paymentDetailsTitle: 'Ödeme Detayları',
    paymentDate: 'Ödeme Tarihi:',
    recordDate: 'Kayıt Tarihi:'
  },
  en: {
    // Card header
    financialSummary: 'Financial Summary',
    billDetailsAndPaymentStatus: 'Bill details and payment status',
    paymentDetails: 'Payment details',
    
    // Amount labels
    billAmount: 'Bill Amount',
    paymentAmount: 'Payment Amount',
    totalPaid: 'Total Paid',
    paymentMethod: 'Payment Method',
    
    // Progress labels
    paymentProgress: 'Payment Progress',
    payment: 'payment',
    completedProgress: 'completed',
    paidAmount: 'Paid:',
    remaining: 'Remaining:',
    fullyPaid: '✓ Fully Paid',
    
    // Status labels
    status: 'Status',
    paid: 'Paid',
    completed: 'Completed',
    pending: 'Pending',
    overdue: 'Overdue',
    daysOverdue: 'days overdue',
    inProgress: 'In Progress',
    
    // Bill information
    billInformation: 'Bill Information',
    billType: 'Bill Type:',
    creation: 'Created:',
    
    // Bill types
    dues: 'Dues',
    maintenance: 'Maintenance',
    utility: 'Utility',
    penalty: 'Penalty',
    
    // Payment details
    paymentDetailsTitle: 'Payment Details',
    paymentDate: 'Payment Date:',
    recordDate: 'Record Date:'
  },
  ar: {
    // Card header
    financialSummary: 'الملخص المالي',
    billDetailsAndPaymentStatus: 'تفاصيل الفاتورة وحالة الدفع',
    paymentDetails: 'تفاصيل الدفع',
    
    // Amount labels
    billAmount: 'مبلغ الفاتورة',
    paymentAmount: 'مبلغ الدفع',
    totalPaid: 'إجمالي المدفوع',
    paymentMethod: 'طريقة الدفع',
    
    // Progress labels
    paymentProgress: 'تقدم الدفع',
    payment: 'دفعة',
    completedProgress: 'مكتمل',
    paidAmount: 'مدفوع:',
    remaining: 'متبقي:',
    fullyPaid: '✓ مدفوع بالكامل',
    
    // Status labels
    status: 'الحالة',
    paid: 'مدفوع',
    completed: 'مكتمل',
    pending: 'معلق',
    overdue: 'متأخر',
    daysOverdue: 'أيام تأخير',
    inProgress: 'قيد المعالجة',
    
    // Bill information
    billInformation: 'معلومات الفاتورة',
    billType: 'نوع الفاتورة:',
    creation: 'تاريخ الإنشاء:',
    
    // Bill types
    dues: 'الرسوم',
    maintenance: 'الصيانة',
    utility: 'المرافق',
    penalty: 'الغرامة',
    
    // Payment details
    paymentDetailsTitle: 'تفاصيل الدفع',
    paymentDate: 'تاريخ الدفع:',
    recordDate: 'تاريخ التسجيل:'
  }
};

interface FinancialSummaryCardProps {
  transaction: TransactionDetail;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ 
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
      .reduce((sum, p) => sum + Number(p.amount), 0);
    
    const billAmount = Number(transaction.data.amount);
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
    const methodInfo = dynamicPaymentMethodOptions.find(option => option.value === paymentMethod);
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

  // Get bill type label
  const getBillTypeLabel = (billType: string) => {
    switch (billType) {
      case 'DUES':
        return t.dues;
      case 'MAINTENANCE':
        return t.maintenance;
      case 'UTILITY':
        return t.utility;
      case 'PENALTY':
        return t.penalty;
      default:
        return billType;
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return t.paid;
      case 'COMPLETED':
        return t.completed;
      case 'PENDING':
        return t.pending;
      default:
        return status;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.financialSummary}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isBillTransaction(transaction) ? t.billDetailsAndPaymentStatus : t.paymentDetails}
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
                {isBillTransaction(transaction) ? t.billAmount : t.paymentAmount}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(Number(transaction.data.amount))} IQD
            </div>
          </div>

          {/* Payment Progress for Bills */}
          {paymentStats && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.totalPaid}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(paymentStats.totalPaid)} IQD
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                %{paymentStats.paymentProgress.toFixed(1)} {t.completed}
              </div>
            </div>
          )}

          {/* Payment Method for Payments */}
          {isPaymentTransaction(transaction) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.paymentMethod}
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
                {t.paymentProgress}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {paymentStats.completedPayments}/{paymentStats.paymentCount} {t.payment}
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
                {t.paid} {formatCurrency(paymentStats.totalPaid)} IQD
              </span>
              {paymentStats.remainingAmount > 0 ? (
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  {t.remaining} {formatCurrency(paymentStats.remainingAmount)} IQD
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {t.fullyPaid}
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
                {t.status}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusLabel(transaction.data.status)}
              </div>
            </div>
          </div>

          {/* Overdue Warning for Bills */}
          {isOverdue() && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm font-medium text-red-900 dark:text-red-100">
                  {t.overdue}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  {getDaysOverdue()} {t.daysOverdue}
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
                {transaction.data.status === 'COMPLETED' ? t.completed : t.inProgress}
              </Badge>
            </div>
          )}
        </div>

        {/* Additional Financial Details */}
        {isBillTransaction(transaction) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {t.billInformation}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.billType}</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {getBillTypeLabel(transaction.data.billType)}
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.creation}</span>
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
              {t.paymentDetailsTitle}
            </div>
            <div className="space-y-2 text-sm">
              {transaction.data.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t.paymentDate}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(transaction.data.paymentDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t.recordDate}</span>
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