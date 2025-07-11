import { BaseService } from './core/base.service';
import { 
    Property, 
    PropertyFilterParams, 
    PropertyStatistics, 
    QuickStats, 
    PropertyActivity 
} from './types/property.types';
import { ApiResponse, PaginatedResponse } from './core/types';
import { apiConfig } from './config/api.config';
import { apiClient } from './api/client';

export class UnitsService extends BaseService<Property, Partial<Property>, Partial<Property>> {
    protected baseEndpoint = apiConfig.endpoints.properties.admin.base;

    constructor() {
        super('UnitsService');
    }

    async getAllUnits(filters: PropertyFilterParams = {}): Promise<PaginatedResponse<Property>> {
        try {
            const params = this.buildFilterParams(filters);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get(`${this.baseEndpoint}${queryParams}`);
            
            return {
                data: response.data.data || response.data,
                pagination: response.data.pagination || response.pagination || {
                    total: response.data.length || 0,
                    page: filters.page || 1,
                    limit: filters.limit || 20,
                    totalPages: Math.ceil((response.data.length || 0) / (filters.limit || 20))
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async getUnitById(id: string): Promise<ApiResponse<Property>> {
        const response = await apiClient.get(`${this.baseEndpoint}/${id}`);
        return response;
    }

    async createUnit(unitData: Partial<Property>): Promise<ApiResponse<Property>> {
        const response = await apiClient.post(`${this.baseEndpoint}`, unitData);
        return response;
    }

    async updateUnit(id: string, unitData: Partial<Property>): Promise<ApiResponse<Property>> {
        const response = await apiClient.put(`${this.baseEndpoint}/${id}`, unitData);
        return response;
    }

    async deleteUnit(id: string): Promise<ApiResponse<void>> {
        const response = await apiClient.delete(`${this.baseEndpoint}/${id}`);
        return response;
    }

    async getQuickStats(): Promise<ApiResponse<QuickStats>> {
        const response = await apiClient.get(`${apiConfig.endpoints.properties.admin.quickStats}`);
        return response;
    }

    async getRecentActivities(limit: number = 10, days: number = 7): Promise<ApiResponse<PropertyActivity[]>> {
        const queryParams = this.buildQueryParams({ limit, days });
        const response = await apiClient.get(`${apiConfig.endpoints.properties.admin.recentActivities}${queryParams}`);
        return response;
    }

    async getStatistics(filters: PropertyFilterParams = {}): Promise<ApiResponse<PropertyStatistics>> {
        const params = this.buildFilterParams(filters);
        const queryParams = this.buildQueryParams(params);
        const response = await apiClient.get(`${apiConfig.endpoints.properties.admin.statistics}${queryParams}`);
        return response;
    }

    async exportUnits(filters: PropertyFilterParams = {}, format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
        const params = { ...this.buildFilterParams(filters), format };
        const queryParams = this.buildQueryParams(params);
        const response = await apiClient.get(`${apiConfig.endpoints.properties.admin.export}${queryParams}`);
        return response.data;
    }

    async bulkUpdateUnits(unitIds: string[], updateData: Partial<Property>): Promise<ApiResponse<void>> {
        const response = await apiClient.patch(`${apiConfig.endpoints.properties.admin.bulkUpdate}`, {
            ids: unitIds,
            data: updateData
        });
        return response;
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