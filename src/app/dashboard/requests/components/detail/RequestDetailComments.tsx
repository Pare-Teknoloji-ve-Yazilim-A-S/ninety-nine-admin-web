import React from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { RequestDetailCommentsProps } from '@/services/types/request-detail.types';

const RequestDetailComments: React.FC<RequestDetailCommentsProps> = ({
  requestId,
  commentsCount
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              Yorumlar & Aktivite
            </h2>
          </div>
          <Badge variant="soft" color="secondary" className="text-sm">
            {commentsCount} Yorum
          </Badge>
        </div>

        {commentsCount > 0 ? (
          <div className="space-y-4">
            {/* Comments would be loaded here */}
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-text-light-muted dark:text-text-muted mb-3" />
              <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                Yorumlar yükleniyor...
              </p>
              <p className="text-sm text-text-light-muted dark:text-text-muted">
                Bu özellik yakında aktif olacak
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-text-light-muted dark:text-text-muted mb-3" />
            <p className="text-text-light-secondary dark:text-text-secondary mb-2">
              Henüz yorum yok
            </p>
            <p className="text-sm text-text-light-muted dark:text-text-muted">
              Bu talep için henüz yorum veya aktivite kaydı bulunmuyor
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestDetailComments;