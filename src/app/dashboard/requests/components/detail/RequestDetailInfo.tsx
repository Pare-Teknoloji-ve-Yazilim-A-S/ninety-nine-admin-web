import React from 'react';
import { FileText, AlertCircle, Tag } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { RequestDetailInfoProps } from '@/services/types/request-detail.types';

const RequestDetailInfo: React.FC<RequestDetailInfoProps> = ({ request }) => {
  // Get priority badge color
  const getPriorityBadgeColor = (level: number) => {
    switch (level) {
      case 4: return 'red'; // Emergency/Urgent
      case 3: return 'gold'; // High
      case 2: return 'warning'; // Medium
      case 1: return 'success'; // Low
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Description Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              Açıklama
            </h2>
          </div>
          <p className="text-text-light-secondary dark:text-text-secondary whitespace-pre-wrap leading-relaxed">
            {request.description || 'Açıklama bulunmuyor.'}
          </p>
        </div>

        {/* Priority & Category Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
              <span className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Öncelik
              </span>
            </div>
            <Badge 
              variant="soft" 
              color={getPriorityBadgeColor(request.priority.level)}
              className="text-sm"
            >
              <span className="mr-1">{request.priority.icon}</span>
              {request.priority.label}
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
              <span className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Kategori
              </span>
            </div>
            <Badge 
              variant="soft" 
              color="secondary"
              className="text-sm"
            >
              <span className="mr-1">{request.category.icon}</span>
              {request.category.label}
            </Badge>
          </div>
        </div>

        {/* Tags Section */}
        {request.tags && request.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
              <span className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Etiketler
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {request.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  color="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <div className="text-center">
            <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              {request.imagesCount}
            </p>
            <p className="text-xs text-text-light-muted dark:text-text-muted">
              Fotoğraf
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              {request.commentsCount}
            </p>
            <p className="text-xs text-text-light-muted dark:text-text-muted">
              Yorum
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              {request.responseTime || '--'}
            </p>
            <p className="text-xs text-text-light-muted dark:text-text-muted">
              Yanıt Süresi
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              {request.completionTime || '--'}
            </p>
            <p className="text-xs text-text-light-muted dark:text-text-muted">
              Tamamlanma Süresi
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestDetailInfo;