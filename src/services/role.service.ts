import { apiClient } from './api/client';
import { PaginatedResponse } from './core/types';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: 'ASC' | 'DESC';
  orderColumn?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

class RoleService {
  private baseUrl = '/admin/roles';

  /**
   * Tüm rolleri getir (pagination olmadan)
   */
  async getAllRoles(): Promise<Role[]> {
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
   * Non-admin rolleri getir (Admin, Super Admin, Resident hariç)
   */
  async getNonAdminRoles(): Promise<Role[]> {
    const response = await apiClient.get(`${this.baseUrl}/non-admin`);
    
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
   * Tüm rolleri getir (pagination ile - eski metod)
   */
  async getRoles(filters?: RoleFilters): Promise<PaginatedResponse<Role>> {
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
   * Tek rol getir
   */
  async getRole(roleId: string): Promise<Role> {
    const response = await apiClient.get(`${this.baseUrl}/${roleId}`);
    return response.data;
  }

  /**
   * Yeni rol oluştur
   */
  async createRole(data: CreateRoleRequest): Promise<Role> {
    try {
      // Slug'ı otomatik oluştur
      const requestData = {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      
      console.log('🚀 Creating role with data:', requestData);
      console.log('📍 API Endpoint:', this.baseUrl);
      
      const response = await apiClient.post(this.baseUrl, requestData);
      
      console.log('✅ Role creation response:', response);
      console.log('📊 Response status:', response.status);
      console.log('📋 Response data:', response.data);
      console.log('🔍 Response type:', typeof response.data);
      console.log('🔍 Response keys:', response.data ? Object.keys(response.data) : 'No data');
      console.log('🔍 Response is array:', Array.isArray(response.data));
      console.log('🔍 Response is object:', response.data && typeof response.data === 'object');
      console.log('🔍 Response has id:', response.data && response.data.id);
      console.log('🔍 Response id value:', response.data ? response.data.id : 'No ID');
      
      // Response'u parse et ve güvenli hale getir
      let roleData = response.data;
      
      // Eğer response.data yoksa, response'u direkt kullan
      if (!roleData && response) {
        console.log('⚠️ response.data is empty, using response directly');
        roleData = response;
      }
      
      // Eğer hala data yoksa, hata fırlat
      if (!roleData) {
        console.error('❌ No data in response');
        throw new Error('Rol oluşturuldu ancak response boş');
      }
      
      console.log('✅ Role created successfully, returning roleData');
      console.log('📤 Final return value:', roleData);
      return roleData;
      
    } catch (error) {
      console.error('❌ Error in createRole:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Rol güncelle
   */
  async updateRole(roleId: string, data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.put(`${this.baseUrl}/${roleId}`, data);
    return response.data;
  }

  /**
   * Rol sil
   */
  async deleteRole(roleId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${roleId}`);
  }
}

export const roleService = new RoleService();
