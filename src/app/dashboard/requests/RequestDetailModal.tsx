import React from 'react';
import Modal from '@/app/components/ui/Modal';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { AlertCircle, RotateCcw, CheckCircle, Calendar, User, Wrench, Flag, Paperclip, MessageCircle, PauseCircle } from 'lucide-react';
import type { Ticket } from '@/services/ticket.service';
import { ticketService } from '@/services/ticket.service';
import { useState } from 'react';

const statusConfig = {
  OPEN: { label: 'Açık', color: 'info', icon: AlertCircle },
  IN_PROGRESS: { label: 'İşlemde', color: 'success', icon: RotateCcw },
  WAITING: { label: 'Beklemede', color: 'warning', icon: PauseCircle },
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
  onActionComplete?: () => void;
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ open, onClose, item, onActionComplete }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Ticket | null>(item);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  // Fetch comments when modal opens or item changes
  React.useEffect(() => {
    setCurrentItem(item);
    if (item && item.id) {
      setCommentsLoading(true);
      ticketService.getComments(item.id)
        .then(setComments)
        .finally(() => setCommentsLoading(false));
    } else {
      setComments([]);
    }
  }, [item]);

  if (!currentItem) return null;
  const statusInfo = statusConfig[currentItem.status as keyof typeof statusConfig] || statusConfig.OPEN;
  const StatusIcon = statusInfo.icon;
  const priorityInfo = priorityConfig[currentItem.priority?.toUpperCase?.() || ''] || { label: currentItem.priority, color: 'secondary' };

  // Action handlers
  const handleStatusChange = async (action: string) => {
    if (!currentItem) return;
    setLoadingAction(action);
    try {
      let updated: Ticket | null = null;
      if (action === 'start-progress') {
        updated = await ticketService.startProgress(currentItem.id);
      } else if (action === 'mark-waiting') {
        updated = await ticketService.markWaiting(currentItem.id);
      } else if (action === 'resolve') {
        updated = await ticketService.resolve(currentItem.id);
      } else if (action === 'close') {
        updated = await ticketService.close(currentItem.id);
      } else if (action === 'cancel') {
        updated = await ticketService.cancel(currentItem.id);
      }
      if (updated) {
        if (onActionComplete) {
          onActionComplete();
        }
        // else setCurrentItem(updated); // fallback, but not needed if modal closes
      }
    } catch (e) {
      // TODO: Show error toast
    } finally {
      setLoadingAction(null);
    }
  };

  // Button visibility logic
  const status = currentItem.status;
  const actionButtons = [
    status === 'OPEN' && {
      label: 'İşleme Al',
      action: 'start-progress',
      variant: 'primary',
    },
    status === 'IN_PROGRESS' && {
      label: 'Beklemeye Al',
      action: 'mark-waiting',
      variant: 'secondary',
    },
    (status === 'IN_PROGRESS' || status === 'OPEN') && {
      label: 'Tamamlandı',
      action: 'resolve',
      variant: 'success',
    },
    (status === 'IN_PROGRESS' || status === 'OPEN') && {
      label: 'Kapat',
      action: 'close',
      variant: 'warning',
    },
    (status !== 'COMPLETED' && status !== 'CLOSED' && status !== 'CANCELLED') && {
      label: 'İptal Et',
      action: 'cancel',
      variant: 'danger',
    },
  ].filter(Boolean);

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim() || !currentItem) return;
    setPostingComment(true);
    try {
      await ticketService.addComment(currentItem.id, newComment.trim());
      setNewComment('');
      // Refresh comments
      setCommentsLoading(true);
      const updated = await ticketService.getComments(currentItem.id);
      setComments(updated);
      setCommentsLoading(false);
    } catch (e) {
      // TODO: Show error toast
      setCommentsLoading(false);
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Talep Detayı" size="lg" variant="glass" scrollable>
      <div className="flex flex-col h-[70vh]">
        {/* Scrollable Content (Info + Comments) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-6 w-6 text-semantic-${statusInfo.color}-500`} />
              <Badge variant="soft" color={statusInfo.color as any}>{statusInfo.label}</Badge>
              <span className="text-xs text-text-light-secondary dark:text-text-secondary ml-2">Talep No: <span className="font-semibold">{currentItem.ticketNumber}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-primary-gold" />
              <Badge variant="soft" color={priorityInfo.color as any}>{priorityInfo.label}</Badge>
              {currentItem.dueDate && (
                <>
                  <Calendar className="h-4 w-4 text-primary-gold ml-4" />
                  <span className="text-xs text-text-light-secondary dark:text-text-secondary">Son Tarih: <span className="font-semibold">{new Date(currentItem.dueDate).toLocaleDateString('tr-TR')}</span></span>
                </>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2 leading-tight">{currentItem.title}</h3>
            <p className="text-base text-text-light-secondary dark:text-text-secondary mb-2 leading-relaxed whitespace-pre-line">{currentItem.description || 'Açıklama yok.'}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Talep Tipi</div>
              <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                <Wrench className="h-4 w-4" />
                <span>{currentItem.type || 'Tip Yok'}</span>
              </div>
            </div>
            <div>
              <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Sakin</div>
              <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                <User className="h-4 w-4" />
                <span>{currentItem.creator?.firstName || ''} {currentItem.creator?.lastName || ''}</span>
              </div>
              <div className="text-xs text-text-soft">
                {currentItem.creator?.property?.ownershipType || '--'}
              </div>
            </div>
            <div>
              <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Daire</div>
              <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                {currentItem.property?.name || currentItem.property?.propertyNumber || '--'}
              </div>
            </div>
            <div>
              <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">Oluşturulma</div>
              <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                {currentItem.createdAt ? new Date(currentItem.createdAt).toLocaleString('tr-TR') : '--'}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {currentItem.attachments && currentItem.attachments.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="h-5 w-5 text-primary-gold" />
                <span className="font-semibold text-text-on-light dark:text-text-on-dark">Ekler</span>
              </div>
              <ul className="space-y-2">
                {currentItem.attachments.map((att: any) => (
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
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-primary-gold" />
              <span className="font-semibold text-text-on-light dark:text-text-on-dark">Yorumlar</span>
            </div>
            {commentsLoading ? (
              <div className="text-sm text-text-light-secondary">Yorumlar yükleniyor...</div>
            ) : comments.length === 0 ? (
              <div className="text-sm text-text-light-secondary">Henüz yorum yok.</div>
            ) : (
              <div className="max-h-64 overflow-y-auto pr-1">
                <ul className="space-y-4">
                  {comments.map((comment: any) => (
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
          </div>
        </div>
        {/* Add comment input - always visible above footer */}
        <div className="flex items-center gap-2 mt-4 px-2 mb-4">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light-soft dark:bg-background-soft px-3 py-2 text-sm text-on-dark placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-primary-gold/30"
            placeholder="Yorum ekle..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={postingComment}
            onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddComment}
            isLoading={postingComment}
            disabled={postingComment || !newComment.trim()}
          >
            Gönder
          </Button>
        </div>
        {/* Modal Actions (Footer) */}
        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 bg-background-light-card dark:bg-background-card">
          {actionButtons.map((btn: any) => (
            <Button
              key={btn.action}
              variant={btn.variant}
              onClick={() => handleStatusChange(btn.action)}
              isLoading={loadingAction === btn.action}
              disabled={!!loadingAction}
            >
              {btn.label}
            </Button>
          ))}

        </div>
      </div>
    </Modal>
  );
};

export default RequestDetailModal; 