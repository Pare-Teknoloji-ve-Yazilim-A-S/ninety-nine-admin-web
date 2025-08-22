// Resident Service - Mobile/Resident Panel - Application Layer
import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import {
    Resident,
    CreateResidentDto,
    UpdateResidentDto,
    ResidentFilterParams,
    AvatarUploadResponse,
    ResidentListResponse,
    PendingResidentsResponse,
    ResidentApprovalDto,
    ResidentApprovalResponse,
    BulkActionDto,
    BulkActionResponse,
    CreateResidentRequest // yeni tip eklendi
} from './types/resident.types';
import { ApiResponse, PaginatedResponse } from './core/types';

class ResidentService extends BaseService<Resident, CreateResidentDto, UpdateResidentDto> {
    getResidentStats() {
        throw new Error('Method not implemented.');
    }
    protected baseEndpoint = apiConfig.endpoints.residents.admin.base;

    constructor() {
        super('ResidentService');
    }

    // === RESIDENT PROFILE MANAGEMENT === //

    /**
     * Get current resident profile
     * GET /auth/me
     */
    async getMyProfile(): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info('Fetching current resident profile');

            const response = await apiClient.get<Resident>(apiConfig.endpoints.auth.me);

            this.logger.info('Resident profile fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch resident profile', error);
            throw error;
        }
    }

    /**
     * Update resident profile
     * PUT /users/{id}
     */
    async updateMyProfile(id: string, data: UpdateResidentDto): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Updating resident profile with ID: ${id}`, data);

            return await this.update(id, data);
        } catch (error) {
            this.logger.error(`Failed to update resident profile with ID: ${id}`, error);
            throw error;
        }
    }

    // === AVATAR MANAGEMENT === //

    /**
     * Upload resident avatar
     * PUT /users/{id}/upload-avatar
     */
    async uploadAvatar(
        id: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<AvatarUploadResponse>> {
        try {
            this.logger.info(`Uploading avatar for resident ID: ${id}`);

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await apiClient.put<AvatarUploadResponse>(
                apiConfig.endpoints.residents.mobile.uploadAvatar(id),
                formData
            );

            this.logger.info('Avatar uploaded successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to upload avatar', error);
            throw error;
        }
    }

    /**
     * Delete resident avatar
     * DELETE /users/{id}/avatar (if available)
     */
    async deleteAvatar(id: string): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Deleting avatar for resident ID: ${id}`);

            const response = await apiClient.delete<Resident>(apiConfig.endpoints.residents.mobile.deleteAvatar(id));

            this.logger.info('Avatar deleted successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to delete avatar', error);
            throw error;
        }
    }

    // === RESIDENT LISTING (Admin) === //

    /**
     * Get all residents with pagination and filtering (admin)
     * GET /admin/users?type=resident
     */
    async getAllResidents(params?: ResidentFilterParams): Promise<PaginatedResponse<Resident>> {
        try {
            this.logger.info('Fetching all residents (admin)', params);

            // type=resident parametresini otomatik olarak ekle
            const residentParams = {
                ...params,
                type: 'resident'
            };

            const queryParams = this.buildQueryParams(residentParams);
            const response = await apiClient.get<ResidentListResponse>(
                `${apiConfig.endpoints.residents.admin.base}${queryParams}`
            );

            // API response yapısını kontrol edelim
            console.log('API Response:', response.data);
            
            // Eğer response.data.users yoksa, response.data'nın kendisi array olabilir
            const users = response.data.users || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(users) ? users.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            this.logger.info(`Fetched ${users.length} residents`);
            return {
                data: users,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error('Failed to fetch residents', error);
            throw error;
        }
    }

    /**
     * Search residents (admin)
     * GET /admin/users (with search parameters)
     */
    async searchResidents(query: string, filters?: ResidentFilterParams): Promise<PaginatedResponse<Resident>> {
        try {
            this.logger.info('Searching residents (admin)', { query, filters });

            const searchParams = {
                search: query,
                ...filters,
            };

            return await this.getAllResidents(searchParams);
        } catch (error) {
            this.logger.error('Failed to search residents', error);
            throw error;
        }
    }

    // === RESIDENT MANAGEMENT (Admin) === //

    /**
     * Get pending residents
     * GET /admin/users/pending-verification?type=resident
     */
    async getPendingResidents(params?: ResidentFilterParams): Promise<PaginatedResponse<Resident>> {
        try {
            this.logger.info('Fetching pending residents', params);

            // type=resident parametresini otomatik olarak ekle
            const residentParams = {
                ...params,
                type: 'resident'
            };

            const queryParams = this.buildQueryParams(residentParams);
            const response = await apiClient.get<PendingResidentsResponse>(
                `${apiConfig.endpoints.residents.admin.pendingVerification}${queryParams}`
            );

            // API response yapısını kontrol edelim
            const users =  response.data || [];
            const pagination = response.data.pagination || {
                total: Array.isArray(users) ? users.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

          
            return {
                data: users,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error('Failed to fetch pending residents', error);
            throw error;
        }
    }

    /**
     * Approve or reject resident
     * PUT /admin/users/{id}/approve
     */
    async approveResident(id: string, data: ResidentApprovalDto): Promise<ApiResponse<ResidentApprovalResponse>> {
        try {
            this.logger.info(`Approving/rejecting resident with ID: ${id}`, data);

            const response = await apiClient.put<ResidentApprovalResponse>(
                apiConfig.endpoints.residents.admin.approve(id),
                data
            );

            this.logger.info('Resident approval processed successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to approve resident with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Bulk actions on residents
     * POST /admin/users/bulk-action
     */
    async bulkAction(data: BulkActionDto): Promise<ApiResponse<BulkActionResponse>> {
        try {
            this.logger.info('Performing bulk action on residents', data);

            const response = await apiClient.post<BulkActionResponse>(
                apiConfig.endpoints.residents.admin.bulkAction,
                data
            );

            this.logger.info('Bulk action completed successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to perform bulk action', error);
            throw error;
        }
    }

    /**
     * Create new resident (admin)
     * POST /admin/users
     */
    async createResident(data: CreateResidentRequest): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info('Creating new resident (admin)', { personalInfo: data.personalInfo });
            const response = await apiClient.post<Resident>(apiConfig.endpoints.residents.admin.base, data);
            this.logger.info('Resident created successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to create resident', error);
            throw error;
        }
    }

    /**
     * Get resident by ID (admin)
     * GET /admin/users/{id}
     */
    async getResidentById(id: string): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Fetching resident with ID: ${id} (admin)`);

            const response = await apiClient.get<Resident>(apiConfig.endpoints.residents.admin.byId(id));

            this.logger.info('Resident fetched successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to fetch resident with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Update resident (admin)
     * PUT /admin/users/{id}
     */
    async updateResident(id: string, data: UpdateResidentDto): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Updating resident with ID: ${id} (admin)`, data);

            const response = await apiClient.put<Resident>(apiConfig.endpoints.residents.admin.byId(id), data);

            this.logger.info('Resident updated successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to update resident with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Delete resident (admin)
     * DELETE /admin/users/{id}
     */
    async deleteResident(id: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting resident with ID: ${id} (admin)`);

            const response = await apiClient.delete<void>(apiConfig.endpoints.residents.admin.byId(id));

            this.logger.info('Resident deleted successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to delete resident with ID: ${id}`, error);
            throw error;
        }
    }

    // === DOCUMENT MANAGEMENT === //

    /**
     * Upload resident documents
     * POST /users/{id}/upload-documents (if available)
     */
    async uploadDocuments(
        id: string,
        documents: File[],
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Uploading ${documents.length} documents for resident ID: ${id}`);

            const formData = new FormData();
            documents.forEach((file, index) => {
                formData.append(`documents[${index}]`, file);
            });

            const response = await apiClient.post<Resident>(
                apiConfig.endpoints.residents.mobile.uploadDocuments(id),
                formData
            );

            this.logger.info('Documents uploaded successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to upload documents', error);
            throw error;
        }
    }

    /**
     * Get resident documents
     * GET /users/{id}/documents (if available)
     */
    async getResidentDocuments(id: string): Promise<ApiResponse<any[]>> {
        try {
            this.logger.info(`Fetching documents for resident ID: ${id}`);

            const response = await apiClient.get<any[]>(apiConfig.endpoints.residents.mobile.documents(id));

            this.logger.info('Documents fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch documents', error);
            throw error;
        }
    }

    /**
     * Delete resident document
     * DELETE /users/{id}/documents/{documentId} (if available)
     */
    async deleteDocument(id: string, documentId: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting document ${documentId} for resident ID: ${id}`);

            const response = await apiClient.delete<void>(apiConfig.endpoints.residents.mobile.deleteDocument(id, documentId));

            this.logger.info('Document deleted successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to delete document', error);
            throw error;
        }
    }

    // === PROPERTY MANAGEMENT === //

    /**
     * Get my properties (as a resident)
     * GET /users/{id}/properties (if available)
     */
    async getMyProperties(id: string): Promise<ApiResponse<any[]>> {
        try {
            this.logger.info(`Fetching properties for resident ID: ${id}`);

            const response = await apiClient.get<any[]>(apiConfig.endpoints.residents.mobile.properties(id));

            this.logger.info('Properties fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch properties', error);
            throw error;
        }
    }

    /**
     * Update property information
     * PUT /users/{id}/property (if available)
     */
    async updateProperty(id: string, propertyData: any): Promise<ApiResponse<Resident>> {
        try {
            this.logger.info(`Updating property for resident ID: ${id}`, propertyData);

            const response = await apiClient.put<Resident>(apiConfig.endpoints.residents.mobile.updateProperty(id), propertyData);

            this.logger.info('Property updated successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to update property', error);
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
}

// Export singleton instance
export const residentService = new ResidentService();
export default residentService; 