import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ServiceRequestsList, 
  RequestsListFilters, 
  RequestsListResponse,
  UseRequestsListResult,
  ServiceRequest,
  RequestSummary,
  QuickStat,
  PaginationInfo,
  RequestPermissions,
  FilterConfig
} from '@/services/types/request-list.types';
import { ticketService, Ticket, TicketFilters, TicketPaginationResponse } from '@/services/ticket.service';
import { ApiResponse } from '@/services';
import requestListData from '@/../../docs/page-structure/request-list-view.json';

// Transform current Ticket type to ServiceRequest type
const transformTicketToServiceRequest = (ticket: Ticket): ServiceRequest => {
  return {
    id: ticket.id,
    requestId: ticket.id,
    title: ticket.title || 'Untitled Request',
    description: ticket.description || '',
    apartment: {
      number: ticket.property?.propertyNumber || 'N/A',
      block: ticket.property?.building || 'N/A',
      floor: ticket.property?.floor || 0,
      owner: ticket.property?.owner || 'N/A',
      tenant: ticket.property?.tenant || undefined,
      phone: ticket.creator?.phone || ''
    },
    category: {
      id: ticket.type || 'general',
      label: ticket.type || 'General',
      icon: '🔧',
      color: '#6b7280'
    },
    priority: {
      id: ticket.priority || 'medium',
      label: ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1) || 'Medium',
      level: ticket.priority === 'high' ? 3 : ticket.priority === 'low' ? 1 : 2,
      color: ticket.priority === 'high' ? '#ea580c' : ticket.priority === 'low' ? '#16a34a' : '#d97706',
      icon: ticket.priority === 'high' ? '🔴' : ticket.priority === 'low' ? '🟢' : '🟡'
    },
    status: {
      id: ticket.status || 'open',
      label: getStatusLabel(ticket.status || 'open'),
      color: getStatusColor(ticket.status || 'open'),
      bgColor: getStatusBgColor(ticket.status || 'open')
    },
    assignee: ticket.assignee ? {
      id: ticket.assignee.id,
      name: `${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}`.trim(),
      company: ticket.assignee.company || 'N/A',
      phone: ticket.assignee.phone || '',
      avatar: getInitials(`${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}`),
      rating: 4.5
    } : undefined,
    createdDate: ticket.createdAt || new Date().toISOString(),
    updatedDate: ticket.updatedAt || ticket.createdAt || new Date().toISOString(),
    dueDate: ticket.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedCompletion: undefined,
    completedDate: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? ticket.updatedAt : undefined,
    responseTime: undefined,
    completionTime: undefined,
    imagesCount: 0,
    commentsCount: 0,
    cost: {
      estimated: 0,
      actual: undefined,
      currency: 'IQD'
    },
    customerRating: undefined,
    tags: [ticket.type || 'general'],
    isOverdue: ticket.dueDate ? new Date(ticket.dueDate) < new Date() : false,
    isUrgent: ticket.priority === 'high',
    hasImages: false,
    hasComments: false
  };
};

// Helper functions
const getStatusLabel = (status: string): string => {
  const statusLabels: { [key: string]: string } = {
    'OPEN': 'Açık',
    'IN_PROGRESS': 'İşlemde',
    'WAITING': 'Bekliyor',
    'RESOLVED': 'Çözüldü',
    'CLOSED': 'Kapalı'
  };
  return statusLabels[status] || status;
};

const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'OPEN': '#3b82f6',
    'IN_PROGRESS': '#8b5cf6', 
    'WAITING': '#f59e0b',
    'RESOLVED': '#10b981',
    'CLOSED': '#6b7280'
  };
  return statusColors[status] || '#6b7280';
};

const getStatusBgColor = (status: string): string => {
  const statusBgColors: { [key: string]: string } = {
    'OPEN': '#dbeafe',
    'IN_PROGRESS': '#f3e8ff',
    'WAITING': '#fef3c7', 
    'RESOLVED': '#d1fae5',
    'CLOSED': '#f3f4f6'
  };
  return statusBgColors[status] || '#f3f4f6';
};

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(part => part.length > 0);
  return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2) || 'NA';
};

// Generate summary from requests data
const generateSummary = (requests: ServiceRequest[]): RequestSummary => {
  const activeRequests = requests.filter(r => r.status.id !== 'CLOSED' && r.status.id !== 'RESOLVED').length;
  const completedToday = requests.filter(r => {
    if (!r.completedDate) return false;
    const today = new Date().toDateString();
    return new Date(r.completedDate).toDateString() === today;
  }).length;
  const overdueRequests = requests.filter(r => r.isOverdue).length;

  return {
    totalRequests: requests.length,
    activeRequests,
    completedToday,
    overdueRequests,
    averageResponseTime: '4.2 saat',
    averageCompletionTime: '2.3 gün',
    satisfactionRate: 4.6
  };
};

