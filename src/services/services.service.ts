import { apiClient } from './api/client';
import { ApiResponse } from './core/types';
import { apiConfig } from './config/api.config';

export interface Service {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  description?: string;
  category: string;
  priceFixed?: number;
  priceMin?: number;
  priceMax?: number;
  currency: string;
  isActive: boolean;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  priceFixed?: number;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  priceFixed?: number;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  category?: string;
  isActive?: boolean;
}

export interface ServicePaginationResponse {
  data: Service[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  isActive?: boolean;
  orderColumn?: string;
  orderBy?: 'ASC' | 'DESC';
}

export const servicesService = {
  // Get all services with pagination and filters
  async getServices(filters: ServiceFilters = {}): Promise<ApiResponse<ServicePaginationResponse>> {
    const params = new URLSearchParams();

    // Pagination params
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    // Filter params
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.status) params.append('status', filters.status);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    // Order params
    if (filters.orderColumn) params.append('orderColumn', filters.orderColumn);
    if (filters.orderBy) params.append('orderBy', filters.orderBy);

    const queryString = params.toString();
    const url = `${apiConfig.endpoints.services.base}${queryString ? `?${queryString}` : ''}`;

    const response: ApiResponse<ServicePaginationResponse> = await apiClient.get<ServicePaginationResponse>(url);
    return response;
  },

  // Get service by ID
  async getServiceById(id: string): Promise<Service> {
    const response: ApiResponse<Service> = await apiClient.get<Service>(apiConfig.endpoints.services.byId(id));
    return response.data;
  },

  // Create new service
  async createService(data: CreateServiceRequest): Promise<Service> {
    console.log('Creating service:', JSON.stringify(data, null, 2));
    const response: ApiResponse<Service> = await apiClient.post<Service>(apiConfig.endpoints.services.base, data);
    console.log('Service creation response:', response);
    return response.data;
  },

  // Update service
  async updateService(id: string, data: UpdateServiceRequest): Promise<Service> {
    console.log('Updating service:', id, data);
    const response: ApiResponse<Service> = await apiClient.put<Service>(apiConfig.endpoints.services.byId(id), data);
    console.log('Service update response:', response);
    return response.data;
  },

  // Delete service
  async deleteService(id: string): Promise<void> {
    console.log('Deleting service:', id);
    await apiClient.delete(apiConfig.endpoints.services.byId(id));
    console.log('Service deleted successfully');
  },

  // Get service categories (if available)
  async getServiceCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(`${apiConfig.endpoints.services.base}/categories`);
      return response.data || [];
    } catch (error) {
      console.warn('Service categories endpoint not available:', error);
      return [];
    }
  },

  // Get service priorities (if available)
  async getServicePriorities(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(`${apiConfig.endpoints.services.base}/priorities`);
      return response.data || [];
    } catch (error) {
      console.warn('Service priorities endpoint not available:', error);
      return [];
    }
  },

  // Get service statuses (if available)
  async getServiceStatuses(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(`${apiConfig.endpoints.services.base}/statuses`);
      return response.data || [];
    } catch (error) {
      console.warn('Service statuses endpoint not available:', error);
      return [];
    }
  },
};
