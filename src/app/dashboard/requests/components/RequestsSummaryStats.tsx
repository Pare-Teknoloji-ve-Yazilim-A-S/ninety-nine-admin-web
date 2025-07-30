import React from 'react';
import Card from '@/app/components/ui/Card';
import Skeleton from '@/app/components/ui/Skeleton';
import { RequestsSummaryStatsProps } from '@/services/types/request-list.types';
import { 
  Clock, 
  Calendar, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Activity
} from 'lucide-react';

export default function RequestsSummaryStats({
  summary,
  loading = false
}: RequestsSummaryStatsProps) {
  if (loading) {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Ortalama Yanıt Süresi',
      value: summary.averageResponseTime,
      icon: Clock,
      color: 'text-semantic-info-600',
      bgColor: 'bg-semantic-info/10',
      description: 'İlk yanıt süresi'
    },
    {
      label: 'Ortalama Tamamlanma',
      value: summary.averageCompletionTime,
      icon: Calendar,
      color: 'text-semantic-warning-600',
      bgColor: 'bg-semantic-warning/10',
      description: 'Çözüm süresi'
    },
    {
      label: 'Memnuniyet Oranı',
      value: `${summary.satisfactionRate}/5.0`,
      icon: Star,
      color: 'text-primary-gold',
      bgColor: 'bg-primary-gold/10',
      description: 'Müşteri değerlendirmesi'
    },
    {
      label: 'Başarı Oranı',
      value: summary.totalRequests > 0 
        ? `%${Math.round(((summary.totalRequests - summary.overdueRequests) / summary.totalRequests) * 100)}`
        : '%0',
      icon: TrendingUp,
      color: 'text-semantic-success-600',
      bgColor: 'bg-semantic-success/10',
      description: 'Zamanında tamamlanan'
    }
  ];

  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary-gold/10 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-gold" />
          </div>
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Performans Özeti
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-light-muted dark:text-text-muted">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Summary Info */}
        <div className="mt-6 pt-6 border-t border-background-light-secondary dark:border-background-secondary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-semantic-success/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-semantic-success-600" />
              <div>
                <p className="text-sm font-medium text-semantic-success-700 dark:text-semantic-success-400">
                  Bugün Tamamlanan
                </p>
                <p className="text-lg font-bold text-semantic-success-600">
                  {summary.completedToday}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-semantic-info/5 rounded-lg">
              <Activity className="h-5 w-5 text-semantic-info-600" />
              <div>
                <p className="text-sm font-medium text-semantic-info-700 dark:text-semantic-info-400">
                  Aktif Talepler
                </p>
                <p className="text-lg font-bold text-semantic-info-600">
                  {summary.activeRequests}
                </p>
              </div>
            </div>

            {summary.overdueRequests > 0 && (
              <div className="flex items-center gap-3 p-3 bg-primary-red/5 rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary-red" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Gecikmiş Talepler
                  </p>
                  <p className="text-lg font-bold text-primary-red">
                    {summary.overdueRequests}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}