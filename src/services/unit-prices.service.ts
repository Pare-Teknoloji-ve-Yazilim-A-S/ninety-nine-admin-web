import { apiClient } from './api/client';

export interface UnitPrice {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  priceType: 'DUES' | 'ELECTRICITY' | 'WATER' | 'GAS' | 'HEATING';
  unitPrice: string; // Backend string olarak dönüyor
  unit: string;
  isActive: boolean;
  description: string;
  validFrom: string | null;
  validTo: string | null;
  isDefault: boolean;
}

export interface UnitPriceResponse {
  data: UnitPrice[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface UpdateUnitPriceDto {
  unitPrice: number;
}

export interface CalculateDuesDto {
  squareMeters: number;
}

export interface CalculateDuesResponse {
  amount: number;
  unitPrice: number;
  squareMeters: number;
}

class UnitPricesService {
  private baseUrl = '/unit-prices';

  /**
   * Get all unit prices
   */
  async getAllUnitPrices(): Promise<UnitPrice[]> {
    try {
      const response = await apiClient.get(this.baseUrl);
      console.log('🔍 Raw API response:', response);
      console.log('🔍 Response.data:', response.data);
      
      // Backend direkt array dönüyor, response.data wrapper'ı yok
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      } else {
        console.error('Unexpected response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching unit prices:', error);
      throw error;
    }
  }

  /**
   * Get unit price by type
   */
  async getUnitPriceByType(type: string): Promise<UnitPrice> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unit price for type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Update unit price
   */
  async updateUnitPrice(id: string, data: UpdateUnitPriceDto): Promise<UnitPrice> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating unit price for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Calculate dues amount
   */
  async calculateDues(squareMeters: number): Promise<CalculateDuesResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/calculate-dues`, {
        params: { squareMeters }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating dues:', error);
      throw error;
    }
  }

  /**
   * Calculate electricity bill
   */
  async calculateElectricity(kWh: number): Promise<CalculateDuesResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/calculate-electricity`, {
        params: { kWh }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating electricity:', error);
      throw error;
    }
  }

  /**
   * Calculate water bill
   */
  async calculateWater(cubicMeters: number): Promise<CalculateDuesResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/calculate-water`, {
        params: { cubicMeters }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating water:', error);
      throw error;
    }
  }

  /**
   * Calculate gas bill
   */
  async calculateGas(cubicMeters: number): Promise<CalculateDuesResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/calculate-gas`, {
        params: { cubicMeters }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating gas:', error);
      throw error;
    }
  }

  /**
   * Calculate heating bill
   */
  async calculateHeating(squareMeters: number): Promise<CalculateDuesResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/calculate-heating`, {
        params: { squareMeters }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating heating:', error);
      throw error;
    }
  }
}

export const unitPricesService = new UnitPricesService();
export default unitPricesService;
