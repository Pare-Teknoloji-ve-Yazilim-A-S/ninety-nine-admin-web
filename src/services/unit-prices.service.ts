import { apiClient } from './api/client';

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
    private baseUrl = '/admin/unit-prices';

    async getUnitPrices(): Promise<UnitPrice[]> {
        try {
            const response = await apiClient.get<UnitPrice[]>(this.baseUrl);
            return response.data;
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
            const response = await apiClient.patch<UnitPrice>(`${this.baseUrl}/${id}`, updateData);
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
