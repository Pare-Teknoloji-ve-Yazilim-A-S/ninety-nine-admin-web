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

export const ticketService = {
  async getOpenTickets(): Promise<Ticket[]> {
    const response: ApiResponse<Ticket[]> = await apiClient.get<Ticket[]>('/admin/tickets/open');
    return response.data;
  },
  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    const response: ApiResponse<Ticket[]> = await apiClient.get<Ticket[]>(`/admin/tickets/status/${status}`);
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
}; 