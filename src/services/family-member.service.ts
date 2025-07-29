// Family Member Service - Application Layer
import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { 
    FamilyMember, 
    CreateFamilyMemberDto, 
    UpdateFamilyMemberDto,
    FamilyMemberFilterParams,
    FamilyMembersResponse 
} from './types/family-member.types';
import { ApiResponse } from './core/types';

class FamilyMemberService extends BaseService<FamilyMember, CreateFamilyMemberDto, UpdateFamilyMemberDto> {
    protected baseEndpoint = '/family-members';

    constructor() {
        super('FamilyMemberService');
    }

    /**
     * Get family members for a specific user
     * GET /family-members/users/:userId/family-members
     */
    async getFamilyMembersByUserId(userId: string): Promise<ApiResponse<FamilyMember[]>> {
        try {
            this.logger.info(`Fetching family members for user: ${userId}`);

            const response = await apiClient.get<FamilyMember[]>(
                `/family-members/users/${userId}/family-members`
            );

            this.logger.info(`Fetched ${response.data?.length || 0} family members for user ${userId}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to fetch family members for user ${userId}`, error);
            throw error;
        }
    }

    /**
     * Create a new family member for a user
     * POST /family-members/users/:userId/family-members
     */
    async createFamilyMemberForUser(userId: string, data: CreateFamilyMemberDto): Promise<ApiResponse<FamilyMember>> {
        try {
            this.logger.info(`Creating family member for user: ${userId}`, data);

            const response = await apiClient.post<FamilyMember>(
                `/family-members/users/${userId}/family-members`,
                data
            );

            this.logger.info(`Created family member ${response.data?.id} for user ${userId}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to create family member for user ${userId}`, error);
            throw error;
        }
    }

    /**
     * Update a family member
     * PUT /family-members/:id
     */
    async updateFamilyMember(id: string, data: UpdateFamilyMemberDto): Promise<ApiResponse<FamilyMember>> {
        try {
            this.logger.info(`Updating family member: ${id}`, data);

            const response = await apiClient.put<FamilyMember>(
                `/family-members/${id}`,
                data
            );

            this.logger.info(`Updated family member ${id}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to update family member ${id}`, error);
            throw error;
        }
    }

    /**
     * Delete a family member
     * DELETE /family-members/:id
     */
    async deleteFamilyMember(id: string): Promise<ApiResponse<void>> {
        try {
            this.logger.info(`Deleting family member: ${id}`);

            const response = await apiClient.delete<void>(`/family-members/${id}`);

            this.logger.info(`Deleted family member ${id}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to delete family member ${id}`, error);
            throw error;
        }
    }

    /**
     * Get a specific family member by ID
     * GET /family-members/:id
     */
    async getFamilyMemberById(id: string): Promise<ApiResponse<FamilyMember>> {
        try {
            this.logger.info(`Fetching family member: ${id}`);

            const response = await apiClient.get<FamilyMember>(`/family-members/${id}`);

            this.logger.info(`Fetched family member ${id}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to fetch family member ${id}`, error);
            throw error;
        }
    }
}

// Export singleton instance
export const familyMemberService = new FamilyMemberService(); 