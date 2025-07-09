// User Domain Types - API-99CLUB Compatible
import { BaseEntity } from '../core/types';

// API-99CLUB ResponseUserDto Schema
export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED';
    membershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
    role: UserRole;
}

// API-99CLUB ResponseRoleDto Schema
export interface UserRole {
    id: string;
    name: string;
    description?: string;
    slug: string;
    isSystem: boolean;
    permissions?: Permission[];
}

// API-99CLUB ResponsePermissionDto Schema
export interface Permission {
    id: string;
    name: string;
    description?: string;
    action: string; // "read", "create", "update", "delete"
    resource: string; // "users", "roles", "properties"
    isSystem: boolean;
}

// Additional User Properties (for future use)
export interface UserPreferences {
    language: string;
    theme: 'light' | 'dark' | 'system';
    timezone: string;
    notifications: NotificationSettings;
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
}

// DTOs (Data Transfer Objects)
export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleId: string;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    roleId?: string;
}

export interface UpdateUserPasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserProfileDto {
    firstName: string;
    lastName: string;
    phone?: string;
    preferences?: UserPreferences;
}

// Query DTOs
export interface UserFilterParams {
    page?: number;
    limit?: number;
    type?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED';
}

// Response DTOs
export interface UserListResponse {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface UserStatsResponse {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    verifiedUsers: number;
} 