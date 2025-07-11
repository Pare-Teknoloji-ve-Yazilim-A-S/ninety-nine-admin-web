import { BaseService } from './core/base.service';
import { 
    Property, 
    PropertyFilterParams, 
    PropertyStatistics, 
    QuickStats, 
    PropertyActivity 
} from './types/property.types';
import { ApiResponse, PaginatedResponse } from './core/types';

export class UnitsService extends BaseService {
    constructor() {
        super('/properties');
    }

    async getAllUnits(filters: PropertyFilterParams = {}): Promise<PaginatedResponse<Property>> {
        const params = this.buildFilterParams(filters);
        const response = await this.apiClient.get<PaginatedResponse<Property>>(`${this.baseUrl}`, { params });
        return response.data;
    }

    async getUnitById(id: string): Promise<ApiResponse<Property>> {
        const response = await this.apiClient.get<ApiResponse<Property>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async createUnit(unitData: Partial<Property>): Promise<ApiResponse<Property>> {
        const response = await this.apiClient.post<ApiResponse<Property>>(`${this.baseUrl}`, unitData);
        return response.data;
    }

    async updateUnit(id: string, unitData: Partial<Property>): Promise<ApiResponse<Property>> {
        const response = await this.apiClient.put<ApiResponse<Property>>(`${this.baseUrl}/${id}`, unitData);
        return response.data;
    }

    async deleteUnit(id: string): Promise<ApiResponse<void>> {
        const response = await this.apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getQuickStats(): Promise<ApiResponse<QuickStats>> {
        const response = await this.apiClient.get<ApiResponse<QuickStats>>(`${this.baseUrl}/stats/quick`);
        return response.data;
    }

    async getRecentActivities(limit: number = 10, days: number = 7): Promise<ApiResponse<PropertyActivity[]>> {
        const response = await this.apiClient.get<ApiResponse<PropertyActivity[]>>(`${this.baseUrl}/activities/recent`, {
            params: { limit, days }
        });
        return response.data;
    }

    async getStatistics(filters: PropertyFilterParams = {}): Promise<ApiResponse<PropertyStatistics>> {
        const params = this.buildFilterParams(filters);
        const response = await this.apiClient.get<ApiResponse<PropertyStatistics>>(`${this.baseUrl}/stats`, { params });
        return response.data;
    }

    async exportUnits(filters: PropertyFilterParams = {}, format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
        const params = { ...this.buildFilterParams(filters), format };
        const response = await this.apiClient.get(`${this.baseUrl}/export`, {
            params,
            responseType: 'blob'
        });
        return response.data;
    }

    async bulkUpdateUnits(unitIds: string[], updateData: Partial<Property>): Promise<ApiResponse<void>> {
        const response = await this.apiClient.patch<ApiResponse<void>>(`${this.baseUrl}/bulk-update`, {
            ids: unitIds,
            data: updateData
        });
        return response.data;
    }

    private buildFilterParams(filters: PropertyFilterParams): Record<string, any> {
        const params: Record<string, any> = {};
        
        if (filters.type) params.type = filters.type;
        if (filters.status) params.status = filters.status;
        if (filters.blockNumber) params.blockNumber = filters.blockNumber;
        if (filters.floor) params.floor = filters.floor;
        if (filters.area) params.area = filters.area;
        if (filters.rooms) params.rooms = filters.rooms;
        if (filters.search) params.search = filters.search;
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
        if (filters.orderColumn) params.orderColumn = filters.orderColumn;
        if (filters.orderBy) params.orderBy = filters.orderBy;

        return params;
    }

    getTypeInfo(type: string): { label: string; icon: string; color: string } {
        const typeMap: Record<string, { label: string; icon: string; color: string }> = {
            'RESIDENCE': { label: 'Daire', icon: 'Building', color: 'primary' },
            'VILLA': { label: 'Villa', icon: 'Home', color: 'success' },
            'COMMERCIAL': { label: 'Ticari', icon: 'Store', color: 'info' },
            'PARKING': { label: 'Otopark', icon: 'Car', color: 'warning' }
        };
        return typeMap[type] || { label: 'Bilinmiyor', icon: 'Building', color: 'secondary' };
    }

    getStatusInfo(status: string): { label: string; icon: string; color: string } {
        const statusMap: Record<string, { label: string; icon: string; color: string }> = {
            'OCCUPIED': { label: 'Dolu', icon: 'CheckCircle', color: 'success' },
            'AVAILABLE': { label: 'Boş', icon: 'AlertCircle', color: 'info' },
            'UNDER_MAINTENANCE': { label: 'Bakım', icon: 'RotateCcw', color: 'warning' },
            'RESERVED': { label: 'Rezerve', icon: 'Calendar', color: 'secondary' }
        };
        return statusMap[status] || { label: 'Bilinmiyor', icon: 'AlertCircle', color: 'secondary' };
    }
}

export const unitsService = new UnitsService();