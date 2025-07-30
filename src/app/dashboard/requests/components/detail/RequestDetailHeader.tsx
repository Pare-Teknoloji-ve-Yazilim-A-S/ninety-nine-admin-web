import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { RequestDetailHeaderProps, STATUS_CONFIGS } from '@/services/types/request-detail.types';

// Icon mapping for status
const getStatusIcon = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    'AlertCircle': require('lucide-react').AlertCircle,
    'RotateCcw': require('lucide-react').RotateCcw,
    'PauseCircle': require('lucide-react').PauseCircle,
    'CheckCircle': require('lucide-react').CheckCircle,
    'X': require('lucide-react').X,
    'Calendar': require('lucide-react').Calendar
  };
  return icons[iconName] || icons['AlertCircle'];
};

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({
  request,
  onEdit,
  onDelete,
  onBack,
  loading = false
}) => {
  const statusConfig = STATUS_CONFIGS[request.status.id] || STATUS_CONFIGS['OPEN'];
  const StatusIcon = getStatusIcon(statusConfig.icon);

  // Get badge color based on status
  const getBadgeColor = (status: string) => {
    const colorMap: { [key: string]: any } = {
      'OPEN': 'info',
      'IN_PROGRESS': 'warning', 
      'WAITING': 'secondary',
      'RESOLVED': 'success',
      'CLOSED': 'secondary',
      'CANCELLED': 'red'
    };
    return colorMap[status] || 'secondary';
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
              {request.title}
            </h1>
            <StatusIcon className="h-6 w-6" style={{ color: request.status.color }} />
            <Badge 
              variant="soft" 
              color={getBadgeColor(request.status.id)}
            >
              {request.status.label}
            </Badge>
            {request.isUrgent && (
              <Badge variant="solid" color="red" className="text-xs">
                Acil
              </Badge>
            )}
            {request.isOverdue && (
              <Badge variant="solid" color="red" className="text-xs">
                Gecikmiş
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-text-light-secondary dark:text-text-secondary">
            <p>
              Talep No: <span className="font-medium">{request.requestId}</span>
            </p>
            <p className="hidden sm:block">•</p>
            <p>
              Daire: <span className="font-medium">{request.apartment.number}</span>
            </p>
            <p className="hidden sm:block">•</p>
            <p>
              Kategori: <span className="font-medium flex items-center gap-1">
                <span>{request.category.icon}</span>
                {request.category.label}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={onBack}
            disabled={loading}
          >
            Geri
          </Button>
          <Button
            variant="secondary"
            icon={Edit}
            onClick={onEdit}
            disabled={loading}
          >
            Düzenle
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={onDelete}
            disabled={loading}
          >
            Sil
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RequestDetailHeader;