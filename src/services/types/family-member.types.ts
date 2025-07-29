// Family Member Types for API Integration
export interface FamilyMember {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    age: number;
    phone?: string;
    email?: string;
    identityNumber?: string;
    isMinor: boolean;
    profileImage?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFamilyMemberDto {
    firstName: string;
    lastName: string;
    relationship: string;
    age: number;
    phone?: string;
    email?: string;
    identityNumber?: string;
}

export interface UpdateFamilyMemberDto extends Partial<CreateFamilyMemberDto> {}

export interface FamilyMemberFilterParams {
    userId?: string;
    relationship?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export interface FamilyMembersResponse {
    data: FamilyMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 