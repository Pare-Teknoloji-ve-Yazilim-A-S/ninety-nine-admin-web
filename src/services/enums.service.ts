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
      console.log('📊 Response.data type:', typeof response.data);
      
      // API response yapısını kontrol et ve uygun şekilde işle
      let processedData;
      
      if (response.data && typeof response.data === 'object') {
        // response.data mevcut ve obje
        if (response.data.success !== undefined && response.data.data !== undefined) {
          // Standart API response: { success: true, data: {...} }
          processedData = response.data;
        } else {
          // Direkt enum data: { announcements: {...}, billing: {...} }
          processedData = {
            success: true,
            data: response.data
          };
        }
      } else if (response && typeof response === 'object') {
        // response.data yok ama response obje
        if (response.success !== undefined && response.data !== undefined) {
          // Standart API response
          processedData = response;
        } else {
          // Direkt enum data
          processedData = {
            success: true,
            data: response
          };
        }
      } else {
        console.error('❌ Unexpected API response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      console.log('🔧 Processed data for caching:', processedData);
      
      // Cache the result
      this.setCache(processedData);
      
      return processedData;
    } catch (error) {
      console.error('❌ Error fetching enums:', error);
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
      
      console.log('📦 Retrieved from cache:', parsed);
      return parsed;
    } catch (error) {
      console.error('❌ Error reading enums from cache:', error);
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
      console.log('📦 Cached enums data:', data);
    } catch (error) {
      console.error('❌ Error setting enums cache:', error);
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

  /**
   * Create new enum value
   */
  async createEnum(enumData: {
    module: string;
    category: string;
    code: string;
    label: string;
    sortOrder: number;
    isActive: boolean;
  }): Promise<any> {
    try {
      console.log('🔧 Creating enum:', enumData);
      
      // Backend'de enum oluşturma endpoint'i henüz yok, bu yüzden simüle ediyoruz
      // TODO: Backend'de enum oluşturma endpoint'i eklendiğinde bu kısmı güncelle
      
      // Simüle edilmiş response
      const mockResponse = {
        success: true,
        data: {
          id: `enum-${Date.now()}`,
          ...enumData,
          createdAt: new Date().toISOString()
        }
      };
      
      console.log('✅ Enum created successfully (simulated):', mockResponse);
      
      // Cache'i temizle ki yeniden yüklensin
      this.clearCache();
      
      return mockResponse;
    } catch (error) {
      console.error('❌ Error creating enum:', error);
      throw error;
    }
  }

  /**
   * Update enum value
   */
  async updateEnum(enumId: string, enumData: {
    code?: string;
    label?: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<any> {
    try {
      console.log('🔧 Updating enum:', enumId, enumData);
      
      // Backend'de enum güncelleme endpoint'i henüz yok, bu yüzden simüle ediyoruz
      // TODO: Backend'de enum güncelleme endpoint'i eklendiğinde bu kısmı güncelle
      
      const mockResponse = {
        success: true,
        data: {
          id: enumId,
          ...enumData,
          updatedAt: new Date().toISOString()
        }
      };
      
      console.log('✅ Enum updated successfully (simulated):', mockResponse);
      
      // Cache'i temizle ki yeniden yüklensin
      this.clearCache();
      
      return mockResponse;
    } catch (error) {
      console.error('❌ Error updating enum:', error);
      throw error;
    }
  }

  /**
   * Delete enum value
   */
  async deleteEnum(enumId: string): Promise<any> {
    try {
      console.log('🔧 Deleting enum:', enumId);
      
      // Backend'de enum silme endpoint'i henüz yok, bu yüzden simüle ediyoruz
      // TODO: Backend'de enum silme endpoint'i eklendiğinde bu kısmı güncelle
      
      const mockResponse = {
        success: true,
        data: {
          id: enumId,
          deletedAt: new Date().toISOString()
        }
      };
      
      console.log('✅ Enum deleted successfully (simulated):', mockResponse);
      
      // Cache'i temizle ki yeniden yüklensin
      this.clearCache();
      
      return mockResponse;
    } catch (error) {
      console.error('❌ Error deleting enum:', error);
      throw error;
    }
  }
}

export const enumsService = new EnumsService();
export default enumsService;




