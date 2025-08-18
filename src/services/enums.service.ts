// Enums Service - Fetch and cache enums in localStorage
'use client';

import { apiClient } from './api/client';

export interface EnumsResponse {
  success: boolean;
  data: {
    staff?: {
      department?: string[];
      position?: string[];
      employment_type?: string[];
      employment_status?: string[];
    };
    properties?: {
      property_type?: string[];
      property_status?: string[];
      furnishing_status?: string[];
    };
    tickets?: {
      priority?: string[];
      status?: string[];
      category?: string[];
    };
    billing?: {
      bill_type?: string[];
      payment_status?: string[];
      currency?: string[];
    };
    payment?: {
      paymentMethod?: string[];
      paymentStatus?: string[];
      paymentType?: string[];
    };
    users?: {
      role?: string[];
      status?: string[];
    };
    announcements?: {
      type?: string[];
      status?: string[];
    };
    qrcode?: {
      status?: string[];
    };
    familyMembers?: {
      relationship?: string[];
      status?: string[];
    };
    userProperties?: {
      status?: string[];
    };
    roles?: {
      permissions?: string[];
    };
    [key: string]: any; // For any additional modules
  };
}

class EnumsService {
  private baseUrl = '/enums';

  /**
   * Get all enums
   */
  async getAllEnums(): Promise<EnumsResponse> {
    try {
      // First try to get from cache
      const cached = this.getFromCache();
      if (cached) {
        console.log('📦 Using cached enums data');
        return cached;
      }

      // If not in cache, fetch from API
      console.log('🌐 Fetching enums from API...');
      const response = await apiClient.get(this.baseUrl);
      console.log('🔍 Enums service raw response:', response);
      console.log('📊 Response.data:', response.data);
      console.log('📊 Response type:', typeof response);
      
      // Backend direkt data objesi döndürüyor, response.data değil
      const data = response.data || response;
      
      // Cache the result
      this.setCache(data);
      
      return data;
    } catch (error) {
      console.error('Error fetching enums:', error);
      throw error;
    }
  }

  /**
   * Refresh enums data (clear cache and fetch fresh data)
   */
  async refreshEnums(): Promise<EnumsResponse> {
    try {
      console.log('🔄 Refreshing enums data...');
      
      // Clear cache first
      this.clearCache();
      
      // Fetch fresh data from API
      const response = await apiClient.get(this.baseUrl);
      console.log('🌐 Fresh enums response:', response);
      
      // Backend direkt data objesi döndürüyor, response.data değil
      const data = response.data || response;
      
      // Cache the fresh result
      this.setCache(data);
      
      console.log('✅ Enums refreshed successfully');
      return data;
    } catch (error) {
      console.error('Error refreshing enums:', error);
      throw error;
    }
  }

  /**
   * Get enums by module
   */
  async getEnumsByModule(module: string): Promise<any> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data?.data?.[module] || {};
    } catch (error) {
      console.error(`Error fetching enums for module ${module}:`, error);
      throw error;
    }
  }

  /**
   * Get enums by module and category
   */
  async getEnumsByCategory(module: string, category: string): Promise<string[]> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data?.data?.[module]?.[category] || [];
    } catch (error) {
      console.error(`Error fetching enums for ${module}.${category}:`, error);
      throw error;
    }
  }

  /**
   * Get enums from cache (localStorage)
   */
  getFromCache(): EnumsResponse | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const cached = localStorage.getItem('enums_cache');
      if (!cached) return null;
      
      const parsed = JSON.parse(cached);
      const cacheTime = localStorage.getItem('enums_cache_time');
      
      // Check if cache is still valid (24 hours)
      if (cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        if (cacheAge > maxAge) {
          localStorage.removeItem('enums_cache');
          localStorage.removeItem('enums_cache_time');
          return null;
        }
      }
      
      return parsed;
    } catch (error) {
      console.error('Error reading enums from cache:', error);
      return null;
    }
  }

  /**
   * Set enums to cache (localStorage)
   */
  setCache(data: EnumsResponse): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('enums_cache', JSON.stringify(data));
      localStorage.setItem('enums_cache_time', Date.now().toString());
    } catch (error) {
      console.error('Error setting enums cache:', error);
    }
  }

  /**
   * Clear enums cache
   */
  clearCache(): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.removeItem('enums_cache');
      localStorage.removeItem('enums_cache_time');
    } catch (error) {
      console.error('Error clearing enums cache:', error);
    }
  }
}

export const enumsService = new EnumsService();
export default enumsService;




