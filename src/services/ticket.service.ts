import { apiClient } from './api/client';
import { ApiResponse } from './core/types';
import { apiConfig } from './config/api.config';

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
    const response: ApiResponse<Ticket> = await apiClient.post<Ticket>(apiConfig.endpoints.tickets.base, data);
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
    const url = `${apiConfig.endpoints.tickets.base}${queryString ? `?${queryString}` : ''}`;

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
    const response = await apiClient.get<Ticket[]>(`${apiConfig.endpoints.tickets.base}/user/${userId}`);
    
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
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(apiConfig.endpoints.tickets.startProgress(id), {});
    return response.data;
  },
  async markWaiting(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(apiConfig.endpoints.tickets.markWaiting(id), {});
    return response.data;
  },
  async resolve(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(apiConfig.endpoints.tickets.resolve(id), {});
    return response.data;
  },
  async close(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(apiConfig.endpoints.tickets.close(id), {});
    return response.data;
  },
  async cancel(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(apiConfig.endpoints.tickets.cancel(id), {});
    return response.data;
  },
  // --- Ticket Comments ---
  async getComments(id: string): Promise<any[]> {
    const response: ApiResponse<any[]> = await apiClient.get<any[]>(apiConfig.endpoints.tickets.comments(id));
    return response.data;
  },
  async addComment(id: string, content: string): Promise<any> {
    const response: ApiResponse<any> = await apiClient.post<any>(apiConfig.endpoints.tickets.comments(id), { content });
    return response.data;
  },

  // --- Ticket Attachments ---
  async addAttachment(ticketId: string, data: CreateAttachmentRequest): Promise<any> {
    const response: ApiResponse<any> = await apiClient.post<any>(apiConfig.endpoints.tickets.attachments(ticketId), data);
    return response.data;
  },

  async getAttachments(ticketId: string): Promise<any[]> {
    try {
      const response: any = await apiClient.get<any>(apiConfig.endpoints.tickets.attachments(ticketId));
      // Possible formats:
      // 1) { success, data: { ticketId, attachments: [] } }
      // 2) { attachments: [] }
      // 3) [ ... ]
      if (Array.isArray(response)) return response;
      if (response?.data?.attachments && Array.isArray(response.data.attachments)) {
        return response.data.attachments;
      }
      if (response?.attachments && Array.isArray(response.attachments)) {
        return response.attachments;
      }
      return [];
    } catch (error: any) {
      if (error?.status === 404) {
        return [];
      }
      return [];
    }
  },

  // --- Ticket CRUD Operations ---
  async getTicketById(id: string): Promise<Ticket> {
    const response: ApiResponse<Ticket> = await apiClient.get<Ticket>(`${apiConfig.endpoints.tickets.base}/${id}`);
    return response.data;
  },

  async updateTicket(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    console.log('Updating ticket:', id, data);
    const response: ApiResponse<Ticket> = await apiClient.put<Ticket>(`${apiConfig.endpoints.tickets.base}/${id}`, data);
    console.log('Ticket update response:', response);
    return response.data;
  },

  async deleteTicket(id: string): Promise<void> {
    console.log('Deleting ticket:', id);
    await apiClient.delete(`${apiConfig.endpoints.tickets.base}/${id}`);
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
    }>(apiConfig.endpoints.tickets.monthlyStats);
    return response.data;
  },

  // Get ticket summary statistics
  async getTicketSummary(): Promise<TicketSummary> {
    const response = await apiClient.get<TicketSummary>(apiConfig.endpoints.tickets.summary);
    console.log('🔍 getTicketSummary response:', response);
    console.log('🔍 getTicketSummary response.data:', response.data);
    // API returns direct TicketSummary object, not wrapped in ApiResponse
    return response.data;
  },
}; 