import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import Modal from '@/app/components/ui/Modal';
import { RequestsBulkActionsBarProps } from '@/services/types/request-list.types';
import { 
  X, 
  UserCheck, 
  RefreshCw, 
  Download, 
  CheckCircle, 
  Trash2,
  AlertCircle,
  Settings
} from 'lucide-react';

// Dil çevirileri
const translations = {
  tr: {
    // Selection info
    requestsSelected: 'talep seçildi',
    clearSelection: 'Seçimi Temizle',
    
    // Modal titles
    bulkAction: 'Toplu İşlem',
    
    // Assign technician modal
    assignTechnicianFor: 'Seçilen {count} talep için teknisyen atayın:',
    selectTechnician: 'Teknisyen seçin...',
    
    // Change priority modal
    changePriorityFor: 'Seçilen {count} talep için öncelik seviyesi seçin:',
    selectPriority: 'Öncelik seçin...',
    emergency: '🚨 Acil',
    high: '🔴 Yüksek',
    medium: '🟡 Orta',
    low: '🟢 Düşük',
    
    // Mark completed modal
    markAsCompleted: 'Talepleri Tamamlandı Olarak İşaretle',
    markCompletedDescription: 'Seçilen {count} talep tamamlandı olarak işaretlenecektir. Bu işlem geri alınamaz.',
    
    // Delete modal
    deleteRequests: 'Talepleri Sil',
    deleteDescription: 'Seçilen {count} talep kalıcı olarak silinecektir. Bu işlem geri alınamaz.',
    confirmDelete: 'Bu işlemi onaylamak için aşağıya "SİL" yazın:',
    deletePlaceholder: 'SİL yazın...',
    
    // Default modal
    confirmAction: '{action} işlemini {count} talep için gerçekleştirmek istediğinizden emin misiniz?',
    
    // Buttons
    cancel: 'İptal',
    confirm: 'Onayla',
    delete: 'Sil'
  },
  en: {
    // Selection info
    requestsSelected: 'requests selected',
    clearSelection: 'Clear Selection',
    
    // Modal titles
    bulkAction: 'Bulk Action',
    
    // Assign technician modal
    assignTechnicianFor: 'Assign technician for {count} selected requests:',
    selectTechnician: 'Select technician...',
    
    // Change priority modal
    changePriorityFor: 'Select priority level for {count} selected requests:',
    selectPriority: 'Select priority...',
    emergency: '🚨 Emergency',
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
    
    // Mark completed modal
    markAsCompleted: 'Mark Requests as Completed',
    markCompletedDescription: '{count} selected requests will be marked as completed. This action cannot be undone.',
    
    // Delete modal
    deleteRequests: 'Delete Requests',
    deleteDescription: '{count} selected requests will be permanently deleted. This action cannot be undone.',
    confirmDelete: 'To confirm this action, type "DELETE" below:',
    deletePlaceholder: 'Type DELETE...',
    
    // Default modal
    confirmAction: 'Are you sure you want to perform {action} action for {count} requests?',
    
    // Buttons
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete'
  },
  ar: {
    // Selection info
    requestsSelected: 'طلب محدد',
    clearSelection: 'مسح التحديد',
    
    // Modal titles
    bulkAction: 'إجراء جماعي',
    
    // Assign technician modal
    assignTechnicianFor: 'تعيين فني لـ {count} طلب محدد:',
    selectTechnician: 'اختر الفني...',
    
    // Change priority modal
    changePriorityFor: 'اختر مستوى الأولوية لـ {count} طلب محدد:',
    selectPriority: 'اختر الأولوية...',
    emergency: '🚨 طارئ',
    high: '🔴 عالي',
    medium: '🟡 متوسط',
    low: '🟢 منخفض',
    
    // Mark completed modal
    markAsCompleted: 'تحديد الطلبات كمكتملة',
    markCompletedDescription: 'سيتم تحديد {count} طلب محدد كمكتمل. لا يمكن التراجع عن هذا الإجراء.',
    
    // Delete modal
    deleteRequests: 'حذف الطلبات',
    deleteDescription: 'سيتم حذف {count} طلب محدد نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    confirmDelete: 'لتأكيد هذا الإجراء، اكتب "حذف" أدناه:',
    deletePlaceholder: 'اكتب حذف...',
    
    // Default modal
    confirmAction: 'هل أنت متأكد من أنك تريد تنفيذ إجراء {action} لـ {count} طلب؟',
    
    // Buttons
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    delete: 'حذف'
  }
};

