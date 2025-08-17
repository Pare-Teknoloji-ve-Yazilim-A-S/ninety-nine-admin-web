import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';

export interface UnitPrice {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    priceType: 'DUES' | 'ELECTRICITY' | 'GAS' | 'WATER';
    unitPrice: string;
    unit: string;
    isActive: boolean;
    description: string;
    validFrom: string | null;
    validTo: string | null;
    isDefault: boolean;
}

export interface UnitPricesResponse {
    data: UnitPrice[];
}

class UnitPricesService {
    private baseUrl = apiConfig.endpoints.unitPrices.base;

    async getUnitPrices(): Promise<UnitPrice[]> {
        try {
            const response = await apiClient.get<UnitPrice[]>(this.baseUrl);
            console.log('🔧 Service response:', response);
            console.log('🔧 Response data:', response.data);
            console.log('🔧 Is response array:', Array.isArray(response));
            // API client direkt array döndürüyor, response.data değil
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Failed to fetch unit prices:', error);
            return [];
        }
    }

    async getAllUnitPrices(): Promise<UnitPrice[]> {
        return this.getUnitPrices();
    }

    async updateUnitPrice(id: string, updateData: Partial<UnitPrice>): Promise<UnitPrice> {
        try {
            console.log('🔧 Update request data:', updateData);
            const response = await apiClient.patch<UnitPrice>(`${this.baseUrl}/${id}`, updateData);
            console.log('🔧 Update response:', response);
            // API client response'u döndürüyor, response.data'yı al
            return response.data;
        } catch (error) {
            console.error('Failed to update unit price:', error);
            throw error;
        }
    }

    async getActiveUnitPrices(): Promise<UnitPrice[]> {
        try {
            const unitPrices = await this.getUnitPrices();
            return unitPrices.filter(price => price.isActive);
        } catch (error) {
            console.error('Failed to fetch active unit prices:', error);
            return [];
        }
    }

    getPriceByType(prices: UnitPrice[], type: string): UnitPrice | undefined {
        return prices.find(price => price.priceType === type && price.isActive);
    }

    formatUnitPrice(price: UnitPrice): string {
        const numericPrice = parseFloat(price.unitPrice);
        return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numericPrice);
    }
}

export const unitPricesService = new UnitPricesService();
