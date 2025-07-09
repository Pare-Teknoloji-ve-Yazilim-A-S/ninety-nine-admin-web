// Resident Domain Types - API-99CLUB Compatible
import { BaseEntity } from '../core/types';

// API-99CLUB ResponseUserDto Schema (Extended for Residents)
export interface Resident extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'SUSPENDED';
    membershipTier: 'GOLD' | 'SILVER' | 'STANDARD';
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
    role: ResidentRole;
    property?: ResidentProperty;
    avatar?: string;
    registrationDate?: string;
    lastLoginDate?: string;
    documents?: ResidentDocument[];
}

// API-99CLUB Property Schema
export interface ResidentProperty {
    id?: string;
    block: string;
    apartment: string;
    ownershipType: 'owner' | 'tenant';
    propertyNumber?: string;
    floor?: number;
    area?: number;
    registrationDate?: string;
}

// API-99CLUB Role Schema
export interface ResidentRole {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isSystem?: boolean;
    permissions?: Permission[];
}

// API-99CLUB Permission Schema
export interface Permission {
    id: string;
    name: string;
    description?: string;
    action: string; // "read", "create", "update", "delete"
    resource: string; // "users", "roles", "properties"
    isSystem?: boolean;
}

// Document Management
export interface ResidentDocument {
    id: string;
    type: 'ID_CARD' | 'PASSPORT' | 'UTILITY_BILL' | 'OWNERSHIP_DEED' | 'RENTAL_AGREEMENT' | 'OTHER';
    fileName: string;
    fileUrl: string;
    uploadDate: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
    rejectionReason?: string;
}

// DTOs (Data Transfer Objects) - API-99CLUB Compatible
export interface CreateResidentDto {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    tcKimlikNo?: string;
    propertyIdentification?: string;
    roleId: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'SUSPENDED';
    membershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
    documents?: File[];
}

export interface UpdateResidentDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phone?: string;
    tcKimlikNo?: string;
    propertyIdentification?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'SUSPENDED';
    membershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
    roleId?: string;
}

// Approval DTOs
export interface ResidentApprovalDto {
    decision: 'APPROVED' | 'REJECTED';
    reason?: string;
    assignedRole?: string;
    initialMembershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
    notes?: string;
}

// Bulk Action DTOs
export interface BulkActionDto {
    action: 'APPROVE' | 'REJECT' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE' | 'ASSIGN_ROLE' | 'UPDATE_MEMBERSHIP';
    residentIds: string[];
    data?: {
        reason?: string;
        roleId?: string;
        membershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
        notes?: string;
    };
}

export interface BulkActionResult {
    residentId: string;
    success: boolean;
    message: string;
    error?: string;
}

// Query DTOs
export interface ResidentFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    orderColumn?: string;
    orderBy?: 'ASC' | 'DESC';
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED' | 'SUSPENDED';
    role?: 'admin' | 'resident' | 'tenant';
    membershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
    verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    block?: string;
    apartment?: string;
    ownershipType?: 'owner' | 'tenant';
    registrationDateFrom?: string;
    registrationDateTo?: string;
}

// Response DTOs (API-99CLUB Compatible)
export interface ResidentListResponse {
    users: Resident[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface PendingResidentsResponse {
    users: Resident[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ResidentApprovalResponse {
    success: boolean;
    message: string;
    user: Resident;
}

export interface BulkActionResponse {
    success: boolean;
    message: string;
    results: BulkActionResult[];
    successCount: number;
    errorCount: number;
}

// Avatar Upload (API-99CLUB Compatible)
export interface AvatarUploadResponse {
    success: boolean;
    message: string;
    avatarUrl: string;
}

// Statistics
export interface ResidentStatsResponse {
    totalResidents: number;
    activeResidents: number;
    pendingApproval: number;
    newRegistrationsThisMonth: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    byMembershipTier: {
        gold: number;
        silver: number;
        standard: number;
    };
    byOwnershipType: {
        owner: number;
        tenant: number;
    };
    byStatus: {
        active: number;
        inactive: number;
        pending: number;
        banned: number;
        suspended: number;
    };
}

// Search and Filter
export interface ResidentSearchParams {
    query: string;
    filters?: ResidentFilterParams;
    includeDocuments?: boolean;
    includeProperty?: boolean;
}

export interface ResidentSearchResponse {
    residents: Resident[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    filters: ResidentFilterParams;
} 