// User Service - Application Layer
import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import {
    User,
    CreateUserDto,
    UpdateUserDto,
    UpdateUserPasswordDto,
    UserProfileDto,
    UserFilterParams,
    UserListResponse,
    UserStatsResponse,
    UserRole,
} from './types/user.types';
import { ApiResponse, PaginatedResponse } from './core/types';

class UserService extends BaseService<User, CreateUserDto, UpdateUserDto> {
    protected baseEndpoint = apiConfig.endpoints.user.base;

    constructor() {
        super('UserService');
    }

    // Profile Management
    async getProfile(): Promise<ApiResponse<User>> {
        try {
            this.logger.info('Fetching user profile');

            const response = await apiClient.get<User>(apiConfig.endpoints.user.profile);

            this.logger.info('User profile fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch user profile', error);
            throw error;
        }
    }

    async updateProfile(data: UserProfileDto): Promise<ApiResponse<User>> {
        try {
            this.logger.info('Updating user profile', data);

            const response = await apiClient.put<User>(
                apiConfig.endpoints.user.profile,
                data
            );

            this.logger.info('User profile updated successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to update user profile', error);
            throw error;
        }
    }

    async updatePassword(data: UpdateUserPasswordDto): Promise<ApiResponse<void>> {
        try {
            this.logger.info('Updating user password');

            const response = await apiClient.put<void>(
                apiConfig.endpoints.user.password,
                data
            );

            this.logger.info('User password updated successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to update user password', error);
            throw error;
        }
    }

    // Avatar Management
    async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<User>> {
        try {
            this.logger.info('Uploading user avatar');

            const response = await apiClient.uploadFile<User>(
                apiConfig.endpoints.user.avatar,
                file,
                onProgress
            );

            this.logger.info('User avatar uploaded successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to upload user avatar', error);
            throw error;
        }
    }

    async deleteAvatar(): Promise<ApiResponse<User>> {
        try {
            this.logger.info('Deleting user avatar');

            const response = await apiClient.delete<User>(apiConfig.endpoints.user.avatar);

            this.logger.info('User avatar deleted successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to delete user avatar', error);
            throw error;
        }
    }

    // User Management (Admin)
    async getAllUsers(params?: UserFilterParams): Promise<PaginatedResponse<User>> {
        try {
            this.logger.info('Fetching all users with filters', params);

            return await this.getAll(params);
        } catch (error) {
            this.logger.error('Failed to fetch users', error);
            throw error;
        }
    }

    async getAdminStaff(page: number = 1, limit: number = 5): Promise<any> {
        try {
            this.logger.info('Fetching admin staff members', { page, limit });
            this.logger.info('Using endpoint:', apiConfig.endpoints.admin.adminStaff);
            this.logger.info('Full baseURL:', apiConfig.baseURL);

            // Query parametrelerini ekle
            const queryParams = `?page=${page}&limit=${limit}`;
            const fullEndpoint = `${apiConfig.endpoints.admin.adminStaff}${queryParams}`;
            
            this.logger.info('Requesting URL:', fullEndpoint);
            const response = await apiClient.get(fullEndpoint);
            this.logger.info('Admin staff fetched successfully', {
                dataCount: response?.data?.length || 0,
                pagination: response?.pagination
            });
            
            // apiClient.get zaten response.data döndürüyor
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch admin staff', error);
            
            // Type-safe error handling
            const errorDetails: any = {};
            if (error instanceof Error) {
                errorDetails.message = error.message;
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                errorDetails.status = axiosError.response?.status;
                errorDetails.data = axiosError.response?.data;
                errorDetails.url = axiosError.config?.url;
            }
            
            this.logger.error('Error details:', errorDetails);
            throw error;
        }
    }

