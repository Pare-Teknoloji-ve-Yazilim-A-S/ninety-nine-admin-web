import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/ui/Modal';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Tabs from '@/app/components/ui/Tabs';
import EmptyState from '@/app/components/ui/EmptyState';
import { AlertCircle, RotateCcw, CheckCircle, Calendar, User, Wrench, Flag, Paperclip, MessageCircle, PauseCircle, Image, File, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Ticket } from '@/services/ticket.service';
import { ticketService } from '@/services/ticket.service';
import { useMemo } from 'react';
import { handleModalAction } from '@/lib/handleModalAction';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

// Update Ticket permission constants
const UPDATE_TICKET_PERMISSION_ID = 'i8j9k0l1-2m3n-4o5p-6q7r-8s9t0u1v2w3x';
const UPDATE_TICKET_PERMISSION_NAME = 'Update Ticket';

// Cancel Ticket permission constants
const CANCEL_TICKET_PERMISSION_ID = 'k0l1m2n3-4o5p-6q7r-8s9t-0u1v2w3x4y5z';
const CANCEL_TICKET_PERMISSION_NAME = 'Cancel Ticket';

// Dil çevirileri
const translations = {
  tr: {
    // Modal title
    modalTitle: 'Talep Detayı',
    
    // Tab labels
    detail: 'Detay',
    visual: 'Görsel',
    
    // Status labels
    open: 'Açık',
    inProgress: 'İşlemde',
    waiting: 'Beklemede',
    completed: 'Tamamlandı',
    scheduled: 'Planlandı',
    
    // Priority labels
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    
    // Action button labels
    startProgress: 'İşleme Al',
    markWaiting: 'Beklemeye Al',
    complete: 'Tamamlandı',
    closeButton: 'Kapat',
    cancel: 'İptal Et',
    
    // Toast labels
    request: 'Talep',
    approval: 'Onay',
    reject: 'Reddet',
    
    // Header labels
    requestNumber: 'Talep No:',
    dueDate: 'Son Tarih:',
    noDescription: 'Açıklama yok.',
    
    // Info grid labels
    requestType: 'Talep Tipi',
    resident: 'Sakin',
    apartment: 'Daire',
    createdAt: 'Oluşturulma',
    noType: 'Tip Yok',
    noData: '--',
    
    // Comments section
    comments: 'Yorumlar',
    loadingComments: 'Yorumlar yükleniyor...',
    noComments: 'Henüz yorum yok.',
    user: 'Kullanıcı',
    addComment: 'Yorum ekle...',
    send: 'Gönder',
    
    // Attachments section
    attachments: 'Ekler',
    loading: 'Yükleniyor...',
    noAttachments: 'Görsel ek bulunamadı',
    noAttachmentsDesc: 'Bu talebe ait herhangi bir ek dosya yüklenmemiş.',
    file: 'Dosya',
    image: 'Resim',
    close: 'Kapat',
    previous: 'Önceki',
    next: 'Sonraki'
  },
  en: {
    // Modal title
    modalTitle: 'Request Detail',
    
    // Tab labels
    detail: 'Detail',
    visual: 'Visual',
    
    // Status labels
    open: 'Open',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    completed: 'Completed',
    scheduled: 'Scheduled',
    
    // Priority labels
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    // Action button labels
    startProgress: 'Start Progress',
    markWaiting: 'Mark Waiting',
    complete: 'Complete',
    closeButton: 'Close',
    cancel: 'Cancel',
    
    // Toast labels
    request: 'Request',
    approval: 'Approval',
    reject: 'Reject',
    
    // Header labels
    requestNumber: 'Request No:',
    dueDate: 'Due Date:',
    noDescription: 'No description.',
    
    // Info grid labels
    requestType: 'Request Type',
    resident: 'Resident',
    apartment: 'Apartment',
    createdAt: 'Created At',
    noType: 'No Type',
    noData: '--',
    
    // Comments section
    comments: 'Comments',
    loadingComments: 'Loading comments...',
    noComments: 'No comments yet.',
    user: 'User',
    addComment: 'Add comment...',
    send: 'Send',
    
    // Attachments section
    attachments: 'Attachments',
    loading: 'Loading...',
    noAttachments: 'No visual attachments found',
    noAttachmentsDesc: 'No attachment files have been uploaded for this request.',
    file: 'File',
    image: 'Image',
    close: 'Close',
    previous: 'Previous',
    next: 'Next'
  },
  ar: {
    // Modal title
    modalTitle: 'تفاصيل الطلب',
    
    // Tab labels
    detail: 'التفاصيل',
    visual: 'البصري',
    
    // Status labels
    open: 'مفتوح',
    inProgress: 'قيد التنفيذ',
    waiting: 'في الانتظار',
    completed: 'مكتمل',
    scheduled: 'مجدول',
    
    // Priority labels
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    
    // Action button labels
    startProgress: 'بدء التقدم',
    markWaiting: 'وضع في الانتظار',
    complete: 'إكمال',
    closeButton: 'إغلاق',
    cancel: 'إلغاء',
    
    // Toast labels
    request: 'طلب',
    approval: 'موافقة',
    reject: 'رفض',
    
    // Header labels
    requestNumber: 'رقم الطلب:',
    dueDate: 'تاريخ الاستحقاق:',
    noDescription: 'لا يوجد وصف.',
    
    // Info grid labels
    requestType: 'نوع الطلب',
    resident: 'المقيم',
    apartment: 'الشقة',
    createdAt: 'تاريخ الإنشاء',
    noType: 'لا يوجد نوع',
    noData: '--',
    
    // Comments section
    comments: 'التعليقات',
    loadingComments: 'جاري تحميل التعليقات...',
    noComments: 'لا توجد تعليقات بعد.',
    user: 'المستخدم',
    addComment: 'أضف تعليق...',
    send: 'إرسال',
    
    // Attachments section
    attachments: 'المرفقات',
    loading: 'جاري التحميل...',
    noAttachments: 'لم يتم العثور على مرفقات بصرية',
    noAttachmentsDesc: 'لم يتم رفع أي ملفات مرفقة لهذا الطلب.',
    file: 'ملف',
    image: 'صورة',
    close: 'إغلاق',
    previous: 'السابق',
    next: 'التالي'
  }
};

