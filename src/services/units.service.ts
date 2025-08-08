import { BaseService } from './core/base.service';
import { 
    Property, 
    PropertyFilterParams, 
    PropertyStatistics, 
    QuickStats, 
    PropertyActivity,
    PropertyDebtStatus
} from './types/property.types';
import { ApiResponse, PaginatedResponse } from './core/types';
import { apiConfig } from './config/api.config';
import { apiClient } from './api/client';

export class UnitsService extends BaseService<Property, Partial<Property>, Partial<Property>> {
    protected baseEndpoint = apiConfig.endpoints.properties.admin.base;

    constructor() {
        super('UnitsService');
    }

    /**
     * Tüm mülkleri getir (bills hariç - performans için)
     * GET /admin/properties?includeBills=false
     */
    async getAllProperties(params?: PropertyFilterParams & { includeBills?: boolean }): Promise<PaginatedResponse<Property>> {
        this.logger.info('Fetching all properties', params);
        
        const queryParams = new URLSearchParams();
        
        // Add filter params
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.orderColumn) queryParams.append('orderColumn', params.orderColumn);
        if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
        if (params?.type) queryParams.append('type', params.type);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.blockNumber) queryParams.append('blockNumber', params.blockNumber);
        if (params?.floor) queryParams.append('floor', params.floor.toString());
        if (params?.area) queryParams.append('area', params.area.toString());
        if (params?.rooms) queryParams.append('rooms', params.rooms);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.debtStatus) queryParams.append('debtStatus', params.debtStatus);
        
        // Performance optimization: exclude bills by default
        const includeBills = params?.includeBills ?? false;
        queryParams.append('includeBills', includeBills.toString());
        
        const response = await apiClient.get<any>(`${this.baseEndpoint}?${queryParams.toString()}`);

        const body = response?.data ?? response;
        // Normalize various response shapes: { data: [...] }, { data: { data: [...], pagination } }, or [...]
        const items: Property[] = Array.isArray(body)
            ? body
            : Array.isArray(body?.data)
                ? body.data
                : Array.isArray(body?.data?.data)
                    ? body.data.data
                    : [];

        const fallbackLimit = (items.length || 10);
        const effectivePage = (params?.page ?? 1);
        const effectiveLimit = (params?.limit ?? fallbackLimit);
        const pagination = body?.pagination || body?.data?.pagination || {
            total: items.length,
            page: effectivePage,
            limit: effectiveLimit,
            totalPages: Math.max(1, Math.ceil((items.length || 0) / effectiveLimit))
        };

        this.logger.info(`Fetched ${items.length} properties`);
        return { data: items, pagination } as PaginatedResponse<Property>;
    }

    /**
     * Belirli bir mülkün detaylarını getir (bills dahil)
     * GET /admin/properties/{id}?includeBills=true
     */
    async getPropertyById(id: string, includeBills: boolean = true): Promise<Property> {
        this.logger.info(`Fetching property details: ${id}`);
        
        const queryParams = new URLSearchParams();
        queryParams.append('includeBills', includeBills.toString());
        
        const response = await apiClient.get<Property>(`${this.baseEndpoint}/${id}?${queryParams.toString()}`);
        
        this.logger.info(`Fetched property ${id} details`);
        return response.data;
    }

    /**
     * Mülklerin borç durumunu toplu olarak getir
     * POST /admin/properties/debt-status
     */
    async getPropertiesDebtStatus(propertyIds: string[]): Promise<Record<string, PropertyDebtStatus>> {
        this.logger.info(`Fetching debt status for ${propertyIds.length} properties`);
        
        try {
            const response = await apiClient.post<Record<string, PropertyDebtStatus>>(`${this.baseEndpoint}/debt-status`, {
                propertyIds
            });
            
            this.logger.info(`Fetched debt status for ${propertyIds.length} properties`);
            return response.data || {};
        } catch (error) {
            this.logger.error(`Failed to fetch debt status for properties:`, error);
            // Fallback: return empty object
            return {};
        }
    }

    async createUnit(unitData: Partial<Property>): Promise<ApiResponse<Property>> {
        const response = await apiClient.post(`${this.baseEndpoint}`, unitData);
        return response;
    }

    async updateUnit(id: string, unitData: Partial<Property>): Promise<ApiResponse<Property>> {
        const response = await apiClient.put(`${this.baseEndpoint}/${id}`, unitData);
        return response;
    }

    async getUnitById(id: string): Promise<ApiResponse<Property>> {
        const response = await apiClient.get<Property>(`${this.baseEndpoint}/${id}`);
        return response;
    }

    async getAllUnits(filters?: PropertyFilterParams): Promise<PaginatedResponse<Property>> {
        return this.getAllProperties(filters);
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