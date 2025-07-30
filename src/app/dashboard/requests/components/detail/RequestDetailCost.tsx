import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { RequestDetailCostProps } from '@/services/types/request-detail.types';

const RequestDetailCost: React.FC<RequestDetailCostProps> = ({
  cost,
  canViewCosts = true
}) => {
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency === 'IQD' ? 'USD' : currency, // Fallback for IQD
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', cost.currency === 'IQD' ? 'IQD ' : '$');
  };

  // Calculate difference between estimated and actual
  const getDifference = () => {
    if (!cost.actual || !cost.estimated) return null;
    
    const diff = cost.actual - cost.estimated;
    const percentage = ((diff / cost.estimated) * 100).toFixed(1);
    
    return {
      amount: Math.abs(diff),
      percentage: Math.abs(parseFloat(percentage)),
      isOverBudget: diff > 0,
      isUnderBudget: diff < 0,
      isOnBudget: diff === 0
    };
  };

  const difference = getDifference();

  // No permission to view costs
  if (!canViewCosts) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              Maliyet Bilgileri
            </h2>
          </div>

          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-text-light-muted dark:text-text-muted mb-3" />
            <p className="text-text-light-secondary dark:text-text-secondary mb-2">
              Maliyet bilgilerini görüntüleme yetkiniz yok
            </p>
            <p className="text-sm text-text-light-muted dark:text-text-muted">
              Bu bilgileri görmek için yönetici ile iletişime geçin
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
          <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Maliyet Bilgileri
          </h2>
        </div>

        {/* Cost breakdown */}
        <div className="space-y-4">
          {/* Estimated Cost */}
          <div className="flex items-center justify-between p-4 bg-background-light-soft dark:bg-background-soft rounded-lg">
            <div>
              <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Tahmini Maliyet
              </p>
              <p className="text-sm text-text-light-muted dark:text-text-muted">
                Başlangıç tahmini
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                {cost.estimated > 0 ? formatCurrency(cost.estimated, cost.currency) : '--'}
              </p>
            </div>
          </div>

          {/* Actual Cost */}
          <div className="flex items-center justify-between p-4 bg-background-light-soft dark:bg-background-soft rounded-lg">
            <div>
              <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Gerçek Maliyet
              </p>
              <p className="text-sm text-text-light-muted dark:text-text-muted">
                {cost.actual ? 'Final maliyet' : 'Henüz belirlenmedi'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                {cost.actual ? formatCurrency(cost.actual, cost.currency) : '--'}
              </p>
              {!cost.actual && (
                <Badge variant="soft" color="warning" className="text-xs mt-1">
                  Bekleniyor
                </Badge>
              )}
            </div>
          </div>

          {/* Difference Analysis */}
          {difference && (
            <div className={`
              p-4 rounded-lg border
              ${difference.isOverBudget 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                : difference.isUnderBudget 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {difference.isOverBudget ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : difference.isUnderBudget ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  )}
                  <span className={`
                    text-sm font-medium
                    ${difference.isOverBudget 
                      ? 'text-red-800 dark:text-red-200' 
                      : difference.isUnderBudget 
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-blue-800 dark:text-blue-200'
                    }
                  `}>
                    {difference.isOverBudget 
                      ? 'Bütçe Aşımı' 
                      : difference.isUnderBudget 
                      ? 'Bütçe Altında'
                      : 'Bütçe Uygunluğu'
                    }
                  </span>
                </div>
                <div className="text-right">
                  <p className={`
                    text-sm font-semibold
                    ${difference.isOverBudget 
                      ? 'text-red-600 dark:text-red-400' 
                      : difference.isUnderBudget 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-blue-600 dark:text-blue-400'
                    }
                  `}>
                    {difference.isOverBudget ? '+' : difference.isUnderBudget ? '-' : ''}
                    {formatCurrency(difference.amount, cost.currency)}
                  </p>
                  <p className={`
                    text-xs
                    ${difference.isOverBudget 
                      ? 'text-red-500 dark:text-red-400' 
                      : difference.isUnderBudget 
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-blue-500 dark:text-blue-400'
                    }
                  `}>
                    %{difference.percentage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No cost info */}
          {cost.estimated === 0 && !cost.actual && (
            <div className="text-center py-6">
              <DollarSign className="mx-auto h-12 w-12 text-text-light-muted dark:text-text-muted mb-3" />
              <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                Maliyet bilgisi henüz girilmemiş
              </p>
              <p className="text-sm text-text-light-muted dark:text-text-muted">
                Talep ilerledikçe maliyet bilgileri güncellenecek
              </p>
            </div>
          )}
        </div>

        {/* Currency info */}
        <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <p className="text-xs text-text-light-muted dark:text-text-muted">
            Para birimi: {cost.currency} • Tüm fiyatlar KDV dahildir
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RequestDetailCost;