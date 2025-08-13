// Announcement Service - Application Layer
import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import {
    Announcement,
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
    AnnouncementFilterParams,
    AnnouncementListResponse,
    AnnouncementStats,
    AnnouncementBulkActionDto,
    AnnouncementBulkActionResponse,
    AnnouncementImageUploadResponse,
    AnnouncementStatus,
    AnnouncementType,
} from './types/announcement.types';
import { ApiResponse, PaginatedResponse } from './core/types';

class AnnouncementService extends BaseService<Announcement, CreateAnnouncementDto, UpdateAnnouncementDto> {
    protected baseEndpoint = '/admin/announcements';

    constructor() {
        super('AnnouncementService');
    }

    // === BASIC CRUD OPERATIONS === //

    /**
     * Get all announcements with pagination and filtering
     * GET /admin/announcements
     */
    async getAllAnnouncements(params?: AnnouncementFilterParams): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info('Fetching all announcements', params);

            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}${queryParams}`
            );

            // Handle different response structures
            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            this.logger.info(`Fetched ${announcements.length} announcements`);
            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error('Failed to fetch announcements', error);
            throw error;
        }
    }

    /**
     * Get announcement by ID
     * GET /admin/announcements/{id}
     */
    async getAnnouncementById(id: string): Promise<ApiResponse<Announcement>> {
        try {
            this.logger.info(`Fetching announcement with ID: ${id}`);
            const response = await apiClient.get<Announcement>(`${this.baseEndpoint}/${id}`);
            this.logger.info('Announcement fetched successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to fetch announcement with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Create new announcement
     * POST /admin/announcements
     */
    async createAnnouncement(data: CreateAnnouncementDto): Promise<ApiResponse<Announcement>> {
        try {
            this.logger.info('Creating new announcement', { title: data.title, type: data.type });
            const response = await apiClient.post<Announcement>(this.baseEndpoint, data);
            this.logger.info('Announcement created successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to create announcement', error);
            throw error;
        }
    }

    /**
     * Update announcement
     * PUT /admin/announcements/{id}
     */
    async updateAnnouncement(id: string, data: UpdateAnnouncementDto): Promise<ApiResponse<Announcement>> {
        try {
            this.logger.info(`Updating announcement with ID: ${id}`, { title: data.title });
            const response = await apiClient.put<Announcement>(`${this.baseEndpoint}/${id}`, data);
            this.logger.info('Announcement updated successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to update announcement with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Delete announcement
     * DELETE /admin/announcements/{id}
     */
    async deleteAnnouncement(id: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting announcement with ID: ${id}`);
            const response = await apiClient.delete<void>(`${this.baseEndpoint}/${id}`);
            this.logger.info('Announcement deleted successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to delete announcement with ID: ${id}`, error);
            throw error;
        }
    }

    // === SPECIALIZED ENDPOINTS === //

    /**
     * Get active announcements
     * GET /admin/announcements/active
     */
    async getActiveAnnouncements(params?: AnnouncementFilterParams): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info('Fetching active announcements', params);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}/active${queryParams}`
            );

            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error('Failed to fetch active announcements', error);
            throw error;
        }
    }

    /**
     * Get expired announcements
     * GET /admin/announcements/expired
     */
    async getExpiredAnnouncements(params?: AnnouncementFilterParams): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info('Fetching expired announcements', params);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}/expired${queryParams}`
            );

            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error('Failed to fetch expired announcements', error);
            throw error;
        }
    }

    /**
     * Get emergency announcements
     * GET /admin/announcements/emergency
     */
    async getEmergencyAnnouncements(params?: AnnouncementFilterParams): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info('Fetching emergency announcements', params);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}/emergency${queryParams}`
            );

            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error('Failed to fetch emergency announcements', error);
            throw error;
        }
    }

    /**
     * Get announcements by status
     * GET /admin/announcements/status/{status}
     */
    async getAnnouncementsByStatus(status: AnnouncementStatus, params?: Omit<AnnouncementFilterParams, 'status'>): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info(`Fetching announcements with status: ${status}`, params);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}/status/${status}${queryParams}`
            );

            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error(`Failed to fetch announcements with status: ${status}`, error);
            throw error;
        }
    }

    /**
     * Get announcements by property
     * GET /admin/announcements/property/{propertyId}
     */
    async getAnnouncementsByProperty(propertyId: string, params?: Omit<AnnouncementFilterParams, 'propertyId'>): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info(`Fetching announcements for property: ${propertyId}`, params);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}/property/${propertyId}${queryParams}`
            );

            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error(`Failed to fetch announcements for property: ${propertyId}`, error);
            throw error;
        }
    }

    /**
     * Get announcements by user
     * GET /admin/announcements/user/{userId}
     */
    async getAnnouncementsByUser(userId: string, params?: Omit<AnnouncementFilterParams, 'userId'>): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info(`Fetching announcements for user: ${userId}`, params);
            const queryParams = this.buildQueryParams(params);
            const response = await apiClient.get<AnnouncementListResponse>(
                `${this.baseEndpoint}/user/${userId}${queryParams}`
            );

            const announcements = response.data.data || response.data || [];
            const pagination = response.data.pagination || response.pagination || {
                total: Array.isArray(announcements) ? announcements.length : 0,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: 1
            };

            return {
                data: announcements,
                pagination: pagination,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages
            };
        } catch (error) {
            this.logger.error(`Failed to fetch announcements for user: ${userId}`, error);
            throw error;
        }
    }

    // === ACTION ENDPOINTS === //

    /**
     * Publish announcement
     * PUT /admin/announcements/{id}/publish
     */
    async publishAnnouncement(id: string): Promise<ApiResponse<Announcement>> {
        try {
            this.logger.info(`Publishing announcement with ID: ${id}`);
            const response = await apiClient.put<Announcement>(`${this.baseEndpoint}/${id}/publish`, {});
            this.logger.info('Announcement published successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to publish announcement with ID: ${id}`, error);
            throw error;
        }
    }

    /**
     * Archive announcement
     * PUT /admin/announcements/{id}/archive
     */
    async archiveAnnouncement(id: string): Promise<ApiResponse<Announcement>> {
        try {
            this.logger.info(`Archiving announcement with ID: ${id}`);
            const response = await apiClient.put<Announcement>(`${this.baseEndpoint}/${id}/archive`, {});
            this.logger.info('Announcement archived successfully');
            return response;
        } catch (error) {
            this.logger.error(`Failed to archive announcement with ID: ${id}`, error);
            throw error;
        }
    }

    // === BULK OPERATIONS === //

    /**
     * Bulk operations on announcements
     * POST /admin/announcements/bulk-action
     */
    async bulkAction(data: AnnouncementBulkActionDto): Promise<ApiResponse<AnnouncementBulkActionResponse>> {
        try {
            this.logger.info('Performing bulk action on announcements', data);
            const response = await apiClient.post<AnnouncementBulkActionResponse>(
                `${this.baseEndpoint}/bulk-action`,
                data
            );
            this.logger.info('Bulk action completed successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to perform bulk action', error);
            throw error;
        }
    }

    // === IMAGE UPLOAD === //

    /**
     * Upload image for announcement
     * POST /admin/announcements/{id}/upload-image
     */
    async uploadAnnouncementImage(
        id: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<AnnouncementImageUploadResponse>> {
        try {
            this.logger.info(`Uploading image for announcement ID: ${id}`);

            const formData = new FormData();
            formData.append('image', file);

            const response = await apiClient.uploadFile<AnnouncementImageUploadResponse>(
                `${this.baseEndpoint}/${id}/upload-image`,
                file,
                onProgress
            );

            this.logger.info('Image uploaded successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to upload image', error);
            throw error;
        }
    }

    // === SEARCH FUNCTIONALITY === //

    /**
     * Search announcements
     * GET /admin/announcements/search
     */
    async searchAnnouncements(query: string, filters?: AnnouncementFilterParams): Promise<PaginatedResponse<Announcement>> {
        try {
            this.logger.info('Searching announcements', { query, filters });

            const searchParams = {
                search: query,
                ...filters,
            };

            return await this.getAllAnnouncements(searchParams);
        } catch (error) {
            this.logger.error('Failed to search announcements', error);
            throw error;
        }
    }

    // === STATISTICS === //

    /**
     * Get announcement statistics
     * GET /admin/announcements/stats
     */
    async getAnnouncementStats(): Promise<ApiResponse<AnnouncementStats>> {
        try {
            this.logger.info('Fetching announcement statistics');
            const response = await apiClient.get<AnnouncementStats>(`${this.baseEndpoint}/stats`);
            this.logger.info('Statistics fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch announcement statistics', error);
            throw error;
        }
    }

  /**
   * Count endpoints - API-99CLUB
   * GET /admin/announcements/count/*
   */
  async getTotalCount(): Promise<number> {
    const res = await apiClient.get<{ data: { count: number } }>(`${this.baseEndpoint}/count/total`);
    return res.data?.count ?? 0;
  }

  async getEmergencyCount(): Promise<number> {
    const res = await apiClient.get<{ data: { count: number } }>(`${this.baseEndpoint}/count/emergency`);
    return res.data?.count ?? 0;
  }

  async getPublishedCount(): Promise<number> {
    const res = await apiClient.get<{ data: { count: number } }>(`${this.baseEndpoint}/count/published`);
    return res.data?.count ?? 0;
  }

  async getExpiringIn1dCount(): Promise<number> {
    const res = await apiClient.get<{ data: { count: number } }>(`${this.baseEndpoint}/count/expiring-in-1d`);
    return res.data?.count ?? 0;
  }

    // === CONVENIENCE METHODS === //

    /**
     * Get announcements by type
     */
    async getAnnouncementsByType(type: AnnouncementType, params?: Omit<AnnouncementFilterParams, 'type'>): Promise<PaginatedResponse<Announcement>> {
        return await this.getAllAnnouncements({ ...params, type });
    }

    /**
     * Get pinned announcements
     */
    async getPinnedAnnouncements(params?: Omit<AnnouncementFilterParams, 'isPinned'>): Promise<PaginatedResponse<Announcement>> {
        return await this.getAllAnnouncements({ ...params, isPinned: true });
    }

    /**
     * Get draft announcements
     */
    async getDraftAnnouncements(params?: Omit<AnnouncementFilterParams, 'status'>): Promise<PaginatedResponse<Announcement>> {
        return await this.getAnnouncementsByStatus(AnnouncementStatus.DRAFT, params);
    }

    /**
     * Get published announcements
     */
    async getPublishedAnnouncements(params?: Omit<AnnouncementFilterParams, 'status'>): Promise<PaginatedResponse<Announcement>> {
        return await this.getAnnouncementsByStatus(AnnouncementStatus.PUBLISHED, params);
    }

    /**
     * Get archived announcements
     */
    async getArchivedAnnouncements(params?: Omit<AnnouncementFilterParams, 'status'>): Promise<PaginatedResponse<Announcement>> {
        return await this.getAnnouncementsByStatus(AnnouncementStatus.ARCHIVED, params);
    }
}

// Export singleton instance
export const announcementService = new AnnouncementService();
export default announcementService;