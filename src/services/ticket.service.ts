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
}; 