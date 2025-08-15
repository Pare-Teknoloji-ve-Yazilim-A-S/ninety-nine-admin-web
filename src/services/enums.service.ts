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
      const response = await apiClient.get(this.baseUrl);
      console.log('🔍 Enums service raw response:', response);
      console.log('📊 Response.data:', response.data);
      console.log('📊 Response type:', typeof response);
      
      // Backend direkt data objesi döndürüyor, response.data değil
      return response.data || response;
    } catch (error) {
      console.error('Error fetching enums:', error);
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
}

export const enumsService = new EnumsService();
export default enumsService;




