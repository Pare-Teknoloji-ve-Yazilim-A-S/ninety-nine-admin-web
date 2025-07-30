import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import { RequestsTableViewProps, ServiceRequest } from '@/services/types/request-list.types';
import {
  ChevronUp,
  ChevronDown,
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
  Wrench
} from 'lucide-react';

export default function RequestsTableView({
  requests,
  columns,
  loading = false,
  selectedRequests,
  onSelectionChange,
  onRequestAction,
  sortOptions,
  onSortChange
}: RequestsTableViewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(requests);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (request: ServiceRequest, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedRequests, request]);
    } else {
      onSelectionChange(selectedRequests.filter(r => r.id !== request.id));
    }
  };

  const toggleRowExpansion = (requestId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  const isSelected = (request: ServiceRequest) => {
    return selectedRequests.some(r => r.id === request.id);
  };

  const isAllSelected = selectedRequests.length === requests.length && requests.length > 0;
  const isIndeterminate = selectedRequests.length > 0 && selectedRequests.length < requests.length;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
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
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-background-light-secondary dark:border-background-secondary">
              <th className="text-left p-4 w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>

              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Başlık
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Daire
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Kategori
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Öncelik
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Durum
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Teknisyen
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Oluşturulma
              </th>
              <th className="text-left p-4 font-medium text-text-light-secondary dark:text-text-secondary">
                Vade
              </th>
              <th className="text-center p-4 w-20 font-medium text-text-light-secondary dark:text-text-secondary">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status.id);
              const isRowSelected = isSelected(request);
              const isExpanded = expandedRows.has(request.id);

              return (
                <React.Fragment key={request.id}>
                  <tr
                    className={`border-b border-background-light-soft dark:border-background-soft hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors ${isRowSelected ? 'bg-primary-gold/5' : ''
                      }`}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={isRowSelected}
                        onChange={(e) => handleSelectRow(request, e.target.checked)}
                      />
                    </td>
                    {/* <td className="p-4">
                      <button
                        onClick={() => toggleRowExpansion(request.id)}
                        className="text-primary-gold hover:text-primary-gold/80 font-medium"
                      >
                        {request.requestId}
                      </button>
                    </td> */}
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-text-on-light dark:text-text-on-dark truncate">
                          {request.title}
                        </p>
                        {request.isUrgent && (
                          <Badge variant="solid" color="red" className="text-xs mt-1">
                            Acil
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                          {request.apartment.number}
                        </p>
                        <p className="text-text-light-muted dark:text-text-muted">
                          {request.apartment.block} Blok
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="soft"
                        color="secondary"
                        className="text-xs"
                      >
                        <span className="mr-1">{request.category.icon}</span>
                        {request.category.label}
                      </Badge>
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" style={{ color: request.status.color }} />
                        <Badge
                          variant="soft"
                          color="secondary"
                          className="text-xs"
                        >
                          {request.status.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
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
                          </div>
                        </div>
                      ) : (
                        <Badge variant="soft" color="secondary" className="text-xs">
                          Atanmamış
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-text-light-secondary dark:text-text-secondary">
                      {formatDate(request.createdDate)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className={`${request.isOverdue ? 'text-primary-red font-medium' : 'text-text-light-secondary dark:text-text-secondary'}`}>
                          {formatDate(request.dueDate)}
                        </p>
                        {request.isOverdue && (
                          <Badge variant="soft" color="red" className="text-xs mt-1">
                            Gecikmiş
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <RequestActionMenu
                        request={request}
                        onAction={onRequestAction}
                      />
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {isExpanded && (
                    <tr className="bg-background-light-soft dark:bg-background-soft">
                      <td colSpan={11} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Description */}
                          <div className="lg:col-span-2">
                            <h4 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                              Açıklama
                            </h4>
                            <p className="text-sm text-text-on-light dark:text-text-on-dark">
                              {request.description || 'Açıklama bulunmuyor.'}
                            </p>
                          </div>

                          {/* Contact Info */}
                          <div>
                            <h4 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                              İletişim
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                <span>{request.apartment.owner}</span>
                              </div>
                              {request.apartment.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                  <a
                                    href={`tel:${request.apartment.phone}`}
                                    className="text-primary-gold hover:underline"
                                  >
                                    {request.apartment.phone}
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                <span>{request.apartment.block} Blok, {request.apartment.floor}. Kat</span>
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div>
                            <h4 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                              Ek Bilgiler
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-text-light-muted dark:text-text-muted">Son Güncelleme: </span>
                                <span>{formatDateTime(request.updatedDate)}</span>
                              </div>
                              {request.estimatedCompletion && (
                                <div>
                                  <span className="text-text-light-muted dark:text-text-muted">Tahmini Bitiş: </span>
                                  <span>{formatDateTime(request.estimatedCompletion)}</span>
                                </div>
                              )}
                              <div className="flex gap-2 flex-wrap">
                                {request.tags.map((tag, index) => (
                                  <Badge key={index} variant="soft" color="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
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
  const router = useRouter();

  const actions = [
    {
      id: 'view',
      label: 'Detay',
      icon: Eye,
    },
    { id: 'edit', label: 'Düzenle', icon: Edit },
    { id: 'delete', label: 'Sil', icon: Trash2, danger: true }
  ];

  const handleActionClick = (actionId: string) => {
    if (actionId === 'view') {
      // Detay sayfasına yönlendir
      router.push(`/dashboard/requests/${request.id}`);
    } else {
      // Diğer aksiyonlar için parent component'a bildirim gönder
      onAction(actionId, request);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        icon={MoreVertical}
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 p-0"
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 ${action.danger
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-700 dark:text-gray-200'
                  }`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}