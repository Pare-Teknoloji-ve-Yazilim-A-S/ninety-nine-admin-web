import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import { RequestsGridViewProps, ServiceRequest } from '@/services/types/request-list.types';
import {
  MoreVertical,
  User,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle,
  Wrench,
  Building,
  Star,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';

export default function RequestsGridView({
  requests,
  loading = false,
  selectedRequests,
  onSelectionChange,
  onRequestAction,
  loadingCardCount = 6
}: RequestsGridViewProps) {

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(requests);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRequest = (request: ServiceRequest, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedRequests, request]);
    } else {
      onSelectionChange(selectedRequests.filter(r => r.id !== request.id));
    }
  };

  const isSelected = (request: ServiceRequest) => {
    return selectedRequests.some(r => r.id === request.id);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'new':
        return AlertCircle;
      case 'in_progress':
      case 'assigned':
        return Clock;
      case 'completed':
      case 'resolved':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(loadingCardCount)].map((_, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<Wrench className="h-12 w-12" />}
        title="Henüz talep bulunmuyor"
        description="Filtrelere uygun hizmet talebi bulunamadı."
        action={
          <Button
            variant="primary"
            onClick={() => onRequestAction('create', {} as ServiceRequest)}
          >
            Yeni Talep Oluştur
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Select All */}
      {requests.length > 0 && (
        <div className="flex items-center gap-3 pb-4 border-b border-background-light-secondary dark:border-background-secondary">
          <Checkbox
            checked={selectedRequests.length === requests.length}
            indeterminate={selectedRequests.length > 0 && selectedRequests.length < requests.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-sm text-text-light-secondary dark:text-text-secondary">
            {selectedRequests.length > 0
              ? `${selectedRequests.length} talep seçildi`
              : `Tümünü seç (${requests.length} talep)`
            }
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => {
          const StatusIcon = getStatusIcon(request.status.id);
          const isRequestSelected = isSelected(request);

          return (
            <RequestCard
              key={request.id}
              request={request}
              isSelected={isRequestSelected}
              onSelect={(checked) => handleSelectRequest(request, checked)}
              onAction={onRequestAction}
              StatusIcon={StatusIcon}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
            />
          );
        })}
      </div>
    </div>
  );
}

// Individual Request Card Component
interface RequestCardProps {
  request: ServiceRequest;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onAction: (action: string, request: ServiceRequest) => void;
  StatusIcon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  formatDate: (date: string) => string;
  formatDateTime: (date: string) => string;
}

function RequestCard({
  request,
  isSelected,
  onSelect,
  onAction,
  StatusIcon,
  formatDate,
  formatDateTime
}: RequestCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card
      className={`p-6 transition-all duration-200 hover:shadow-lg ${isSelected
        ? 'ring-2 ring-primary-gold/50 bg-primary-gold/5'
        : 'hover:scale-[1.02]'
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="mt-1"
          />
          <div className="flex gap-1">
            {/* <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-primary-gold">
                {request.requestId}
              </span>
              
            </div> */}
            <h3 className="font-semibold text-text-on-light dark:text-text-on-dark line-clamp-2 text-sm">
              {request.title}
            </h3>

          </div>
        </div>
        <RequestActionMenu request={request} onAction={onAction} />
      </div>

      {/* Status and Priority */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {!request.isUrgent && (
            <Badge variant="solid" color="red" className="text-xs">
              Acil
            </Badge>
          )}
          <Badge
            variant="soft"
            color="secondary"
            className="text-xs"
          >
            <StatusIcon className="h-4 w-4 mr-2" style={{ color: request.status.color }} />
            {request.status.label}
          </Badge>
        </div>
        <Badge
          variant="soft"
          color={
            request.priority.level === 4 ? 'red' :
              request.priority.level === 3 ? 'gold' :
                request.priority.level === 2 ? 'secondary' : 'primary'
          }
          className="text-xs"
        >
          <span className="mr-1">{request.priority.icon}</span>
          {request.priority.label}
        </Badge>
      </div>

      {/* Category and Location */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{request.category.icon}</span>
          <span className="text-text-light-secondary dark:text-text-secondary">
            {request.category.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-text-light-muted dark:text-text-muted">
          <Building className="h-3 w-3" />
          <span>{request.apartment.number}</span>
        </div>
      </div>

      {/* Assignee */}
      <div className="mb-4">
        {request.assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-primary-gold">
              {request.assignee.avatar}
            </div>
            <div className="text-sm">
              <p className="font-medium text-text-on-light dark:text-text-on-dark">
                {request.assignee.name}
              </p>
              <p className="text-text-light-muted dark:text-text-muted text-xs">
                {request.assignee.company}
              </p>
              {request.assignee.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-text-light-muted dark:text-text-muted">
                    {request.assignee.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Badge variant="soft" color="secondary" className="text-xs">
            Atanmamış
          </Badge>
        )}
      </div>

      {/* Dates */}
      <div className="space-y-2 text-xs text-text-light-secondary dark:text-text-secondary mb-4">
        <div className="flex items-center justify-between">
          <span>Oluşturulma:</span>
          <span>{formatDate(request.createdDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Vade:</span>
          <span className={request.isOverdue ? 'text-primary-red font-medium' : ''}>
            {formatDate(request.dueDate)}
            {request.isOverdue && ' (Gecikmiş)'}
          </span>
        </div>
      </div>

      {/* Media and Comments */}
      <div className="flex items-center justify-between text-xs text-text-light-muted dark:text-text-muted mb-4">
        <div className="flex items-center gap-3">
          {request.hasImages && (
            <div className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              <span>{request.imagesCount}</span>
            </div>
          )}
          {request.hasComments && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{request.commentsCount}</span>
            </div>
          )}
        </div>
        {request.cost.estimated > 0 && (
          <div className="text-text-light-secondary dark:text-text-secondary">
            ~{new Intl.NumberFormat('tr-TR').format(request.cost.estimated)} {request.cost.currency}
          </div>
        )}
      </div>

      {/* Tags */}
      {request.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {request.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="soft" color="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {request.tags.length > 3 && (
            <Badge variant="soft" color="secondary" className="text-xs">
              +{request.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Expandable Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-text-light-muted dark:text-text-muted mb-1">Açıklama:</p>
              <p className="text-text-on-light dark:text-text-on-dark">
                {request.description || 'Açıklama bulunmuyor.'}
              </p>
            </div>

            <div>
              <p className="text-text-light-muted dark:text-text-muted mb-1">İletişim:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>{request.apartment.owner}</span>
                </div>
                {request.apartment.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <a
                      href={`tel:${request.apartment.phone}`}
                      className="text-primary-gold hover:underline"
                    >
                      {request.apartment.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{request.apartment.block} Blok, {request.apartment.floor}. Kat</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-text-light-muted dark:text-text-muted mb-1">Son Güncelleme:</p>
              <p>{formatDateTime(request.updatedDate)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Details Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-4 text-xs"
      >
        {showDetails ? 'Daha Az' : 'Detayları Gör'}
      </Button>
    </Card>
  );
}

// Action Menu Component
interface RequestActionMenuProps {
  request: ServiceRequest;
  onAction: (action: string, request: ServiceRequest) => void;
}

function RequestActionMenu({ request, onAction }: RequestActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'view', label: 'Detay', icon: Eye },
    { id: 'edit', label: 'Düzenle', icon: Edit },
    { id: 'delete', label: 'Sil', icon: Trash2, danger: true }
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        icon={MoreVertical}
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 p-0"
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-6 z-20 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onAction(action.id, request);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${action.danger
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-700 dark:text-gray-200'
                  }`}
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}