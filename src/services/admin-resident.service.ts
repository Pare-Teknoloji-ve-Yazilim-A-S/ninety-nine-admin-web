// Admin Resident Service - Application Layer
import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import {
    Resident,
    CreateResidentDto,
    UpdateResidentDto,
    ResidentApprovalDto,
    BulkActionDto,
    ResidentFilterParams,
    ResidentListResponse,
    PendingResidentsResponse,
    ResidentApprovalResponse,
    BulkActionResponse,
    ResidentStatsResponse,
    ResidentSearchParams,
    ResidentSearchResponse,
} from './types/resident.types';
import { ApiResponse, PaginatedResponse } from './core/types';

class AdminResidentService extends BaseService<Resident, CreateResidentDto, UpdateResidentDto> {
    protected baseEndpoint = apiConfig.endpoints.residents.admin.base;

    constructor() {
        super('AdminResidentService');
    }

    // === RESIDENT LISTING & FILTERING === //

    /**
     * Get all residents with pagination and filtering
     * GET /admin/users
     */
    async getAllResidents(params?: ResidentFilterParams): Promise<PaginatedResponse<Resident>> {
        try {
            this.logger.info('Fetching all residents', params);

            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<ResidentListResponse>(
                `${this.baseEndpoint}${queryParams}`
            );

            this.logger.info(`Fetched ${response.data.users.length} residents`);
            return {
                data: response.data.users,
                total: response.pagination.total,
                page: response.pagination.page,
                limit: response.pagination.limit,
                totalPages: response.pagination.totalPages,
                pagination: response.pagination,
            };
        } catch (error) {
            this.logger.error('Failed to fetch residents', error);
            throw error;
        }
    }

    /**
     * Get pending verification residents
     * GET /admin/users/pending-verification
     */
    async getPendingResidents(params?: Pick<ResidentFilterParams, 'page' | 'limit' | 'orderColumn' | 'orderBy'>): Promise<PaginatedResponse<Resident>> {
        try {
            this.logger.info('Fetching pending residents', params);

            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<PendingResidentsResponse>(
                `${apiConfig.endpoints.residents.admin.pendingVerification}${queryParams}`
            );

            return {
                data: response.data, // <-- düzeltildi
                total: response.pagination.total,
                page: response.pagination.page,
                limit: response.pagination.limit,
                totalPages: response.pagination.totalPages,
                pagination: response.pagination,
            };
        } catch (error) {
            this.logger.error('Failed to fetch pending residents', error);
            throw error;
        }
    }

    /**
     * Search residents with advanced filters
     * GET /admin/users (with search parameters)
     */
    async searchResidents(params: ResidentSearchParams): Promise<PaginatedResponse<Resident>> {
        try {
            this.logger.info('Searching residents', params);

            const searchParams = {
                search: params.query,
                ...params.filters,
            };

            return await this.getAllResidents(searchParams);
        } catch (error) {
            this.logger.error('Failed to search residents', error);
            throw error;
        }
    }

    // === RESIDENT MANAGEMENT === //

    /**
     * Create new resident
     * POST /admin/users
     */
    async createResident(data: CreateResidentDto): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info('Creating new resident', { email: data.email });

