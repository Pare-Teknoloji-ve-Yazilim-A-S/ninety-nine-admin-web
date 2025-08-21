import { apiClient } from './api/client';
import { PaginatedResponse } from './core/types';

export interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionFilters {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: 'ASC' | 'DESC';
  orderColumn?: string;
}

export interface CreatePermissionRequest {
  name: string;
  action: string;
  resource: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  action?: string;
  resource?: string;
  description?: string;
}

class PermissionService {
  private baseUrl = '/admin/permissions';

  /**
   * Tüm izinleri getir (pagination olmadan)
   */
  async getAllPermissions(): Promise<Permission[]> {
    const response = await apiClient.get(`${this.baseUrl}/all`);
    
    // API response yapısını kontrol et ve düzelt
    if (response.data && response.data.data) {
      // Standart paginated response: { data: [...], pagination: {...} }
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      // Direkt array response: [...]
      return response.data;
    } else if (Array.isArray(response)) {
      // Response direkt array olabilir
      return response;
    } else if (response.data && typeof response.data === 'object') {
      // Response direkt obje olabilir
      return [response.data];
    } else {
      // Fallback
      return [];
    }
  }

  /**
   * Tüm izinleri getir (pagination ile - eski metod)
   */
  async getPermissions(filters?: PermissionFilters): Promise<PaginatedResponse<Permission>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.orderBy) params.append('orderBy', filters.orderBy);
    if (filters?.orderColumn) params.append('orderColumn', filters.orderColumn);

    const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
    
    // API response yapısını kontrol et ve düzelt
    if (response.data && response.data.data) {
      // Standart paginated response: { data: [...], pagination: {...} }
      return response.data;
    } else if (Array.isArray(response.data)) {
      // Direkt array response: [...]
      const total = response.data.length;
      return {
        data: response.data,
        pagination: {
          total,
          page: 1,
          limit: total,
          totalPages: 1
        },
        total,
        page: 1,
        limit: total,
        totalPages: 1
      };
    } else {
      // Fallback
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        },
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  }

  /**
   * Tek izin getir
   */
  async getPermission(permissionId: string): Promise<Permission> {
    const response = await apiClient.get(`${this.baseUrl}/${permissionId}`);
    return response.data;
  }

  /**
   * Yeni izin oluştur
   */
  async createPermission(data: CreatePermissionRequest): Promise<Permission> {
    const response = await apiClient.post(this.baseUrl, data);
    
    // Response'u kontrol et ve güvenli hale getir
    if (response.data && response.data.id) {
      return response.data;
    } else {
      console.error('Invalid create permission response:', response.data);
      throw new Error('İzin oluşturuldu ancak geçersiz response alındı');
    }
  }

  /**
   * İzin güncelle
   */
  async updatePermission(permissionId: string, data: UpdatePermissionRequest): Promise<Permission> {
    const response = await apiClient.put(`${this.baseUrl}/${permissionId}`, data);
    return response.data;
  }

  /**
   * İzin sil
   */
  async deletePermission(permissionId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${permissionId}`);
  }
}

export const permissionService = new PermissionService();
