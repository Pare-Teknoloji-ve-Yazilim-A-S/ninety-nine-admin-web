import React from 'react';
import Card from '@/app/components/ui/Card';
import Skeleton from '@/app/components/ui/Skeleton';
import { TicketSummary } from '../hooks/useTicketSummary';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface RequestsQuickStatsProps {
  summary: TicketSummary | null;
  loading: boolean;
}

export default function RequestsQuickStats({
  summary,
  loading = false
}: RequestsQuickStatsProps) {
  console.log('🔍 RequestsQuickStats render:', { 
    summary, 
    loading,
    summaryType: typeof summary,
    summaryKeys: summary ? Object.keys(summary) : null,
    summaryValues: summary ? Object.values(summary) : null
  });
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-6">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <Skeleton className="h-12 w-16" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-2 w-full mt-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        <Card className="p-6 col-span-full">
          <div className="text-center text-text-light-muted dark:text-text-muted">
            Veri yüklenemedi
          </div>
        </Card>
      </div>
    );
  }

  // Ticket summary kartları
  const stats = [
    {
      label: 'Açık Talepler',
      value: summary.openTickets,
      icon: <Clock className="h-6 w-6" />,
      color: '#3B82F6', // Blue
      bgColor: '#DBEAFE'
    },
    {
      label: 'İşlemde',
      value: summary.inProgressTickets,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: '#F59E0B', // Amber
      bgColor: '#FEF3C7'
    },
    {
      label: 'Bekleyen',
      value: summary.waitingTickets,
      icon: <Calendar className="h-6 w-6" />,
      color: '#8B5CF6', // Purple
      bgColor: '#EDE9FE'
    },
    {
      label: 'Çözülen',
      value: summary.resolvedTickets,
      icon: <CheckCircle className="h-6 w-6" />,
      color: '#10B981', // Green
      bgColor: '#D1FAE5'
    },
    {
      label: 'Geciken',
      value: summary.overdueTickets,
      icon: <AlertCircle className="h-6 w-6" />,
      color: '#DC2626', // Red
      bgColor: '#FEE2E2'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
      {stats.map((stat, index) => {
        return (
          <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
            <div className="space-y-6">
              {/* Header with Icon and Value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <div style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div
                    className="text-4xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div>
                <p className="text-base font-semibold text-text-light-secondary dark:text-text-secondary">
                  {stat.label}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-background-light-secondary dark:bg-background-secondary rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: stat.color,
                    width: `${Math.min((stat.value / summary.totalTickets) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}