    async getAdminStaffCount(): Promise<any> {
        try {
            this.logger.info('Fetching admin staff count');
            const response = await apiClient.get(apiConfig.endpoints.admin.adminStaffCount);
            this.logger.info('Admin staff count fetched successfully', {
                count: response?.data || 0
            });
            return response; // apiClient.get already returns response.data
        } catch (error) {
            this.logger.error('Failed to fetch admin staff count', error);
            
            // Type-safe error handling
            const errorDetails: any = {};
            if (error instanceof Error) {
                errorDetails.message = error.message;
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                errorDetails.status = axiosError.response?.status;
                errorDetails.data = axiosError.response?.data;
                errorDetails.url = axiosError.config?.url;
            }
            
            this.logger.error('Error details:', errorDetails);
            throw error;
        }
    }

    async getUserById(id: string | number): Promise<ApiResponse<User>> {
        try {
            this.logger.info(`Fetching user with ID: ${id}`);

            return await this.getById(id);
        } catch (error) {
            this.logger.error(`Failed to fetch user with ID: ${id}`, error);
            throw error;
        }
    }

    async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
        try {
            this.logger.info('Creating new user', { email: data.email });

            return await this.create(data);
        } catch (error) {
            this.logger.error('Failed to create user', error);
            throw error;
        }
    }

    async updateUser(id: string | number, data: UpdateUserDto): Promise<ApiResponse<User>> {
        try {
            this.logger.info(`Updating user with ID: ${id}`, data);

            return await this.update(id, data);
        } catch (error) {
            this.logger.error(`Failed to update user with ID: ${id}`, error);
            throw error;
        }
    }

    async deleteUser(id: string | number): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting user with ID: ${id}`);

            return await this.delete(id);
        } catch (error) {
            this.logger.error(`Failed to delete user with ID: ${id}`, error);
            throw error;
        }
    }

    // User Activation/Deactivation
    async activateUser(id: string | number): Promise<ApiResponse<User>> {
        try {
            this.logger.info(`Activating user with ID: ${id}`);

            const response = await apiClient.patch<User>(
                `${this.baseEndpoint}/${id}/activate`
            );

            this.logger.info('User activated successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to activate user', error);
            throw error;
        }
    }

    async deactivateUser(id: string | number): Promise<ApiResponse<User>> {
        try {
            this.logger.info(`Deactivating user with ID: ${id}`);

            const response = await apiClient.patch<User>(
                `${this.baseEndpoint}/${id}/deactivate`
            );

            this.logger.info('User deactivated successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to deactivate user', error);
            throw error;
        }
    }

    // Role Management
    async assignRole(userId: string | number, roleId: string): Promise<ApiResponse<User>> {
        try {
            this.logger.info(`Assigning role ${roleId} to user ${userId}`);

            const response = await apiClient.patch<User>(
                `${this.baseEndpoint}/${userId}/role`,
                { roleId }
            );

            this.logger.info('Role assigned successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to assign role', error);
            throw error;
        }
    }

    async removeRole(userId: string | number): Promise<ApiResponse<User>> {
        try {
            this.logger.info(`Removing role from user ${userId}`);

            const response = await apiClient.delete<User>(
                `${this.baseEndpoint}/${userId}/role`
            );

            this.logger.info('Role removed successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to remove role', error);
            throw error;
        }
    }

    // Search & Filter
    async searchUsers(query: string, filters?: UserFilterParams): Promise<PaginatedResponse<User>> {
        try {
            this.logger.info(`Searching users with query: ${query}`, filters);

            return await this.search(query, filters);
        } catch (error) {
            this.logger.error('User search failed', error);
            throw error;
        }
    }

    async filterUsers(filters: UserFilterParams): Promise<PaginatedResponse<User>> {
        try {
            this.logger.info('Filtering users', filters);

            return await this.getAll(filters);
        } catch (error) {
            this.logger.error('User filtering failed', error);
            throw error;
        }
    }

    // Statistics & Analytics
    async getUserStats(): Promise<ApiResponse<UserStatsResponse>> {
        try {
            this.logger.info('Fetching user statistics');

            const response = await apiClient.get<UserStatsResponse>(`${this.baseEndpoint}/stats`);

            this.logger.info('User statistics fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch user statistics', error);
            throw error;
        }
    }

    async getUsersCountByRole(): Promise<ApiResponse<Record<string, number>>> {
        try {
            this.logger.info('Fetching users count by role');

            const response = await apiClient.get<Record<string, number>>(
                `${this.baseEndpoint}/stats/by-role`
            );

            this.logger.info('Users count by role fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch users count by role', error);
            throw error;
        }
    }

    async getActiveUsersCount(): Promise<ApiResponse<number>> {
        try {
            this.logger.info('Fetching active users count');

            const response = await apiClient.get<number>(`${this.baseEndpoint}/stats/active-count`);

            this.logger.info('Active users count fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch active users count', error);
            throw error;
        }
    }

    // Bulk Operations
    async bulkActivateUsers(userIds: (string | number)[]): Promise<ApiResponse<User[]>> {
        try {
            this.logger.info(`Bulk activating ${userIds.length} users`);

            const response = await apiClient.patch<User[]>(
                `${this.baseEndpoint}/bulk/activate`,
                { userIds }
            );

            this.logger.info('Bulk user activation completed');
            return response;
        } catch (error) {
            this.logger.error('Bulk user activation failed', error);
            throw error;
        }
    }

    async bulkDeactivateUsers(userIds: (string | number)[]): Promise<ApiResponse<User[]>> {
        try {
            this.logger.info(`Bulk deactivating ${userIds.length} users`);

            const response = await apiClient.patch<User[]>(
                `${this.baseEndpoint}/bulk/deactivate`,
                { userIds }
            );

            this.logger.info('Bulk user deactivation completed');
            return response;
        } catch (error) {
            this.logger.error('Bulk user deactivation failed', error);
            throw error;
        }
    }

    async bulkAssignRole(userIds: (string | number)[], roleId: string): Promise<ApiResponse<User[]>> {
        try {
            this.logger.info(`Bulk assigning role ${roleId} to ${userIds.length} users`);

            const response = await apiClient.patch<User[]>(
                `${this.baseEndpoint}/bulk/assign-role`,
                { userIds, roleId }
            );

            this.logger.info('Bulk role assignment completed');
            return response;
        } catch (error) {
            this.logger.error('Bulk role assignment failed', error);
            throw error;
        }
    }

    // Export/Import
    async exportUsers(filters?: UserFilterParams): Promise<Blob> {
        try {
            this.logger.info('Exporting users', filters);

            const queryParams = this.buildQueryParams(filters);
            const response = await apiClient.get(`${this.baseEndpoint}/export${queryParams}`, {
                responseType: 'blob'
            } as any);

            this.logger.info('Users export completed');
            return response.data;
        } catch (error) {
            this.logger.error('Users export failed', error);
            throw error;
        }
    }

    async importUsers(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ success: number; errors: any[] }>> {
        try {
            this.logger.info('Importing users from file');

            const response = await apiClient.uploadFile<{ success: number; errors: any[] }>(
                `${this.baseEndpoint}/import`,
                file,
                onProgress
            );

            this.logger.info('Users import completed', response.data);
            return response;
        } catch (error) {
            this.logger.error('Users import failed', error);
            throw error;
        }
    }

    /**
     * Fetch all roles (for admin user management)
     * GET /admin/roles
     */
    async getAllRoles(): Promise<ApiResponse<UserRole[]>> {
        try {
            this.logger.info('Fetching all roles');
            const response = await apiClient.get<UserRole[]>(apiConfig.endpoints.admin.roles);
            this.logger.info('Roles fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch roles', error);
            throw error;
        }
    }

    /**
     * Get active approved residents
     * GET /admin/users/active-approved-residents
     */
    async getActiveApprovedResidents(): Promise<ApiResponse<any[]>> {
        try {
            this.logger.info('Fetching active approved residents');
            const response = await apiClient.get<any[]>(apiConfig.endpoints.admin.activeApprovedResidents);
            this.logger.info('Active approved residents fetched successfully', {
                count: response?.data?.length || 0
            });
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch active approved residents', error);
            throw error;
        }
    }
}

// Export singleton instance
export const userService = new UserService();
export default userService; 