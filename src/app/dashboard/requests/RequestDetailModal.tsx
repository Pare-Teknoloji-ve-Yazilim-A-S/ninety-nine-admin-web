import React from 'react';
import Modal from '@/app/components/ui/Modal';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { AlertCircle, RotateCcw, CheckCircle, Calendar, User, Wrench, Flag, Paperclip, MessageCircle } from 'lucide-react';
import type { Ticket } from '@/services/ticket.service';

const statusConfig = {
  OPEN: { label: 'Açık', color: 'info', icon: AlertCircle },
  IN_PROGRESS: { label: 'İşlemde', color: 'warning', icon: RotateCcw },
  COMPLETED: { label: 'Tamamlandı', color: 'success', icon: CheckCircle },
  SCHEDULED: { label: 'Planlandı', color: 'primary', icon: Calendar },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Düşük', color: 'secondary' },
  MEDIUM: { label: 'Orta', color: 'warning' },
  HIGH: { label: 'Yüksek', color: 'red' },
};

interface RequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: Ticket | null;
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ open, onClose, item }) => {
  if (!item) return null;
  const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.OPEN;
  const StatusIcon = statusInfo.icon;
  const priorityInfo = priorityConfig[item.priority?.toUpperCase?.() || ''] || { label: item.priority, color: 'secondary' };

  return (
    <Modal isOpen={open} onClose={onClose} title="Talep Detayı" size="lg" variant="glass" scrollable>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-6 w-6 text-semantic-${statusInfo.color}-500`} />
            <Badge variant="soft" color={statusInfo.color as any}>{statusInfo.label}</Badge>
            <span className="text-xs text-text-light-secondary dark:text-text-secondary ml-2">Talep No: <span className="font-semibold">{item.ticketNumber}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-primary-gold" />
            <Badge variant="soft" color={priorityInfo.color as any}>{priorityInfo.label}</Badge>
            {item.dueDate && (
              <>
                <Calendar className="h-4 w-4 text-primary-gold ml-4" />
                <span className="text-xs text-text-light-secondary dark:text-text-secondary">Son Tarih: <span className="font-semibold">{new Date(item.dueDate).toLocaleDateString('tr-TR')}</span></span>
              </>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2 leading-tight">{item.title}</h3>
          <p className="text-base text-text-light-secondary dark:text-text-secondary mb-2 leading-relaxed whitespace-pre-line">{item.description || 'Açıklama yok.'}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Talep Tipi</div>
            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
              <Wrench className="h-4 w-4" />
              <span>{item.type || 'Tip Yok'}</span>
            </div>
          </div>
          <div>
            <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Sakin</div>
            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
              <User className="h-4 w-4" />
              <span>{item.creator?.firstName || ''} {item.creator?.lastName || ''}</span>
            </div>
            <div className="text-xs text-text-soft">
              {item.creator?.property?.ownershipType || '--'}
            </div>
          </div>
          <div>
            <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Daire</div>
            <div className="text-sm text-text-light-secondary dark:text-text-secondary">
              {item.property?.name || item.property?.propertyNumber || '--'}
            </div>
          </div>
          <div>
            <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Oluşturulma</div>
            <div className="text-sm text-text-light-secondary dark:text-text-secondary">
              {item.createdAt ? new Date(item.createdAt).toLocaleString('tr-TR') : '--'}
            </div>
          </div>
        </div>

        {/* Attachments */}
        {item.attachments && item.attachments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="h-5 w-5 text-primary-gold" />
              <span className="font-semibold text-text-on-light dark:text-text-on-dark">Ekler</span>
            </div>
            <ul className="space-y-2">
              {item.attachments.map((att: any) => (
                <li key={att.id} className="flex items-center gap-3 p-2 bg-background-light-soft dark:bg-background-soft rounded-lg border border-primary-gold/10">
                  <a href={att.url || att.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary-gold hover:underline font-medium flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    {att.fileName || att.name || 'Dosya'}
                  </a>
                  {att.uploadedAt && (
                    <span className="text-xs text-text-light-secondary ml-2">{new Date(att.uploadedAt).toLocaleString('tr-TR')}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comments */}
        {item.comments && item.comments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-primary-gold" />
              <span className="font-semibold text-text-on-light dark:text-text-on-dark">Yorumlar</span>
            </div>
            <ul className="space-y-4">
              {item.comments.map((comment: any) => (
                <li key={comment.id} className="p-3 rounded-xl bg-background-light-soft dark:bg-background-soft border border-primary-gold/10">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-primary-gold" />
                    <span className="font-medium text-text-on-light dark:text-text-on-dark">{comment.author?.name || comment.authorName || 'Kullanıcı'}</span>
                    <span className="text-xs text-text-light-secondary ml-2">{comment.createdAt ? new Date(comment.createdAt).toLocaleString('tr-TR') : ''}</span>
                  </div>
                  <div className="text-sm text-text-light-secondary dark:text-text-secondary whitespace-pre-line">{comment.text || comment.content}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestDetailModal; 