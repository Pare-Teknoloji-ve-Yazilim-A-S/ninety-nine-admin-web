import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { FinancialSummary } from '@/services/types/unit-detail.types';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  History
} from 'lucide-react';

interface FinancialSummaryProps {
  financialSummary: FinancialSummary;
  loading?: boolean;
  onViewDetails?: () => void;
  onAddPayment?: () => void;
}

export default function FinancialSummarySection({ 
  financialSummary, 
  loading = false,
  onViewDetails,
  onAddPayment
}: FinancialSummaryProps) {
  const formatCurrency = (amount: number, currency: string = 'IQD') => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '0 ' + currency;
    }
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    return (isNegative ? '-' : '') + new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(absAmount) + ' ' + currency;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBalanceStatus = (balance: number, status?: string) => {
    // Null/undefined kontrolü ekle
    if (balance === null || balance === undefined || isNaN(balance)) {
      return { color: 'secondary' as const, icon: CheckCircle, label: 'Bilinmiyor' };
    }
    
    if (status === 'debt' || balance < 0) {
      return { color: 'red' as const, icon: AlertTriangle, label: 'Borç' };
    } else if (balance > 0) {
      return { color: 'primary' as const, icon: CheckCircle, label: 'Kredi' };
    } else {
      return { color: 'secondary' as const, icon: CheckCircle, label: 'Sıfır' };
    }
  };

  const currentBalance = financialSummary.data.currentBalance;
  const balanceStatus = getBalanceStatus(currentBalance.value, currentBalance.status);

  const getDueStatus = () => {
    if (!financialSummary.data.nextDueDate?.value) return null;
    
    const dueDate = new Date(financialSummary.data.nextDueDate.value);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'red' as const, label: `${Math.abs(diffDays)} gün gecikmiş`, urgent: true };
    } else if (diffDays <= 5) {
      return { color: 'gold' as const, label: `${diffDays} gün kaldı`, urgent: true };
    } else if (diffDays <= 15) {
      return { color: 'gold' as const, label: `${diffDays} gün kaldı`, urgent: false };
    } else {
      return { color: 'primary' as const, label: `${diffDays} gün kaldı`, urgent: false };
    }
  };

  const dueStatus = getDueStatus();

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary-gold" />
            </div>
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              {financialSummary.title}
            </h3>
          </div>
          <div className="flex gap-2">
            {onViewDetails && (
              <Button 
                variant="ghost" 
                size="sm" 
                icon={History}
                onClick={onViewDetails}
              >
                Geçmiş
              </Button>
            )}
            {onAddPayment && (
              <Button 
                variant="primary" 
                size="sm" 
                icon={CreditCard}
                onClick={onAddPayment}
              >
                Ödeme Ekle
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Balance - Main Display */}
          <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-6 border border-primary-gold/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <balanceStatus.icon className={`h-6 w-6 ${
                  balanceStatus.color === 'red' ? 'text-primary-red' :
                  balanceStatus.color === 'primary' ? 'text-primary-gold' :
                  'text-text-light-muted dark:text-text-muted'
                }`} />
                <div>
                  <p className="text-sm text-text-light-muted dark:text-text-muted">
                    {currentBalance.label}
                  </p>
                  <p className={`text-2xl font-bold ${
                    balanceStatus.color === 'red' ? 'text-primary-red' :
                    balanceStatus.color === 'primary' ? 'text-primary-gold' :
                    'text-text-on-light dark:text-text-on-dark'
                  }`}>
                    {formatCurrency(currentBalance.value, currentBalance.currency)}
                  </p>
                </div>
              </div>
              <Badge 
                variant="soft" 
                color={balanceStatus.color}
                className="text-sm"
              >
                {balanceStatus.label}
              </Badge>
            </div>

            {/* Next Due Date */}
            {financialSummary.data.nextDueDate && dueStatus && (
              <div className="flex items-center justify-between pt-4 border-t border-background-light-secondary dark:border-background-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                  <span className="text-sm text-text-light-muted dark:text-text-muted">
                    Sonraki Vade: {formatDate(financialSummary.data.nextDueDate.value)}
                  </span>
                </div>
                <Badge 
                  variant={dueStatus.urgent ? "solid" : "soft"} 
                  color={dueStatus.color}
                  className="text-xs"
                >
                  {dueStatus.label}
                </Badge>
              </div>
            )}
          </div>

          {/* Financial Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Last Payment */}
            {financialSummary.data.lastPaymentDate && financialSummary.data.lastPaymentAmount && (
              <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 border border-primary-gold/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-primary-gold" />
                  <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                    Son Ödeme
                  </p>
                </div>
                <p className="text-lg font-semibold text-primary-gold mb-1">
                  {formatCurrency(
                    financialSummary.data.lastPaymentAmount.value, 
                    financialSummary.data.lastPaymentAmount.currency
                  )}
                </p>
                <p className="text-xs text-text-light-muted dark:text-text-muted">
                  {formatDateTime(financialSummary.data.lastPaymentDate.value)}
                </p>
              </div>
            )}

            {/* Overdue Amount */}
            {financialSummary.data.overdueAmount && financialSummary.data.overdueAmount.value > 0 && (
              <div className="bg-primary-red/5 rounded-lg p-4 border border-primary-red/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-primary-red" />
                  <p className="text-sm font-medium text-primary-red">
                    Gecikmiş Tutar
                  </p>
                </div>
                <p className="text-lg font-semibold text-primary-red mb-1">
                  {formatCurrency(
                    financialSummary.data.overdueAmount.value, 
                    financialSummary.data.overdueAmount.currency
                  )}
                </p>
                <p className="text-xs text-primary-red/70">
                  Ödeme gerekli
                </p>
              </div>
            )}
          </div>

          {/* Payment Status Summary */}
          {(currentBalance.value < 0 || (financialSummary.data.overdueAmount && financialSummary.data.overdueAmount.value > 0)) && (
            <div className="bg-primary-red/5 border border-primary-red/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary-red mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-primary-red mb-1">
                    Ödeme Gerekli
                  </h4>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    Bu konut için ödenmemiş tutarlar bulunuyor. 
                    {dueStatus?.urgent && ' Ödeme süresi yaklaşıyor veya geçmiş.'}
                  </p>
                  {onAddPayment && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-3"
                      onClick={onAddPayment}
                    >
                      Hemen Öde
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentBalance.value >= 0 && (!financialSummary.data.overdueAmount || financialSummary.data.overdueAmount.value === 0) && (
            <div className="bg-semantic-success/10 border border-semantic-success/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-semantic-success-600" />
                <div>
                  <h4 className="text-sm font-medium text-semantic-success-600 mb-1">
                    Ödemeler Güncel
                  </h4>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    Bu konut için tüm ödemeler güncel durumda.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}