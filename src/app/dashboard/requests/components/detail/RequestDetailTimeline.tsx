import React from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle, Target } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { RequestDetailTimelineProps } from '@/services/types/request-detail.types';

const RequestDetailTimeline: React.FC<RequestDetailTimelineProps> = ({ request }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Az önce';
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays === 1) {
      return 'Dün';
    } else {
      return `${diffDays} gün önce`;
    }
  };

  // Check if date is overdue
  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Timeline events
  const timelineEvents = [
    {
      id: 'created',
      title: 'Talep Oluşturuldu',
      date: request.createdDate,
      icon: Calendar,
      status: 'completed',
      description: 'Talep sisteme kaydedildi'
    },
    {
      id: 'updated',
      title: 'Son Güncelleme',
      date: request.updatedDate,
      icon: Clock,
      status: 'completed',
      description: 'Talep bilgileri güncellendi'
    }
  ];

  // Add estimated completion if exists
  if (request.estimatedCompletion) {
    timelineEvents.push({
      id: 'estimated',
      title: 'Tahmini Bitiş',
      date: request.estimatedCompletion,
      icon: Target,
      status: isOverdue(request.estimatedCompletion) ? 'overdue' : 'pending',
      description: 'Tahmini tamamlanma tarihi'
    });
  }

  // Add completion date if exists
  if (request.completedDate) {
    timelineEvents.push({
      id: 'completed',
      title: 'Tamamlandı',
      date: request.completedDate,
      icon: CheckCircle,
      status: 'completed',
      description: 'Talep başarıyla tamamlandı'
    });
  }

  // Add due date
  timelineEvents.push({
    id: 'due',
    title: 'Vade Tarihi',
    date: request.dueDate,
    icon: AlertCircle,
    status: request.isOverdue ? 'overdue' : 'pending',
    description: 'Talebin tamamlanması gereken tarih'
  });

  // Sort events by date
  const sortedEvents = timelineEvents.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
          <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Zaman Çizelgesi
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const IconComponent = event.icon;
            const isLast = index === sortedEvents.length - 1;
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-background-light-secondary dark:bg-background-secondary" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${event.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      event.status === 'overdue' ? 'bg-red-100 text-red-600' : 
                      'bg-blue-100 text-blue-600'}
                  `}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-medium text-text-on-light dark:text-text-on-dark">
                        {event.title}
                      </h3>
                      {event.status === 'overdue' && (
                        <Badge variant="solid" color="red" className="text-xs">
                          Gecikmiş
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-2">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-text-light-muted dark:text-text-muted">
                      <span>{formatDate(event.date)}</span>
                      <span className="hidden sm:block">•</span>
                      <span>{formatRelativeTime(event.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-text-light-muted dark:text-text-muted mb-1">
                Yanıt Süresi
              </p>
              <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                {request.responseTime || '--'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-light-muted dark:text-text-muted mb-1">
                Tamamlanma Süresi
              </p>
              <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                {request.completionTime || '--'}
              </p>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap gap-2">
          {request.isOverdue && (
            <Badge variant="soft" color="red" className="text-xs">
              🚨 Gecikmiş
            </Badge>
          )}
          {request.isUrgent && (
            <Badge variant="soft" color="red" className="text-xs">
              ⚡ Acil
            </Badge>
          )}
          {request.completedDate && (
            <Badge variant="soft" color="success" className="text-xs">
              ✅ Tamamlandı
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RequestDetailTimeline;