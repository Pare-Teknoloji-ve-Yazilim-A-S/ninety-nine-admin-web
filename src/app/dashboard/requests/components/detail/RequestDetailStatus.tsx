import React, { useState } from 'react';
import { Play, CheckCircle, PauseCircle, RotateCcw, X, AlertCircle, UserCheck } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { RequestDetailStatusProps, STATUS_CONFIGS, RequestDetailAction } from '@/services/types/request-detail.types';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

// Permission constants
const UPDATE_TICKET_PERMISSION_NAME = 'Update Ticket';
const CANCEL_TICKET_PERMISSION_NAME = 'Cancel Ticket';

const RequestDetailStatus: React.FC<RequestDetailStatusProps> = ({
  request,
  onStatusChange,
  loading = false
}) => {
  // Permission checks
  const { hasPermission } = usePermissionCheck();
  const hasUpdateTicketPermission = hasPermission(UPDATE_TICKET_PERMISSION_NAME);
  const hasCancelTicketPermission = hasPermission(CANCEL_TICKET_PERMISSION_NAME);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentStatus = request.status.id;
  const statusConfig = STATUS_CONFIGS[currentStatus] || STATUS_CONFIGS['OPEN'];
  const allowedActions = statusConfig.allowedActions;

  // Handle status change with loading state
  const handleAction = async (action: RequestDetailAction) => {
    try {
      setActionLoading(action);
      await onStatusChange(action);
    } catch (error) {
      console.error('Status change failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Action button configuration
  const actionButtons = [
    {
      action: 'start-progress',
      label: 'İşleme Al',
      icon: Play,
      variant: 'primary' as const,
      description: 'Talebi işleme alın ve çalışmaya başlayın'
    },
    {
      action: 'assign',
      label: 'Ata',
      icon: UserCheck,
      variant: 'primary' as const,
      description: 'Talebi bir kişiye atayın'
    },
    {
      action: 'resolve',
      label: 'Çöz',
      icon: CheckCircle,
      variant: 'primary' as const,
      description: 'Talebi çözülmüş olarak işaretleyin'
    },
    {
      action: 'mark-waiting',
      label: 'Beklet',
      icon: PauseCircle,
      variant: 'secondary' as const,
      description: 'Talebi bekleme durumuna alın'
    },
    {
      action: 'close',
      label: 'Kapat',
      icon: CheckCircle,
      variant: 'primary' as const,
      description: 'Talebi kapatın'
    },
    {
      action: 'reopen',
      label: 'Yeniden Aç',
      icon: RotateCcw,
      variant: 'secondary' as const,
      description: 'Kapalı/çözülmüş talebi yeniden açın'
    },
    {
      action: 'cancel',
      label: 'İptal Et',
      icon: X,
      variant: 'danger' as const,
      description: 'Talebi iptal edin'
    }
  ];

  // Filter available actions based on permissions and allowed actions
  const availableActions = actionButtons.filter(button => {
    const isAllowed = allowedActions.includes(button.action as any);
    
    // Check specific permissions for different actions
    if (button.action === 'cancel') {
      return hasCancelTicketPermission && isAllowed;
    }
    
    // All other actions require Update Ticket permission
    return hasUpdateTicketPermission && isAllowed;
  });

  // No actions available
  if (availableActions.length === 0) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              Durum İşlemleri
            </h2>
          </div>

          <div className="text-center py-6">
            <p className="text-text-light-secondary dark:text-text-secondary">
              Bu durum için mevcut işlem bulunmuyor.
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
          <AlertCircle className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
          <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Hızlı İşlemler
          </h2>
        </div>

        {/* Current Status Display */}
        <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-4">
          <p className="text-sm text-text-light-muted dark:text-text-muted mb-1">
            Mevcut Durum
          </p>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: request.status.color }}
            />
            <span className="font-medium text-text-on-light dark:text-text-on-dark">
              {request.status.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableActions.map((actionConfig) => {
            const IconComponent = actionConfig.icon;
            const isLoading = actionLoading === actionConfig.action;
            
            return (
              <div key={actionConfig.action} className="space-y-2">
                <Button
                  variant={actionConfig.variant}
                  icon={IconComponent}
                  onClick={() => handleAction(actionConfig.action as RequestDetailAction)}
                  disabled={loading || isLoading}
                  isLoading={isLoading}
                  className="w-full justify-start"
                >
                  {actionConfig.label}
                </Button>
                <p className="text-xs text-text-light-muted dark:text-text-muted px-1">
                  {actionConfig.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Status Flow Information */}
        <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <p className="text-xs text-text-light-muted dark:text-text-muted mb-2">
            Durum Akışı
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_CONFIGS).map(([statusId, config]) => (
              <div
                key={statusId}
                className={`
                  px-2 py-1 rounded-md text-xs flex items-center gap-1
                  ${currentStatus === statusId 
                    ? 'bg-primary-gold/10 text-primary-gold border border-primary-gold/20' 
                    : 'bg-background-light-soft dark:bg-background-soft text-text-light-muted dark:text-text-muted'
                  }
                `}
              >
                <span>{config.label}</span>
                {currentStatus === statusId && <span>←</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Warning for irreversible actions */}
        {availableActions.some(action => ['cancel', 'close'].includes(action.action)) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Dikkat
                </p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Bazı işlemler geri alınamaz. Emin olduğunuzdan lütfen emin olun.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestDetailStatus;