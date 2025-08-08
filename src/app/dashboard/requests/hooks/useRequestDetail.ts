import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ServiceRequestDetail, 
  UseRequestDetailResult,
  RequestDetailAction,
  STATUS_CONFIGS,
  PRIORITY_CONFIGS,
  CATEGORY_CONFIGS
} from '@/services/types/request-detail.types';
import { ticketService, Ticket } from '@/services/ticket.service';
import { useRequestsActions } from './useRequestsActions';

// Transform Ticket to ServiceRequestDetail
const transformTicketToRequestDetail = (ticket: Ticket): ServiceRequestDetail => {
  // Helper functions for getting config info
  const getStatusInfo = (status: string) => {
    const config = STATUS_CONFIGS[status] || STATUS_CONFIGS['OPEN'];
    return {
      id: status,
      label: config.label,
      color: getStatusColor(status),
      bgColor: getStatusBgColor(status)
    };
  };

  const getPriorityInfo = (priority: string) => {
    const config = PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS['MEDIUM'];
    return {
      id: priority,
      label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
      level: config.level,
      color: getPriorityColor(priority),
      icon: getPriorityIcon(priority)
    };
  };

  const getCategoryInfo = (type: string) => {
    const config = CATEGORY_CONFIGS[type] || CATEGORY_CONFIGS['OTHER'];
    return {
      id: type,
      label: getCategoryLabel(type),
      icon: config.icon,
      color: getCategoryColor(type)
    };
  };

  return {
    id: ticket.id,
    requestId: ticket.ticketNumber,
    title: ticket.title,
    description: ticket.description,
    apartment: {
      number: ticket.property?.propertyNumber || 'N/A',
      block: ticket.property?.building || 'N/A',
      floor: ticket.property?.floor || 0,
      owner: `${ticket.creator?.firstName || ''} ${ticket.creator?.lastName || ''}`.trim() || 'N/A',
      tenant: ticket.property?.tenant || undefined,
      phone: ticket.creator?.phone || ticket.property?.phone || ''
    },
    category: getCategoryInfo(ticket.type),
    priority: getPriorityInfo(ticket.priority),
    status: getStatusInfo(ticket.status),
    assignee: ticket.assignee ? {
      id: ticket.assignee.id,
      name: `${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}`.trim(),
      company: ticket.assignee.company || 'N/A',
      phone: ticket.assignee.phone || '',
      avatar: getInitials(`${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}`),
      rating: 4.5
    } : undefined,
    createdDate: ticket.createdAt,
    updatedDate: ticket.updatedAt,
    dueDate: ticket.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedCompletion: undefined,
    completedDate: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? ticket.updatedAt : undefined,
    responseTime: undefined,
    completionTime: undefined,
    imagesCount: ticket.attachments?.length || 0,
    commentsCount: ticket.comments?.length || 0,
    cost: {
      estimated: 0,
      actual: undefined,
      currency: 'IQD'
    },
    customerRating: undefined,
    // Ensure tags are always strings for safe rendering
    // Use human-readable labels instead of raw enum/object values
    tags: [
      getCategoryLabel(ticket.type),
      ((): string => {
        const priorityId = (typeof ticket.priority === 'string')
          ? ticket.priority
          : (ticket as any)?.priority?.id || (ticket as any)?.priority?.label || 'MEDIUM';
        const info = getPriorityInfo(String(priorityId));
        return String(info.label);
      })()
    ].filter(Boolean),
    isOverdue: ticket.dueDate ? new Date(ticket.dueDate) < new Date() : false,
    isUrgent: ticket.priority === 'HIGH' || ticket.priority === 'URGENT',
    hasImages: (ticket.attachments?.length || 0) > 0,
    hasComments: (ticket.comments?.length || 0) > 0
  };
};

// Helper functions
const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'OPEN': '#3b82f6',
    'IN_PROGRESS': '#8b5cf6',
    'WAITING': '#f59e0b',
    'RESOLVED': '#10b981',
    'CLOSED': '#6b7280',
    'CANCELLED': '#ef4444'
  };
  return colors[status] || '#6b7280';
};

const getStatusBgColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'OPEN': '#dbeafe',
    'IN_PROGRESS': '#f3e8ff',
    'WAITING': '#fef3c7',
    'RESOLVED': '#d1fae5',
    'CLOSED': '#f3f4f6',
    'CANCELLED': '#fee2e2'
  };
  return colors[status] || '#f3f4f6';
};

const getPriorityColor = (priority: string): string => {
  const colors: { [key: string]: string } = {
    'LOW': '#16a34a',
    'MEDIUM': '#d97706',
    'HIGH': '#ea580c',
    'URGENT': '#dc2626'
  };
  return colors[priority] || '#d97706';
};

const getPriorityIcon = (priority: string): string => {
  const icons: { [key: string]: string } = {
    'LOW': '🟢',
    'MEDIUM': '🟡',
    'HIGH': '🔴',
    'URGENT': '🚨'
  };
  return icons[priority] || '🟡';
};

const getCategoryColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'FAULT_REPAIR': '#ef4444',
    'MAINTENANCE': '#f59e0b',
    'CLEANING': '#06b6d4',
    'SECURITY': '#dc2626',
    'COMPLAINT': '#f59e0b',
    'SUGGESTION': '#10b981',
    'OTHER': '#6b7280'
  };
  return colors[type] || '#6b7280';
};

const getCategoryLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    'FAULT_REPAIR': 'Arıza',
    'MAINTENANCE': 'Bakım',
    'CLEANING': 'Temizlik',
    'SECURITY': 'Güvenlik',
    'COMPLAINT': 'Şikayet',
    'SUGGESTION': 'Öneri',
    'OTHER': 'Diğer'
  };
  return labels[type] || type;
};

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(part => part.length > 0);
  return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2) || 'NA';
};

export function useRequestDetail(requestId: string): UseRequestDetailResult {
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the existing actions hook
  const {
    handleEditRequest,
    handleDeleteRequest,
    handleUpdateRequestStatus
  } = useRequestsActions({
    refreshData: () => fetchRequest(),
    setSelectedRequests: () => {},
    setRequests: () => {}
  });

  // Fetch request data
  const fetchRequest = useCallback(async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.getTicketById(requestId);
      const transformedRequest = transformTicketToRequestDetail(ticket);
      setRequest(transformedRequest);
    } catch (err) {
      console.error('Error fetching request:', err);
      setError('Talep verisi yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  // Handle edit action
  const handleEdit = useCallback(() => {
    if (request) {
      // Navigate to edit page
      router.push(`/dashboard/requests/${request.id}/edit`);
    }
  }, [request, router]);

  // Handle delete action
  const handleDelete = useCallback(() => {
    if (request) {
      // Use the existing delete handler which will show confirmation
      const mockTicket = {
        id: request.id,
        title: request.title,
        ticketNumber: request.requestId
      } as Ticket;
      handleDeleteRequest(mockTicket);
    }
  }, [request, handleDeleteRequest]);

  // Handle status change
  const handleStatusChange = useCallback(async (action: RequestDetailAction) => {
    if (!request) return;

    try {
      const mockTicket = {
        id: request.id,
        title: request.title,
        ticketNumber: request.requestId,
        status: request.status.id
      } as Ticket;

      await handleUpdateRequestStatus(mockTicket, action);
      // Refresh the request data after status change
      await fetchRequest();
    } catch (err) {
      console.error('Error updating request status:', err);
      throw err;
    }
  }, [request, handleUpdateRequestStatus, fetchRequest]);

  // Refetch data
  const refetch = useCallback(async () => {
    await fetchRequest();
  }, [fetchRequest]);

  return {
    request,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleStatusChange,
    refetch
  };
}