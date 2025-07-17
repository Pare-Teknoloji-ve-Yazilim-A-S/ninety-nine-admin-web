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
    return response;
  },
  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    const response: ApiResponse<Ticket[]> = await apiClient.get<Ticket[]>(`/admin/tickets/status/${status}`);
    return response;
  },
}; 