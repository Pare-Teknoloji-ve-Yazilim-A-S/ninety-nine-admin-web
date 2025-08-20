// Property Service - Application Layer
import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import {
    Property,
    CreatePropertyDto,
    UpdatePropertyDto,
    PropertyFilterParams,
    PropertySearchParams,
    PropertyListResponse,
    PropertyStatistics,
    OccupancyStats,
    QuickStats,
    PropertyActivity,
    BlockResponse,
    FilterOptions,
    BulkUpdateDto,
    BulkAssignmentDto,
    BulkActionResponse,
    ExportParams,
    ImportResult,
    MaintenanceRecord,
    CreateMaintenanceDto,
    CompleteMaintenanceDto,
} from './types/property.types';
import { ApiResponse, PaginatedResponse } from './core/types';

class PropertyService extends BaseService<Property, CreatePropertyDto, UpdatePropertyDto> {
    protected baseEndpoint = apiConfig.endpoints.properties.admin.base;

    constructor() {
        super('PropertyService');
    }

    // === PROPERTY LISTING & FILTERING === //

    /**
     * Get all properties with pagination and filtering
     * GET /admin/properties
     */
    async getAllProperties(params?: PropertyFilterParams): Promise<PaginatedResponse<Property>> {
        try {
            this.logger.info('Fetching all properties', params);

            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<PropertyListResponse>(
                `${this.baseEndpoint}${queryParams}`
            );

            // Response yapısını kontrol et
            this.logger.info('Raw response:', response);
            
            // API response yapısını parse et
            let properties: Property[];
            let pagination = {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1
            };

            // API response yapısını kontrol et
            this.logger.info('Response structure check:', {
                hasData: !!response.data,
                dataIsArray: Array.isArray(response.data),
                hasPagination: !!response.pagination,
                dataHasData: !!(response.data && response.data.data),
                dataDataIsArray: !!(response.data && response.data.data && Array.isArray(response.data.data)),
                dataHasPagination: !!(response.data && response.data.pagination)
            });

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Nested paginated response: { data: { data: [...], pagination: {...} } }
                properties = response.data.data;
                pagination = response.data.pagination || pagination;
                this.logger.info(`Fetched ${properties.length} properties (nested paginated)`);
            } else if (response.data && response.data.pagination && Array.isArray(response.data)) {
                // Direct paginated response: { data: [...], pagination: {...} }
                properties = response.data;
                pagination = response.data.pagination;
                this.logger.info(`Fetched ${properties.length} properties (direct paginated)`);
            } else if (response.data && response.data.pagination && Array.isArray(response.data.data)) {
                // API response: { data: [...], pagination: {...} }
                properties = response.data.data;
                pagination = response.data.pagination;
                this.logger.info(`Fetched ${properties.length} properties (API paginated)`);
            } else if (response.data && Array.isArray(response.data)) {
                // Direct array response
                properties = response.data;
                this.logger.info(`Fetched ${properties.length} properties (direct array)`);
            } else if (response.data && response.pagination && Array.isArray(response.data)) {
                // API response: { data: [...], pagination: {...} }
                properties = response.data;
                pagination = response.pagination;
                this.logger.info(`Fetched ${properties.length} properties (API paginated)`);
            } else {
                // Empty or unexpected response
                properties = [];
                this.logger.warn('Unexpected response structure, returning empty array');
                this.logger.warn('Response data:', response.data);
                this.logger.warn('Response pagination:', response.pagination);
            }

            return {
                data: properties,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages,
                pagination: pagination,
            };
        } catch (error) {
            this.logger.error('Failed to fetch properties', error);
            throw error;
        }
    }

    /**
     * Get user's own properties
     * GET /admin/properties/my-properties
     */
    async getMyProperties(): Promise<ApiResponse<Property[]>> {
        try {
            this.logger.info('Fetching user properties');

            const response = await apiClient.get<Property[]>(
                '/admin/properties/my-properties'
            );

            this.logger.info(`Fetched ${response.data?.length || 0} user properties`);
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch user properties', error);
            throw error;
        }
    }

    /**
     * Search properties with advanced filters
     * GET /admin/properties/search
     */
    async searchProperties(params: PropertySearchParams): Promise<Property[]> {
        try {
            this.logger.info('Searching properties', params);

            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<Property[]>(
                `${apiConfig.endpoints.properties.admin.search}${queryParams}`
            );

            this.logger.info(`Search returned ${response.data.length} results`);
            return response.data;
        } catch (error) {
            this.logger.error('Failed to search properties', error);
            throw error;
        }
    }

    /**
     * Get properties by status
     * GET /admin/properties/by-status
     */
    async getPropertiesByStatus(
        status: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED'
    ): Promise<Property[]> {
        try {
            this.logger.info(`Fetching properties with status: ${status}`);

            const response = await apiClient.get<Property[]>(
                `${apiConfig.endpoints.properties.admin.byStatus}?status=${status}`
            );

            this.logger.info(`Fetched ${response.data.length} properties with status ${status}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to fetch properties by status: ${status}`, error);
            throw error;
        }
    }

    /**
     * Get properties by owner
     * GET /admin/properties/owner/:ownerId
     */
    async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
        try {
            this.logger.info(`Fetching properties for owner: ${ownerId}`);

            const response = await apiClient.get<{
                success: boolean;
                message: string;
                data: Property[];
            }>(
                apiConfig.endpoints.properties.admin.byOwner(ownerId)
            );

            this.logger.info(`Fetched ${response.data.data.length} properties for owner`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Failed to fetch properties for owner: ${ownerId}`, error);
            throw error;
        }
    }

    /**
     * Get properties by tenant
     * GET /admin/properties/by-tenant
     */
    async getPropertiesByTenant(tenantId: string): Promise<Property[]> {
        try {
            this.logger.info(`Fetching properties for tenant: ${tenantId}`);

            const response = await apiClient.get<Property[]>(
                `${apiConfig.endpoints.properties.admin.byTenant}?tenantId=${tenantId}`
            );

            this.logger.info(`Fetched ${response.data.length} properties for tenant`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to fetch properties for tenant: ${tenantId}`, error);
            throw error;
        }
    }

    // === PROPERTY MANAGEMENT === //

    /**
     * Create new property
     * POST /admin/properties
     */
    async createProperty(data: CreatePropertyDto): Promise<ApiResponse<Property>> {
        try {
            this.logger.info('Creating new property', { propertyNumber: data.propertyNumber });

            return await this.create(data);
        } catch (error) {
            this.logger.error('Failed to create property', error);
            throw error;
        }
    }

    /**
     * Get property by ID
     * GET /admin/properties/{id}
     */
    async getPropertyById(id: string): Promise<ApiResponse<Property>> {
        try {
            this.logger.info(`Fetching property with ID: ${id}`);

            return await this.getById(id);
        } catch (error) {
            this.logger.error(`Failed to fetch property with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Update property
     * PUT /admin/properties/{id}
     */
    async updateProperty(id: string, data: UpdatePropertyDto): Promise<ApiResponse<Property>> {
        try {
            this.logger.info(`Updating property with ID: ${id}`, data);

            return await this.update(id, data);
        } catch (error) {
            this.logger.error(`Failed to update property with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Delete property
     * DELETE /admin/properties/{id}
     */
    async deleteProperty(id: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting property with ID: ${id}`);

            return await this.delete(id);
        } catch (error) {
            this.logger.error(`Failed to delete property with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Remove owner from property
     * DELETE /admin/properties/remove-owner
     */
    async removeOwner(propertyId: string, userId: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Removing owner from property: ${propertyId}, userId: ${userId}`);

            // Send parameters as query parameters instead of request body
            const url = `${apiConfig.endpoints.properties.admin.removeOwner}?propertyId=${propertyId}&userId=${userId}`;
            
            const response = await apiClient.delete<void>(url);

            this.logger.info('Owner removed successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to remove owner from property: ${propertyId}`, error);
            throw error;
        }
    }

    // === STATISTICS & ANALYTICS (Future Endpoints) === //

    /**
     * Get property statistics
     * GET /admin/properties/statistics (Future Endpoint)
     */
    async getPropertyStatistics(dateRange?: string, propertyGroup?: string): Promise<ApiResponse<PropertyStatistics>> {
        try {
            this.logger.info('Fetching property statistics', { dateRange, propertyGroup });

            const params = this.buildQueryParams({ dateRange, propertyGroup });
            const response = await apiClient.get<PropertyStatistics>(
                `${apiConfig.endpoints.properties.admin.statistics}${params}`
            );

            this.logger.info('Fetched property statistics successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch property statistics', error);
            throw error;
        }
    }

    /**
     * Get occupancy statistics
     * GET /admin/properties/occupancy-stats (Future Endpoint)
     */
    async getOccupancyStats(days: number = 30): Promise<ApiResponse<OccupancyStats>> {
        try {
            this.logger.info(`Fetching occupancy stats for ${days} days`);

            const response = await apiClient.get<OccupancyStats>(
                `${apiConfig.endpoints.properties.admin.occupancyStats}?days=${days}`
            );

            this.logger.info('Fetched occupancy statistics successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch occupancy statistics', error);
            throw error;
        }
    }

    /**
     * Get quick stats for dashboard
     * GET /admin/properties/quick-stats (Future Endpoint)
     */
    async getQuickStats(): Promise<ApiResponse<QuickStats>> {
        try {
            this.logger.info('Fetching quick stats');

            const response = await apiClient.get<QuickStats>(
                apiConfig.endpoints.properties.admin.quickStats
            );

            this.logger.info('Fetched quick stats successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch quick stats', error);
            throw error;
        }
    }

    /**
     * Get recent property activities
     * GET /admin/properties/recent-activities (Future Endpoint)
     */
    async getRecentActivities(limit: number = 20, days: number = 7): Promise<ApiResponse<PropertyActivity[]>> {
        try {
            this.logger.info(`Fetching recent activities (limit: ${limit}, days: ${days})`);

            const params = this.buildQueryParams({ limit, days });
            const response = await apiClient.get<PropertyActivity[]>(
                `${apiConfig.endpoints.properties.admin.recentActivities}${params}`
            );

            this.logger.info(`Fetched ${response.data.length} recent activities`);
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch recent activities', error);
            throw error;
        }
    }

    // === ADVANCED FILTERING (Future Endpoints) === //

    /**
     * Get properties by block
     * GET /admin/properties/by-block/{blockNumber} (Future Endpoint)
     */
    async getPropertiesByBlock(blockNumber: string, includeStats: boolean = false): Promise<ApiResponse<BlockResponse>> {
        try {
            this.logger.info(`Fetching properties for block: ${blockNumber}`);

            const params = this.buildQueryParams({ includeStats });
            const response = await apiClient.get<BlockResponse>(
                `${apiConfig.endpoints.properties.admin.byBlock(blockNumber)}${params}`
            );

            this.logger.info(`Fetched block data for ${blockNumber}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to fetch properties for block: ${blockNumber}`, error);
            throw error;
        }
    }

    /**
     * Get filter options
     * GET /admin/properties/filter-options (Future Endpoint)
     */
    async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
        try {
            this.logger.info('Fetching filter options');

            const response = await apiClient.get<FilterOptions>(
                apiConfig.endpoints.properties.admin.filterOptions
            );

            this.logger.info('Fetched filter options successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch filter options', error);
            throw error;
        }
    }

    // === BULK OPERATIONS (Future Endpoints) === //

    /**
     * Bulk update properties
     * POST /admin/properties/bulk-update (Future Endpoint)
     */
    async bulkUpdateProperties(data: BulkUpdateDto): Promise<ApiResponse<BulkActionResponse>> {
        try {
            this.logger.info(`Bulk updating ${data.propertyIds.length} properties`);

            const response = await apiClient.post<BulkActionResponse>(
                apiConfig.endpoints.properties.admin.bulkUpdate,
                data
            );

            this.logger.info('Bulk update completed successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to bulk update properties', error);
            throw error;
        }
    }

    /**
     * Bulk assign tenants
     * POST /admin/properties/bulk-assign-tenants (Future Endpoint)
     */
    async bulkAssignTenants(data: BulkAssignmentDto): Promise<ApiResponse<BulkActionResponse>> {
        try {
            this.logger.info(`Bulk assigning tenants to ${data.assignments.length} properties`);

            const response = await apiClient.post<BulkActionResponse>(
                apiConfig.endpoints.properties.admin.bulkAssignTenants,
                data
            );

            this.logger.info('Bulk tenant assignment completed successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to bulk assign tenants', error);
            throw error;
        }
    }

    // === EXPORT/IMPORT (Future Endpoints) === //

    /**
     * Export properties
     * GET /admin/properties/export (Future Endpoint)
     */
    async exportProperties(params: ExportParams): Promise<Blob> {
        try {
            this.logger.info('Exporting properties', params);

            const queryParams = this.buildQueryParams(params);
            // responseType parametresini kaldır
            const response = await apiClient.get(
                `${apiConfig.endpoints.properties.admin.export}${queryParams}`
            );

            this.logger.info('Properties exported successfully');
            return response.data;
        } catch (error) {
            this.logger.error('Failed to export properties', error);
            throw error;
        }
    }

    /**
     * Import properties
     * POST /admin/properties/import (Future Endpoint)
     */
    async importProperties(
        file: File,
        options: { updateExisting: boolean; skipErrors: boolean }
    ): Promise<ApiResponse<ImportResult>> {
        try {
            this.logger.info('Importing properties', { fileName: file.name, options });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('options', JSON.stringify(options));

            // headers parametresini kaldır
            const response = await apiClient.post<ImportResult>(
                apiConfig.endpoints.properties.admin.import,
                formData
            );

            this.logger.info('Properties imported successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to import properties', error);
            throw error;
        }
    }

    // === MAINTENANCE MANAGEMENT (Future Endpoints) === //

    /**
     * Set property to maintenance
     * POST /admin/properties/{id}/maintenance (Future Endpoint)
     */
    async setPropertyMaintenance(id: string, data: CreateMaintenanceDto): Promise<ApiResponse<MaintenanceRecord>> {
        try {
            this.logger.info(`Setting property ${id} to maintenance`, data);

            const response = await apiClient.post<MaintenanceRecord>(
                apiConfig.endpoints.properties.admin.setMaintenance(id),
                data
            );

            this.logger.info('Property set to maintenance successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to set property ${id} to maintenance`, error);
            throw error;
        }
    }

    /**
     * Complete property maintenance
     * DELETE /admin/properties/{id}/maintenance (Future Endpoint)
     */
    async completePropertyMaintenance(id: string, data: CompleteMaintenanceDto): Promise<ApiResponse<Property>> {
        try {
            this.logger.info(`Completing maintenance for property ${id}`, data);

            // data parametresini kaldır
            const response = await apiClient.delete<Property>(
                apiConfig.endpoints.properties.admin.completeMaintenance(id)
            );

            this.logger.info('Property maintenance completed successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to complete maintenance for property ${id}`, error);
            throw error;
        }
    }

    // === UTILITY METHODS === //

    /**
     * Calculate occupancy rate
     */
    calculateOccupancyRate(occupied: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((occupied / total) * 100);
    }

    /**
     * Format property display name
     */
    formatPropertyDisplayName(property: Property): string {
        const parts = [];
        if (property.blockNumber) parts.push(property.blockNumber);
        if (property.propertyNumber) parts.push(property.propertyNumber);
        if (parts.length === 0) parts.push(property.name);
        return parts.join('-');
    }

    /**
     * Get status display info
     */
    getStatusInfo(status: Property['status']) {
        const statusConfig = {
            AVAILABLE: { label: 'Boş', color: 'blue' },
            OCCUPIED: { label: 'Dolu', color: 'green' },
            UNDER_MAINTENANCE: { label: 'Bakım', color: 'orange' },
            RESERVED: { label: 'Rezerve', color: 'purple' },
        };
        return statusConfig[status] || { label: status, color: 'gray' };
    }

    /**
     * Get type display info
     */
    getTypeInfo(type: Property['type']) {
        const typeConfig = {
            RESIDENCE: { label: 'Daire', icon: 'Building' },
            VILLA: { label: 'Villa', icon: 'Home' },
            COMMERCIAL: { label: 'Ticari', icon: 'Store' },
            OFFICE: { label: 'Ofis', icon: 'Briefcase' },
        };
        return typeConfig[type] || { label: type, icon: 'Building' };
    }

    /**
     * Get resident count
     * GET /admin/properties/resident/count
     */
    async getResidentCount(): Promise<number> {
        try {
            this.logger.info('Fetching resident count');
            const response = await apiClient.get(apiConfig.endpoints.properties.admin.residentCount);
            
            // Handle different response structures
            if (response.data && typeof response.data.count === 'number') {
                return response.data.count;
            } else if (response.data && response.data.data && typeof response.data.data.count === 'number') {
                return response.data.data.count;
            } else {
                this.logger.warn('Unexpected response structure for resident count:', response.data);
                return 0;
            }
        } catch (error) {
            this.logger.error('Failed to fetch resident count, using fallback:', error);
            // Fallback: calculate from main properties list
            try {
                const properties = await this.getAllProperties({ limit: 1000 });
                return properties.data.filter(p => p.type === 'RESIDENCE').length;
            } catch (fallbackError) {
                this.logger.error('Fallback calculation also failed:', fallbackError);
                return 0;
            }
        }
    }

    /**
     * Get villa count
     * GET /admin/properties/villa/count
     */
    async getVillaCount(): Promise<number> {
        try {
            this.logger.info('Fetching villa count');
            const response = await apiClient.get(apiConfig.endpoints.properties.admin.villaCount);
            
            // Handle different response structures
            if (response.data && typeof response.data.count === 'number') {
                return response.data.count;
            } else if (response.data && response.data.data && typeof response.data.data.count === 'number') {
                return response.data.data.count;
            } else {
                this.logger.warn('Unexpected response structure for villa count:', response.data);
                return 0;
            }
        } catch (error) {
            this.logger.error('Failed to fetch villa count, using fallback:', error);
            // Fallback: calculate from main properties list
            try {
                const properties = await this.getAllProperties({ limit: 1000 });
                return properties.data.filter(p => p.type === 'VILLA').length;
            } catch (fallbackError) {
                this.logger.error('Fallback calculation also failed:', fallbackError);
                return 0;
            }
        }
    }

    /**
     * Get available count
     * GET /admin/properties/available/count
     */
    async getAvailableCount(): Promise<number> {
        try {
            this.logger.info('Fetching available count');
            const response = await apiClient.get(apiConfig.endpoints.properties.admin.availableCount);
            
            // Handle different response structures
            if (response.data && typeof response.data.count === 'number') {
                return response.data.count;
            } else if (response.data && response.data.data && typeof response.data.data.count === 'number') {
                return response.data.data.count;
            } else {
                this.logger.warn('Unexpected response structure for available count:', response.data);
                return 0;
            }
        } catch (error) {
            this.logger.error('Failed to fetch available count, using fallback:', error);
            // Fallback: calculate from main properties list
            try {
                const properties = await this.getAllProperties({ limit: 1000 });
                return properties.data.filter(p => p.status === 'AVAILABLE').length;
            } catch (fallbackError) {
                this.logger.error('Fallback calculation also failed:', fallbackError);
                return 0;
            }
        }
    }

    /**
     * Get total properties count
     * GET /admin/properties/count
     */
    async getAllPropertiesCount(): Promise<number> {
        try {
            this.logger.info('Fetching total properties count');
            const response = await apiClient.get(apiConfig.endpoints.properties.admin.totalCount);
            this.logger.info('Total properties count response:', response.data);
            
            // Handle different response structures
            if (response.data && typeof response.data.count === 'number') {
                return response.data.count;
            } else if (response.data && response.data.data && typeof response.data.data.count === 'number') {
                return response.data.data.count;
            } else {
                this.logger.warn('Unexpected response structure for total properties count:', response.data);
                return 0;
            }
        } catch (error) {
            this.logger.error('Failed to fetch total properties count, using fallback:', error);
            // Fallback: calculate from main properties list
            try {
                const properties = await this.getAllProperties({ limit: 1000 });
                return properties.data.length;
            } catch (fallbackError) {
                this.logger.error('Fallback calculation also failed:', fallbackError);
                return 0;
            }
        }
    }

    /**
     * Get assigned properties count
     * GET /admin/properties/assigned/count
     */
    async getAssignedPropertiesCount(): Promise<number> {
        try {
            this.logger.info('Fetching assigned properties count');
            const response = await apiClient.get(apiConfig.endpoints.properties.admin.assignedCount);
            this.logger.info('Assigned properties count response:', response.data);
            
            // Handle different response structures
            if (response.data && typeof response.data.count === 'number') {
                return response.data.count;
            } else if (response.data && response.data.data && typeof response.data.data.count === 'number') {
                return response.data.data.count;
            } else {
                this.logger.warn('Unexpected response structure for assigned properties count:', response.data);
                return 0;
            }
        } catch (error) {
            this.logger.error('Failed to fetch assigned properties count, using fallback:', error);
            // Fallback: calculate from main properties list
            try {
                const properties = await this.getAllProperties({ limit: 1000 });
                return properties.data.filter(p => p.status === 'OCCUPIED').length;
            } catch (fallbackError) {
                this.logger.error('Fallback calculation also failed:', fallbackError);
                return 0;
            }
        }
    }
}

export default new PropertyService();
export { PropertyService };