export default function RequestsBulkActionsBar({
  selectedCount,
  bulkActions,
  onBulkAction,
  onClearSelection,
  loading = false
}: RequestsBulkActionsBarProps) {
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

  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [actionData, setActionData] = useState<any>({});

  if (selectedCount === 0) {
    return null;
  }

  const handleActionClick = (actionId: string) => {
    const action = bulkActions.find(a => a.id === actionId);
    if (!action) return;

    setCurrentAction(actionId);

    // Actions that require additional input
    if (actionId === 'assign_technician' || actionId === 'change_priority') {
      setShowActionModal(true);
    } else if (action.confirmationRequired) {
      // Show confirmation for dangerous actions
      setShowActionModal(true);
    } else {
      // Execute action directly
      onBulkAction(actionId);
    }
  };

  const handleModalAction = () => {
    if (currentAction) {
      onBulkAction(currentAction);
      setShowActionModal(false);
      setCurrentAction(null);
      setActionData({});
    }
  };

  const getActionIcon = (actionId: string) => {
    switch (actionId) {
      case 'assign_technician':
        return UserCheck;
      case 'change_priority':
        return RefreshCw;
      case 'export_selected':
        return Download;
      case 'mark_completed':
        return CheckCircle;
      case 'delete_selected':
        return Trash2;
      default:
        return Settings;
    }
  };

  const getModalContent = () => {
    if (!currentAction) return null;

    const action = bulkActions.find(a => a.id === currentAction);
    if (!action) return null;

    switch (currentAction) {
      case 'assign_technician':
        return (
          <div className="space-y-4">
            <p className="text-text-light-secondary dark:text-text-secondary">
              {t.assignTechnicianFor.replace('{count}', selectedCount.toString())}
            </p>
            <Select
              value={actionData.technicianId || ''}
              onChange={(e: any) => setActionData({ technicianId: e.target.value })}
              options={[
                { value: '', label: t.selectTechnician },
                { value: 'ali_hassan', label: 'Ali Hassan - Mahmoud Electrical' },
                { value: 'mohammed_ali', label: 'Mohammed Ali - Baghdad Plumbing' },
                { value: 'sara_ahmed', label: 'Sara Ahmed - City HVAC Services' },
                { value: 'omar_ibrahim', label: 'Omar Ibrahim - General Maintenance Co.' }
              ]}
            />
          </div>
        );

      case 'change_priority':
        return (
          <div className="space-y-4">
            <p className="text-text-light-secondary dark:text-text-secondary">
              {t.changePriorityFor.replace('{count}', selectedCount.toString())}
            </p>
            <Select
              value={actionData.priority || ''}
              onChange={(e: any) => setActionData({ priority: e.target.value })}
              options={[
                { value: '', label: t.selectPriority },
                { value: 'emergency', label: t.emergency },
                { value: 'high', label: t.high },
                { value: 'medium', label: t.medium },
                { value: 'low', label: t.low }
              ]}
            />
          </div>
        );

      case 'mark_completed':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-semantic-success-600 mt-1" />
              <div>
                <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-2">
                  {t.markAsCompleted}
                </h4>
                <p className="text-text-light-secondary dark:text-text-secondary">
                  {t.markCompletedDescription.replace('{count}', selectedCount.toString())}
                </p>
              </div>
            </div>
          </div>
        );

      case 'delete_selected':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-primary-red mt-1" />
              <div>
                <h4 className="font-medium text-primary-red mb-2">
                  {t.deleteRequests}
                </h4>
                <p className="text-text-light-secondary dark:text-text-secondary">
                  {t.deleteDescription.replace('{count}', selectedCount.toString())}
                </p>
                <p className="text-sm text-primary-red mt-2">
                  {t.confirmDelete}
                </p>
                <input
                  type="text"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red bg-white dark:bg-gray-800"
                  placeholder={t.deletePlaceholder}
                  value={actionData.confirmation || ''}
                  onChange={(e) => setActionData({ confirmation: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-text-light-secondary dark:text-text-secondary">
              {t.confirmAction.replace('{action}', action.label).replace('{count}', selectedCount.toString())}
            </p>
          </div>
        );
    }
  };

  const isModalActionDisabled = () => {
    if (!currentAction) return true;

    switch (currentAction) {
      case 'assign_technician':
        return !actionData.technicianId;
      case 'change_priority':
        return !actionData.priority;
      case 'delete_selected':
        return actionData.confirmation !== 'SİL';
      default:
        return false;
    }
  };

  return (
    <>
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Left side - Selection info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-gold rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {selectedCount}
                </div>
                <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                  {selectedCount} {t.requestsSelected}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={onClearSelection}
                className="text-text-light-muted hover:text-text-on-light dark:text-text-muted dark:hover:text-text-on-dark"
              >
                {t.clearSelection}
              </Button>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {bulkActions.map((action) => {
                const IconComponent = getActionIcon(action.id);
                return (
                  <Button
                    key={action.id}
                    variant={action.dangerAction ? "danger" : "secondary"}
                    size="sm"
                    icon={IconComponent}
                    onClick={() => handleActionClick(action.id)}
                    disabled={loading || (action.requiresSelection && selectedCount === 0)}
                    className={action.dangerAction ? "text-red-600 hover:text-red-700" : ""}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setCurrentAction(null);
          setActionData({});
        }}
        title={bulkActions.find(a => a.id === currentAction)?.label || t.bulkAction}
        size="md"
      >
        <div className="space-y-6">
          {getModalContent()}

          <div className="flex justify-end gap-3 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
            <Button
              variant="secondary"
              onClick={() => {
                setShowActionModal(false);
                setCurrentAction(null);
                setActionData({});
              }}
            >
              {t.cancel}
            </Button>
            <Button
              variant={currentAction === 'delete_selected' ? "danger" : "primary"}
              onClick={handleModalAction}
              disabled={isModalActionDisabled()}
              isLoading={loading}
            >
              {currentAction === 'delete_selected' ? t.delete : t.confirm}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}