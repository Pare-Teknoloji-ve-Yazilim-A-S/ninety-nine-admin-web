import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';

export interface UnitPrice {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    priceType: 'DUES' | 'ELECTRICITY' | 'GAS' | 'WATER';
    unitPrice: number; // Changed from string to number
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
            console.log('🔧 Update URL:', `${this.baseUrl}/${id}`);
            
            // Prepare data for backend - convert string values to numbers where needed
            const preparedData = { ...updateData };
            
            // Convert unitPrice from string to number if it exists
            if (preparedData.unitPrice && typeof preparedData.unitPrice === 'string') {
                const numericPrice = parseFloat(preparedData.unitPrice);
                if (!isNaN(numericPrice) && numericPrice >= 0) {
                    preparedData.unitPrice = numericPrice;
                } else {
                    throw new Error('unitPrice must be a valid positive number');
                }
            }
            
            // Ensure other numeric fields are properly typed
            if (preparedData.isActive !== undefined && typeof preparedData.isActive === 'string') {
                preparedData.isActive = preparedData.isActive === 'true';
            }
            
            if (preparedData.isDefault !== undefined && typeof preparedData.isDefault === 'string') {
                preparedData.isDefault = preparedData.isDefault === 'true';
            }
            
            console.log('🔧 Prepared data for backend:', preparedData);
            
            const response = await apiClient.patch<UnitPrice>(`${this.baseUrl}/${id}`, preparedData);
            console.log('🔧 Update response:', response);
            console.log('🔧 Response type:', typeof response);
            console.log('🔧 Response.data:', response.data);
            
            // API client ApiResponse<T> döndürüyor, response.data UnitPrice objesi
            let result: UnitPrice;
            if (response && typeof response === 'object' && 'data' in response) {
                // response.data UnitPrice objesi
                result = response.data as UnitPrice;
            } else {
                // Fallback: response direkt UnitPrice objesi olabilir
                result = response as unknown as UnitPrice;
            }
            
            console.log('🔧 Final result:', result);
            
            return result;
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
        const numericPrice = typeof price.unitPrice === 'string' ? parseFloat(price.unitPrice) : price.unitPrice;
        return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numericPrice);
    }
}

export const unitPricesService = new UnitPricesService();
