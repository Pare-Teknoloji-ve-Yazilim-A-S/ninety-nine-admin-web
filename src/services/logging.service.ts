import { apiClient } from './api/client';

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
  entityType: string;
  entityId: string;
  oldValue: Record<string, any>;
  newValue: Record<string, any>;
  metadata: Record<string, any>;
  userId: string;
  username: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  module: string;
  endpoint: string;
  httpMethod: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuditLogFilter {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  userId?: string;
  username?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
}

class LoggingService {
  private baseUrl = '/admin/logging';

  async getAuditLogs(filter: AuditLogFilter = {}): Promise<AuditLogsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filter.page) queryParams.append('page', filter.page.toString());
      if (filter.limit) queryParams.append('limit', filter.limit.toString());
      if (filter.action) queryParams.append('action', filter.action);
      if (filter.entityType) queryParams.append('entityType', filter.entityType);
      if (filter.userId) queryParams.append('userId', filter.userId);
      if (filter.username) queryParams.append('username', filter.username);
      if (filter.module) queryParams.append('module', filter.module);
      if (filter.startDate) queryParams.append('startDate', filter.startDate);
      if (filter.endDate) queryParams.append('endDate', filter.endDate);

      const url = `${this.baseUrl}/audit-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(url);
      
      console.log('Audit logs response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  async getRecentAuditLogs(limit: number = 10): Promise<AuditLog[]> {
    try {
      console.log('Fetching recent audit logs from:', `${this.baseUrl}/audit-logs/recent?limit=${limit}`);
      
      const response = await apiClient.get(`${this.baseUrl}/audit-logs/recent?limit=${limit}`);
      
      console.log('Recent audit logs response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null/undefined');
      
      // Handle different response structures
      if (response && response.data) {
        console.log('Using response.data:', response.data);
        return response.data;
      } else if (response && Array.isArray(response)) {
        console.log('Using response as array:', response);
        return response;
      } else {
        console.warn('Unexpected response format for recent audit logs:', response);
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching recent audit logs:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data
      });
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  }

  async getAuditLogsByEntity(entityType: string, entityId: string, limit: number = 10): Promise<AuditLog[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/audit-logs/${entityType}/${entityId}?limit=${limit}`);
      
      console.log('Entity audit logs response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching entity audit logs:', error);
      throw error;
    }
  }
}

export const loggingService = new LoggingService(); 