            return await this.create(data);
        } catch (error) {
            this.logger.error('Failed to create resident', error);
            throw error;
        }
    }

    /**
     * Get resident by ID
     * GET /admin/users/{id}
     */
    async getResidentById(id: string): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Fetching resident with ID: ${id}`);

            return await this.getById(id);
        } catch (error) {
            this.logger.error(`Failed to fetch resident with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Update resident
     * PUT /admin/users/{id}
     */
    async updateResident(id: string, data: UpdateResidentDto): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Updating resident with ID: ${id}`, data);

            return await this.update(id, data);
        } catch (error) {
            this.logger.error(`Failed to update resident with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Delete resident
     * DELETE /admin/users/{id}
     */
    async deleteResident(id: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting resident with ID: ${id}`);

            return await this.delete(id);
        } catch (error) {
            this.logger.error(`Failed to delete resident with ID: ${id}`, error);
            throw error;
        }
    }

    // === APPROVAL MANAGEMENT === //

    /**
     * Approve or reject resident registration
     * PUT /admin/users/{id}/approve
     */
    async approveResident(id: string, data: ResidentApprovalDto): Promise<ApiResponse<ResidentApprovalResponse>> {
        try {


            const response = await apiClient.put<ResidentApprovalResponse>(
                apiConfig.endpoints.residents.admin.approve(id),
                data
            );


            return response;
        } catch (error) {

            throw error;
        }
    }

    /**
     * Bulk approve residents
     */
    async bulkApproveResidents(
        residentIds: string[],
        data: {
            reason?: string;
            assignedRole?: string;
            initialMembershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
        }
    ): Promise<ApiResponse<BulkActionResponse>> {
        try {
            this.logger.info(`Bulk approving ${residentIds.length} residents`);

            const bulkData: BulkActionDto = {
                action: 'approve',
                userIds: residentIds,
                reason: data.reason,
                assignedRole: data.assignedRole as 'admin' | 'resident' | 'tenant',
                membershipTier: data.initialMembershipTier,
            };

            return await this.bulkAction(bulkData);
        } catch (error) {
            this.logger.error('Failed to bulk approve residents', error);
            throw error;
        }
    }

    /**
     * Bulk reject residents
     */
    async bulkRejectResidents(residentIds: string[], reason?: string): Promise<ApiResponse<BulkActionResponse>> {
        try {
            this.logger.info(`Bulk rejecting ${residentIds.length} residents`);

            const bulkData: BulkActionDto = {
                action: 'REJECT',
                residentIds,
                data: { reason },
            };

            return await this.bulkAction(bulkData);
        } catch (error) {
            this.logger.error('Failed to bulk reject residents', error);
            throw error;
        }
    }

    // === BULK OPERATIONS === //

    /**
     * Perform bulk action on residents
     * POST /admin/users/bulk-action
     */
    async bulkAction(data: BulkActionDto): Promise<ApiResponse<BulkActionResponse>> {
        try {
            this.logger.info(`Performing bulk action: ${data.action} on ${data.residentIds.length} residents`);

            const response = await apiClient.post<BulkActionResponse>(
                apiConfig.endpoints.residents.admin.bulkAction,
                data
            );

            this.logger.info(`Bulk action completed. Success: ${response.data.successCount}, Errors: ${response.data.errorCount}`);
            return response;
        } catch (error) {
            this.logger.error('Failed to perform bulk action', error);
            throw error;
        }
    }

    /**
     * Bulk activate residents
     */
    async bulkActivateResidents(residentIds: string[]): Promise<ApiResponse<BulkActionResponse>> {
        return await this.bulkAction({
            action: 'ACTIVATE',
            residentIds,
        });
    }

    /**
     * Bulk deactivate residents
     */
    async bulkDeactivateResidents(residentIds: string[]): Promise<ApiResponse<BulkActionResponse>> {
        return await this.bulkAction({
            action: 'DEACTIVATE',
            residentIds,
        });
    }

    /**
     * Bulk delete residents
     */
    async bulkDeleteResidents(residentIds: string[]): Promise<ApiResponse<BulkActionResponse>> {
        return await this.bulkAction({
            action: 'DELETE',
            residentIds,
        });
    }

    /**
     * Bulk assign role to residents
     */
    async bulkAssignRole(residentIds: string[], roleId: string): Promise<ApiResponse<BulkActionResponse>> {
        return await this.bulkAction({
            action: 'ASSIGN_ROLE',
            residentIds,
            data: { roleId },
        });
    }

    /**
     * Bulk update membership tier
     */
    async bulkUpdateMembershipTier(residentIds: string[], membershipTier: 'GOLD' | 'SILVER' | 'STANDARD'): Promise<ApiResponse<BulkActionResponse>> {
        return await this.bulkAction({
            action: 'UPDATE_MEMBERSHIP',
            residentIds,
            data: { membershipTier },
        });
    }

    // === STATISTICS & ANALYTICS === //

    /**
     * Get resident statistics
     */
    async getResidentStats(): Promise<ApiResponse<ResidentStatsResponse>> {
        try {
            this.logger.info('Fetching resident statistics');

            const response = await apiClient.get<ResidentStatsResponse>(apiConfig.endpoints.residents.admin.stats);

            this.logger.info('Resident statistics fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch resident statistics', error);
            throw error;
        }
    }

    // === DOCUMENT MANAGEMENT === //

    /**
     * Get resident's national ID document
     * GET /admin/users/{id}/documents/national_id
     */
    async getNationalIdDocument(id: string): Promise<ApiResponse<any>> {
        try {
            this.logger.info(`Fetching national ID document for resident ID: ${id}`);

            const response = await apiClient.get<any>(
                apiConfig.endpoints.residents.admin.nationalIdDocument(id)
            );

            this.logger.info('National ID document fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch national ID document', error);
            throw error;
        }
    }

    /**
     * Get resident's ownership document
     * GET /admin/users/{id}/documents/ownership_document
     */
    async getOwnershipDocument(id: string): Promise<ApiResponse<any>> {
        try {
            this.logger.info(`Fetching ownership document for resident ID: ${id}`);

            const response = await apiClient.get<any>(
                apiConfig.endpoints.residents.admin.ownershipDocument(id)
            );

            this.logger.info('Ownership document fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch ownership document', error);
            throw error;
        }
    }

    // === FILTERING HELPERS === //

    /**
     * Get residents by status
     */
    async getResidentsByStatus(status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'SUSPENDED', params?: Omit<ResidentFilterParams, 'status'>): Promise<PaginatedResponse<Resident>> {
        return await this.getAllResidents({ ...params, status });
    }

    /**
     * Get residents by membership tier
     */
    async getResidentsByMembershipTier(membershipTier: 'GOLD' | 'SILVER' | 'STANDARD', params?: Omit<ResidentFilterParams, 'membershipTier'>): Promise<PaginatedResponse<Resident>> {
        return await this.getAllResidents({ ...params, membershipTier });
    }

    /**
     * Get residents by role
     */
    async getResidentsByRole(role: 'admin' | 'resident' | 'tenant', params?: Omit<ResidentFilterParams, 'role'>): Promise<PaginatedResponse<Resident>> {
        return await this.getAllResidents({ ...params, role });
    }

    /**
     * Get residents by property (block/apartment)
     */
    async getResidentsByProperty(block?: string, apartment?: string, params?: Omit<ResidentFilterParams, 'block' | 'apartment'>): Promise<PaginatedResponse<Resident>> {
        return await this.getAllResidents({ ...params, block, apartment });
    }

    /**
     * Get residents by ownership type
     */
    async getResidentsByOwnershipType(ownershipType: 'owner' | 'tenant', params?: Omit<ResidentFilterParams, 'ownershipType'>): Promise<PaginatedResponse<Resident>> {
        return await this.getAllResidents({ ...params, ownershipType });
    }

    /**
     * Get residents by verification status
     */
    async getResidentsByVerificationStatus(verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED', params?: Omit<ResidentFilterParams, 'verificationStatus'>): Promise<PaginatedResponse<Resident>> {
        return await this.getAllResidents({ ...params, verificationStatus });
    }
}

// Export singleton instance
export const adminResidentService = new AdminResidentService();
export default adminResidentService; 