// Generate quick stats from requests data
const generateQuickStats = (requests: ServiceRequest[]): QuickStat[] => {
  const newRequests = requests.filter(r => r.status.id === 'OPEN').length;
  const inProgress = requests.filter(r => r.status.id === 'IN_PROGRESS').length;
  const completed = requests.filter(r => r.status.id === 'RESOLVED' || r.status.id === 'CLOSED').length;
  const overdue = requests.filter(r => r.isOverdue).length;

  return [
    {
      label: 'Yeni Talepler',
      value: newRequests,
      change: '+15%',
      trend: 'up',
      color: '#3b82f6',
      icon: '📝'
    },
    {
      label: 'İşlemde',
      value: inProgress,
      change: '+8%',
      trend: 'up',
      color: '#8b5cf6',
      icon: '⚙️'
    },
    {
      label: 'Tamamlanan',
      value: completed,
      change: '+23%',
      trend: 'up',
      color: '#10b981',
      icon: '✅'
    },
    {
      label: 'Gecikmiş',
      value: overdue,
      change: '-12%',
      trend: 'down',
      color: '#ef4444',
      icon: '⏰'
    }
  ];
};

export function useRequestsList(): UseRequestsListResult {
  // State
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestsListFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20
  });

  // Memoize filters and pagination to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.search,
    filters.status,
    filters.priority,
    filters.category,
    filters.assignee
  ]);

  const memoizedPagination = useMemo(() => pagination, [
    pagination.page,
    pagination.limit
  ]);

  // Static data from JSON (in real app, this would come from API)
  const staticData = useMemo(() => {
    const jsonData = requestListData.serviceRequestsList;
    return {
      pageInfo: jsonData.pageInfo,
      filters: jsonData.filters as any,
      sortOptions: jsonData.sortOptions,
      bulkActions: jsonData.bulkActions,
      tableColumns: jsonData.tableColumns,
      exportOptions: jsonData.exportOptions,
      permissions: jsonData.permissions as RequestPermissions
    };
  }, []);


  // Fetch requests from API - with proper params to avoid re-renders
  const fetchRequestsWithFilters = useCallback(async (
    currentFilters: RequestsListFilters,
    currentPagination: { page: number; limit: number }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const apiFilters: TicketFilters = {
        search: currentFilters.search,
        status: currentFilters.status,
        priority: currentFilters.priority,
        type: currentFilters.category,
        page: currentPagination.page,
        limit: currentPagination.limit,
        orderColumn: 'createdAt',
        orderBy: 'DESC'
      };
      
      const response: ApiResponse<TicketPaginationResponse> = await ticketService.getTickets(apiFilters);
      const tickets = Array.isArray(response.data) ? response.data : [];
      
      // Transform tickets to service requests
      const transformedRequests = tickets.map(transformTicketToServiceRequest);
      
      setRequests(transformedRequests);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError('Talepler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<RequestsListFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination({ page: 1, limit: 20 });
  }, []);

  // Update sort
  const updateSort = useCallback((sort: string) => {
    // This would be implemented when sort is added to the API
    console.log('Sort updated:', sort);
  }, []);

  // Update pagination
  const updatePagination = useCallback((page: number, limit?: number) => {
    setPagination(prev => ({
      page,
      limit: limit || prev.limit
    }));
  }, []);

  // Refetch data
  const refetch = useCallback(() => {
    return fetchRequestsWithFilters(memoizedFilters, memoizedPagination);
  }, [fetchRequestsWithFilters, memoizedFilters, memoizedPagination]);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchRequestsWithFilters(memoizedFilters, memoizedPagination);
  }, [fetchRequestsWithFilters, memoizedFilters, memoizedPagination]);

  // Memoized data
  const data = useMemo<ServiceRequestsList>(() => {
    const summary = generateSummary(requests);
    const quickStats = generateQuickStats(requests);
    
    const paginationInfo: PaginationInfo = {
      currentPage: memoizedPagination.page,
      totalPages: Math.ceil(requests.length / memoizedPagination.limit),
      itemsPerPage: memoizedPagination.limit,
      totalItems: requests.length,
      showingFrom: (memoizedPagination.page - 1) * memoizedPagination.limit + 1,
      showingTo: Math.min(memoizedPagination.page * memoizedPagination.limit, requests.length),
      pageSizeOptions: [10, 20, 50, 100]
    };

    return {
      pageInfo: staticData.pageInfo,
      filters: staticData.filters,
      summary,
      quickStats,
      sortOptions: staticData.sortOptions,
      pagination: paginationInfo,
      bulkActions: staticData.bulkActions,
      tableColumns: staticData.tableColumns as any,
      requests,
      exportOptions: staticData.exportOptions,
      permissions: staticData.permissions
    };
  }, [requests, memoizedPagination, staticData]);

  return {
    data,
    loading,
    error,
    refetch,
    updateFilters,
    resetFilters,
    updateSort,
    updatePagination
  };
}