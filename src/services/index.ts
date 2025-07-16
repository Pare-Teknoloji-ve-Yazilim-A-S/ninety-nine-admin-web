// Services Index - Main Export File
// Bu dosya tüm services ve utilities'leri tek noktadan export eder

// Core Types & Interfaces
export * from './core/types';
export * from './core/base.service';

// Configuration
export * from './config/api.config';

// API Client
export { default as apiClient } from './api/client';

// Utilities
export * from './utils/token-manager';
export * from './utils/logger';

// Domain Types
export * from './types/auth.types';
export type {
    // Export specific types from user.types to avoid Permission conflict
    User,
    CreateUserDto,
    UpdateUserDto,
    UserRole,
    UserFilterParams,
    UserListResponse,
    UserStatsResponse,
    Permission as UserPermission,
} from './types/user.types';
export type {
    // Export specific types from resident.types to avoid Permission conflict
    Resident,
    CreateResidentDto,
    UpdateResidentDto,
    ResidentApprovalDto,
    BulkActionDto,
    ResidentFilterParams,
    ResidentListResponse,
    ResidentStatsResponse,
    ResidentProperty,
    ResidentRole,
    ResidentDocument,
    AvatarUploadResponse,
    Permission as ResidentPermission,
    BulkActionResult as ResidentBulkActionResult,
} from './types/resident.types';
export type {
    // Export specific types from property.types to avoid BulkActionResult conflict  
    Property,
    PropertyUser,
    PropertyBill,
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
    MaintenanceRecord,
    CreateMaintenanceDto,
    CompleteMaintenanceDto,
    ExportParams,
    ImportResult,
    BulkActionResult as PropertyBulkActionResult,
} from './types/property.types';

// Services
export { default as authService, authService as AuthService } from './auth.service';
export { default as userService, userService as UserService } from './user.service';
export { default as adminResidentService, adminResidentService as AdminResidentService } from './admin-resident.service';
export { default as residentService, residentService as ResidentService } from './resident.service';
export { default as propertyService, PropertyService } from './property.service';

// Re-export commonly used types for convenience
export type {
    ApiResponse,
    PaginatedResponse,
    ApiError,
    FilterParams,
    LoadingState,
} from './core/types';

// Re-export types are already handled above with specific exports

// Service factory for custom implementations
export class ServiceFactory {
    /**
     * Custom service instances oluşturmak için factory method
     */
    static createCustomService<T>(serviceClass: new (...args: any[]) => T, ...args: any[]): T {
        return new serviceClass(...args);
    }
}

// Global service configuration
export const configureServices = (config: {
    baseURL?: string;
    timeout?: number;
    enableDebugLogs?: boolean;
}) => {
    // Bu method gelecekte global service configuration için kullanılabilir
    console.info('Services configured with:', config);
}; 