const statusConfig = {
  OPEN: { label: 'open', color: 'info', icon: AlertCircle },
  IN_PROGRESS: { label: 'inProgress', color: 'success', icon: RotateCcw },
  WAITING: { label: 'waiting', color: 'warning', icon: PauseCircle },
  COMPLETED: { label: 'completed', color: 'success', icon: CheckCircle },
  SCHEDULED: { label: 'scheduled', color: 'primary', icon: Calendar },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'low', color: 'secondary' },
  MEDIUM: { label: 'medium', color: 'warning' },
  HIGH: { label: 'high', color: 'red' },
};

interface RequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: Ticket | null;
  onActionComplete?: () => void;
  toast?: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
  };
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ open, onClose, item, onActionComplete, toast }) => {
  // Permission checks
  const { hasPermission } = usePermissionCheck();
  const hasUpdateTicketPermission = hasPermission(UPDATE_TICKET_PERMISSION_NAME);
  const hasCancelTicketPermission = hasPermission(CANCEL_TICKET_PERMISSION_NAME);

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

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Ticket | null>(item);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'detay' | 'gorsel'>('detay');
  const [attachments, setAttachments] = useState<any[] | null>(null);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const imageAttachments = useMemo(() => {
    return (attachments || []).filter((a: any) => (a.fileType?.startsWith('image/') || a.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)));
  }, [attachments]);

  // Reset tab and lightbox on open/item change
  React.useEffect(() => {
    if (open) {
      setActiveTab('detay');
      setSelectedImageIndex(null);
    }
  }, [open, item]);

  // Fetch comments when modal opens or item changes
  React.useEffect(() => {
    setCurrentItem(item);
    // Reset attachments when item changes to force reload on Görsel tab
    setAttachments(null);
    if (item && item.id) {
      setCommentsLoading(true);
      ticketService.getComments(item.id)
        .then(setComments)
        .finally(() => setCommentsLoading(false));
    } else {
      setComments([]);
    }
  }, [item]);

  // Fetch attachments when switching to Görsel tab
  React.useEffect(() => {
    const ticketId = currentItem?.id;
    const shouldLoad = activeTab === 'gorsel' && ticketId && attachments === null && !attachmentsLoading;
    if (shouldLoad) {
      setAttachmentsLoading(true);
      ticketService.getAttachments(ticketId)
        .then((atts) => setAttachments(atts || []))
        .finally(() => setAttachmentsLoading(false));
    }
  }, [activeTab, currentItem, attachments, attachmentsLoading]);

  if (!currentItem) return null;
  // Normalize status (supports string or object with id)
  const statusKey = ((): string => {
    const raw = typeof (currentItem as any).status === 'string'
      ? (currentItem as any).status
      : (currentItem as any).status?.id;
    return (raw || 'OPEN').toString().toUpperCase();
  })();
  const statusInfo = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.OPEN;
  const StatusIcon = statusInfo.icon;
  // Normalize priority (supports string or object with id/label)
  const priorityKey = ((): string => {
    const raw = typeof (currentItem as any).priority === 'string'
      ? (currentItem as any).priority
      : (currentItem as any).priority?.id;
    return (raw || 'MEDIUM').toString().toUpperCase();
  })();
  const priorityLabel = ((): string => {
    if (typeof (currentItem as any).priority === 'object' && (currentItem as any).priority?.label) {
      return String((currentItem as any).priority.label);
    }
    // Fallback to capitalized key
    return priorityKey.charAt(0) + priorityKey.slice(1).toLowerCase();
  })();
  const priorityInfo = priorityConfig[priorityKey] || { label: priorityLabel, color: 'secondary' };

  // Action handlers
  const handleStatusChange = async (action: string, label: string) => {
    if (!currentItem) return;
    setLoadingAction(action);
    const actionMap: Record<string, () => Promise<Ticket | null>> = {
      'start-progress': () => ticketService.startProgress(currentItem.id),
      'mark-waiting': () => ticketService.markWaiting(currentItem.id),
      'resolve': () => ticketService.resolve(currentItem.id),
      'close': () => ticketService.close(currentItem.id),
      'cancel': () => ticketService.cancel(currentItem.id),
      'reopen': () => ticketService.reopen(currentItem.id),
    };
    const apiAction = actionMap[action];
    if (!apiAction) return;
    await handleModalAction({
      action: apiAction,
      onClose,
      onActionComplete,
      toast: toast!,
      label,
      setLoading: (loading) => setLoadingAction(loading ? action : null),
    });
  };

  // Button visibility logic
  const status = statusKey;
  
  // All possible status transitions - show buttons for all statuses except current one
  const allStatusActions = [
    {
      status: 'IN_PROGRESS', 
      label: t.startProgress,
      action: 'start-progress',
      toastLabel: t.request,
      variant: 'primary',
      permission: hasUpdateTicketPermission
    },
    {
      status: 'WAITING',
      label: t.markWaiting,
      action: 'mark-waiting', 
      toastLabel: t.request,
      variant: 'secondary',
      permission: hasUpdateTicketPermission
    },
    {
      status: 'COMPLETED',
      label: t.complete,
      action: 'resolve',
      toastLabel: t.approval,
      variant: 'success',
      permission: hasUpdateTicketPermission
    },
    {
      status: 'CLOSED',
      label: t.closeButton,
      action: 'close',
      toastLabel: t.request,
      variant: 'warning',
      permission: hasUpdateTicketPermission
    },
    {
      status: 'CANCELLED',
      label: t.cancel,
      action: 'cancel',
      toastLabel: t.reject,
      variant: 'danger',
      permission: hasCancelTicketPermission
    }
  ];
  
  // Filter out current status and check permissions
  const actionButtons = allStatusActions
    .filter(action => action.status !== status && action.permission)
    .map(action => ({
      label: action.label,
      action: action.action,
      toastLabel: action.toastLabel,
      variant: action.variant
    }));



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
    <Modal isOpen={open} onClose={onClose} title={t.modalTitle} size="lg" variant="glass" scrollable>
      <div className="flex flex-col h-[70vh]">
        <div className="px-1">
          <Tabs
            items={[
              { id: 'detay', label: t.detail },
              { id: 'gorsel', label: t.visual },
            ]}
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'detay' | 'gorsel')}
            variant="soft-pills"
            size="sm"
          />
        </div>

        {/* Scrollable Content (Tab Content) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-8">
          {activeTab === 'detay' && (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-6 w-6 text-semantic-${statusInfo.color}-500`} />
                  <Badge variant="soft" color={statusInfo.color as any}>{t[statusInfo.label as keyof typeof t]}</Badge>
                  <span className="text-xs text-text-light-secondary dark:text-text-secondary ml-2">{t.requestNumber} <span className="font-semibold">{(currentItem as any).ticketNumber || (currentItem as any).requestId || (currentItem as any).id}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary-gold" />
                  <Badge variant="soft" color={priorityInfo.color as any}>{t[priorityInfo.label as keyof typeof t]}</Badge>
                  {currentItem.dueDate && (
                    <>
                      <Calendar className="h-4 w-4 text-primary-gold ml-4" />
                      <span className="text-xs text-text-light-secondary dark:text-text-secondary">{t.dueDate} <span className="font-semibold">{new Date(currentItem.dueDate).toLocaleDateString('tr-TR')}</span></span>
                    </>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2 leading-tight">{currentItem.title}</h3>
                <p className="text-base text-text-light-secondary dark:text-text-secondary mb-2 leading-relaxed whitespace-pre-line">{currentItem.description || t.noDescription}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">{t.requestType}</div>
                  <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                    <Wrench className="h-4 w-4" />
                    <span>{(currentItem as any).type || (currentItem as any).category?.label || (currentItem as any).category || t.noType}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">{t.resident}</div>
                  <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                    <User className="h-4 w-4" />
                    <span>{((currentItem as any).creator?.firstName && (currentItem as any).creator?.lastName)
                      ? `${(currentItem as any).creator.firstName} ${(currentItem as any).creator.lastName}`
                      : (currentItem as any).apartment?.owner || t.noData}</span>
                  </div>
                  <div className="text-xs text-text-soft">
                    {(currentItem as any).creator?.property?.ownershipType || t.noData}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">{t.apartment}</div>
                  <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {(currentItem as any).property?.name 
                      || (currentItem as any).property?.propertyNumber 
                      || (currentItem as any).apartment?.number 
                      || t.noData}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-text-on-light dark:text-text-on-dark mb-1">{t.createdAt}</div>
                  <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {(currentItem as any).createdAt
                      ? new Date((currentItem as any).createdAt).toLocaleString('tr-TR')
                      : (currentItem as any).createdDate
                        ? new Date((currentItem as any).createdDate).toLocaleString('tr-TR')
                        : t.noData}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-primary-gold" />
                  <span className="font-semibold text-text-on-light dark:text-text-on-dark">{t.comments}</span>
                </div>
                {commentsLoading ? (
                  <div className="text-sm text-text-light-secondary">{t.loadingComments}</div>
                ) : comments.length === 0 ? (
                  <div className="text-sm text-text-light-secondary">{t.noComments}</div>
                ) : (
                  <div className="max-h-64 overflow-y-auto pr-1">
                    <ul className="space-y-4">
                      {comments.map((comment: any) => (
                        <li key={comment.id} className="p-3 rounded-xl bg-background-light-soft dark:bg-background-soft border border-primary-gold/10">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-primary-gold" />
                            <span className="font-medium text-text-on-light dark:text-text-on-dark">
                              {(comment.user?.firstName || comment.user?.lastName)
                                ? `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim()
                                : (comment.author?.name || comment.authorName || t.user)}
                            </span>
                            <span className="text-xs text-text-light-secondary ml-2">{comment.createdAt ? new Date(comment.createdAt).toLocaleString('tr-TR') : ''}</span>
                          </div>
                          <div className="text-sm text-text-light-secondary dark:text-text-secondary whitespace-pre-line">{comment.text || comment.content}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Görsel Tab İçeriği */}
          {activeTab === 'gorsel' && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="h-5 w-5 text-primary-gold" />
                <span className="font-semibold text-text-on-light dark:text-text-on-dark">{t.attachments}</span>
              </div>
              {attachmentsLoading ? (
                <div className="text-sm text-text-light-secondary">{t.loading}</div>
              ) : (attachments && attachments.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attachments.map((att: any) => {
                    const isImage = att.fileType?.startsWith('image/') || att.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    const fileUrl = att.staticUrl || att.url || att.fileUrl;
                    const displayUrl = fileUrl; // Tercihen API'den staticUrl gelir
                    
                    return (
                      <div key={att.id || att.fileUrl || att.url} className="bg-background-light-soft dark:bg-background-soft rounded-lg border border-primary-gold/10 overflow-hidden">
                        {isImage ? (
                          <div
                            className="relative group cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              const key = (x: any) => x?.staticUrl || x?.fileUrl || x?.url;
                              const idx = imageAttachments.findIndex((x: any) => (x.id && x.id === att.id) || key(x) === key(att));
                              setSelectedImageIndex(idx >= 0 ? idx : 0);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                const key = (x: any) => x?.staticUrl || x?.fileUrl || x?.url;
                                const idx = imageAttachments.findIndex((x: any) => (x.id && x.id === att.id) || key(x) === key(att));
                                setSelectedImageIndex(idx >= 0 ? idx : 0);
                              }
                            }}
                          >
                            <img 
                              src={displayUrl} 
                              alt={att.fileName || t.image} 
                              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800">
                            <File className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {isImage ? <Image className="h-4 w-4 text-primary-gold" /> : <File className="h-4 w-4 text-gray-500" />}
                              <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark truncate">
                                {att.fileName || att.name || t.file}
                              </span>
                            </div>
                            <a 
                              href={displayUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              <Download className="h-4 w-4 text-primary-gold" />
                            </a>
                          </div>
                          {att.fileSize && (
                            <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                              {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                            </div>
                          )}
                          {att.uploadedAt && (
                            <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                              {new Date(att.uploadedAt).toLocaleString('tr-TR')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon="file"
                  title={t.noAttachments}
                  description={t.noAttachmentsDesc}
                  size="md"
                  className="bg-transparent"
                />
              )}
            </div>
          )}

          
        </div>
        {/* Add comment input */}
        {activeTab === 'detay' && (
          <div className="flex items-center gap-2 mt-4 px-2 mb-4">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light-soft dark:bg-background-soft px-3 py-2 text-sm text-on-dark placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-primary-gold/30"
              placeholder={t.addComment}
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
              {t.send}
            </Button>
          </div>
        )}
        {/* Modal Actions (Footer) */}
        {activeTab === 'detay' && (
          <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 bg-background-light-card dark:bg-background-card">
            {actionButtons.map((btn: any) => (
              <Button
                key={btn.action}
                variant={btn.variant}
                onClick={() => handleStatusChange(btn.action, btn.toastLabel)}
                isLoading={loadingAction === btn.action}
                disabled={!!loadingAction}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Image Lightbox with Navigation */}
      {selectedImageIndex !== null && imageAttachments.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label={t.close}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev Button */}
          {imageAttachments.length > 1 && (
          <button
            onClick={() => {
              const count = imageAttachments.length;
              if (count === 0) return;
              setSelectedImageIndex((prev) => {
                const current = typeof prev === 'number' ? prev : 0;
                return (current - 1 + count) % count;
              });
            }}
            className="absolute left-4 md:left-8 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label={t.previous}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>)}

          {/* Image */}
          {(() => {
            const current = imageAttachments[selectedImageIndex ?? 0];
            const url = current?.staticUrl || current?.url || current?.fileUrl;
            return (
              <img
                src={url}
                alt={current?.fileName || t.image}
                className="w-auto h-auto max-h-[88vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
              />
            );
          })()}

          {/* Next Button */}
          {imageAttachments.length > 1 && (
          <button
            onClick={() => {
              const count = imageAttachments.length;
              if (count === 0) return;
              setSelectedImageIndex((prev) => {
                const current = typeof prev === 'number' ? prev : 0;
                return (current + 1) % count;
              });
            }}
            className="absolute right-4 md:right-8 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label={t.next}
          >
            <ChevronRight className="w-8 h-8" />
          </button>)}
        </div>
      )}
    </Modal>
  );
};

export default RequestDetailModal;