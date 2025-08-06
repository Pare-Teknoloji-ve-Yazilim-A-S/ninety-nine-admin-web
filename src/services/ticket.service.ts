import { apiClient } from './api/client';
import { ApiResponse } from './core/types';

export interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  ticketNumber: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  category: string;
  dueDate?: string;
  resolvedAt?: string;
  closedAt?: string;
  creator: any;
  assignee?: any;
  property?: any;
  comments?: any[];
  attachments?: any[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  type: string;
  priority: string;
  category: string;
  propertyId: string;
  creatorId: string | number;
  initialComment?: string;
}

export interface CreateAttachmentRequest {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  type?: string;
  priority?: string;
  category?: string;
  propertyId?: string;
  assigneeId?: string;
  dueDate?: string;
  status?: string;
}

export interface TicketPaginationResponse {
  data: Ticket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TicketFilters {
  priority?: string;
  assigneeId?: string;
  propertyId?: string;
  creatorId?: string;
  filter?: 'open' | 'overdue' | 'dueToday' | 'unassigned';
  page?: number;
  limit?: number;
  orderColumn?: string;
  orderBy?: 'ASC' | 'DESC';
  search?: string;
  type?: string;
  status?: string | string[];
}

export interface TicketSummary {
  openTickets: number;
  inProgressTickets: number;
  waitingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  cancelledTickets: number;
  unassignedTickets: number;
  overdueTickets: number;
  dueTodayTickets: number;
  totalTickets: number;
}

export const ticketService = {
  // Create new ticket
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    console.log('Sending ticket creation request:', JSON.stringify(data, null, 2));
    const response: ApiResponse<Ticket> = await apiClient.post<Ticket>('/admin/tickets', data);
    console.log('Ticket creation response:', response);
    return response.data;
  },

  // Yeni ana endpoint - pagination ile
  async getTickets(filters: TicketFilters = {}): Promise<ApiResponse<TicketPaginationResponse>> {
    const params = new URLSearchParams();

    // Pagination params
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    // Filter params
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    if (filters.creatorId) params.append('creatorId', filters.creatorId);
    if (filters.filter) params.append('filter', filters.filter);
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach(status => params.append('status', status));
      } else {
        params.append('status', filters.status);
      }
    }

    // Order params
    if (filters.orderColumn) params.append('orderColumn', filters.orderColumn);
    if (filters.orderBy) params.append('orderBy', filters.orderBy);

    const queryString = params.toString();
    const url = `/admin/tickets${queryString ? `?${queryString}` : ''}`;

    const response: ApiResponse<TicketPaginationResponse> = await apiClient.get<TicketPaginationResponse>(url);
    return response;
  },

  // Eski metodları geriye uyumluluk için koruyorum
  async getOpenTickets(): Promise<TicketPaginationResponse> {
    const response = await this.getTickets({ filter: 'open', limit: 100 });
    return response.data;
  },

  async getTicketsByStatus(status: string): Promise<TicketPaginationResponse> {
    const response = await this.getTickets({ status, limit: 100 });
    return response.data;
  },

  // Get tickets by user ID - special endpoint that returns direct array
  async getTicketsByUserId(userId: string): Promise<Ticket[]> {
    console.log(`🎫 Fetching tickets for userId: ${userId}`);
    
    // This endpoint returns direct array without data wrapper
    const response = await apiClient.get<Ticket[]>(`/admin/tickets/user/${userId}`);
    
    // API returns direct array, so we return response directly (not response.data)
    // because apiClient already extracts the response body
    console.log(`✅ Raw response for user ${userId}:`, response);
    
    // Handle different response formats gracefully
    if (Array.isArray(response)) {
      return response;
    }
    
    // If response has data property (shouldn't happen but safety check)
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as any).data || [];
    }
    
    console.warn(`⚠️ Unexpected response format for user ${userId}:`, response);
    return [];
  },

  // --- Ticket Status Update Methods ---
  async startProgress(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`/admin/tickets/${id}/start-progress`, {});
    return response.data;
  },
  async markWaiting(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`/admin/tickets/${id}/mark-waiting`, {});
    return response.data;
  },
  async resolve(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`/admin/tickets/${id}/resolve`, {});
    return response.data;
  },
  async close(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`/admin/tickets/${id}/close`, {});
    return response.data;
  },
  async cancel(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`/admin/tickets/${id}/cancel`, {});
    return response.data;
  },
  // --- Ticket Comments ---
  async getComments(id: string): Promise<any[]> {
    const response: ApiResponse<any[]> = await apiClient.get<any[]>(`/admin/tickets/${id}/comments`);
    return response.data;
  },
  async addComment(id: string, content: string): Promise<any> {
    const response: ApiResponse<any> = await apiClient.post<any>(`/admin/tickets/${id}/comments`, { content });
    return response.data;
  },

  // --- Ticket Attachments ---
  async addAttachment(ticketId: string, data: CreateAttachmentRequest): Promise<any> {
    const response: ApiResponse<any> = await apiClient.post<any>(`/admin/tickets/${ticketId}/attachments`, data);
    return response.data;
  },

  // --- Ticket CRUD Operations ---
  async getTicketById(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.get<Ticket>(`/admin/tickets/${id}`);
    return response.data;
  },

  async updateTicket(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    console.log('Updating ticket:', id, data);
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`/admin/tickets/${id}`, data);
    console.log('Ticket update response:', response);
    return response.data;
  },

  async deleteTicket(id: string): Promise<void> {
    console.log('Deleting ticket:', id);
    await apiClient.delete(`/admin/tickets/${id}`);
    console.log('Ticket deleted successfully');
  },

  // --- Ticket Statistics ---
  async getMonthlyStats(): Promise<{
    currentMonthCount: number;
    previousMonthCount: number;
    percentageChange: number;
    changeDirection: 'increase' | 'decrease';
    currentMonthName: string;
    previousMonthName: string;
  }> {
    const response: ApiResponse<{
      currentMonthCount: number;
      previousMonthCount: number;
      percentageChange: number;
      changeDirection: 'increase' | 'decrease';
      currentMonthName: string;
      previousMonthName: string;
    }> = await apiClient.get<{
      currentMonthCount: number;
      previousMonthCount: number;
      percentageChange: number;
      changeDirection: 'increase' | 'decrease';
      currentMonthName: string;
      previousMonthName: string;
    }>('/admin/tickets/monthly-stats');
    return response.data;
  },

  // Get ticket summary statistics
  async getTicketSummary(): Promise<TicketSummary> {
    const response = await apiClient.get<TicketSummary>('/admin/tickets/summary');
    console.log('🔍 getTicketSummary response:', response);
    console.log('🔍 getTicketSummary response.data:', response.data);
    // API returns direct TicketSummary object, not wrapped in ApiResponse
    return response.data;
  },
}; 