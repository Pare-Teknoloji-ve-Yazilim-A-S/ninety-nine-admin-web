// Property Domain Types - API-99CLUB Compatible
import { BaseEntity } from '../core/types';

// API-99CLUB ResponsePropertyDto Schema
export interface Property extends BaseEntity {
    name: string;
    propertyNumber: string;
    type: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    propertyGroup?: string;
    area?: number;
    blockNumber?: string;
    floor?: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED';
    owner?: PropertyUser;
    tenant?: PropertyUser;
    bills?: PropertyBill[];
}

// API-99CLUB User Schema (for owner/tenant)
export interface PropertyUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

// API-99CLUB Bill Schema (for property bills)
export interface PropertyBill {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    billType: 'MAINTENANCE' | 'WATER' | 'ELECTRICITY' | 'GAS' | 'INTERNET' | 'CLEANING' | 'SECURITY' | 'OTHER';
    description?: string;
}

// DTOs (Data Transfer Objects) - API-99CLUB Compatible
export interface CreatePropertyDto {
    name: string;
    propertyNumber: string;
    type: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    propertyGroup?: string;
    area?: number;
    blockNumber?: string;
    floor?: number;
    status?: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED';
    ownerId?: string;
    tenantId?: string;
}

export interface UpdatePropertyDto {
    name?: string;
    propertyNumber?: string;
    type?: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    propertyGroup?: string;
    area?: number;
    blockNumber?: string;
    floor?: number;
    status?: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED';
    ownerId?: string;
    tenantId?: string;
}

// Query DTOs - API-99CLUB Compatible
export interface PropertyFilterParams {
    page?: number;
    limit?: number;
    orderColumn?: string;
    orderBy?: 'ASC' | 'DESC';
    type?: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    status?: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED';
}

export interface PropertySearchParams {
    term?: string;
    status?: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED';
    type?: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    blockNumber?: string;
    propertyGroup?: string;
    ownerId?: string;
    tenantId?: string;
}

// Response DTOs (API-99CLUB Compatible)
export interface PropertyListResponse {
    data: Property[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Statistics & Analytics DTOs (for future endpoints)
export interface PropertyStatistics {
    totalUnits: number;
    occupancyRate: number;
    unitsByType: {
        RESIDENCE: number;
        VILLA: number;
        COMMERCIAL: number;
        OFFICE: number;
    };
    unitsByStatus: {
        AVAILABLE: number;
        OCCUPIED: number;
        UNDER_MAINTENANCE: number;
        RESERVED: number;
    };
    occupancyTrend?: {
        currentMonth: number;
        previousMonth: number;
        changePercentage: number;
    };
}

export interface OccupancyStats {
    period: string;
    newOccupied: number;
    vacated: number;
    maintenanceStarted: number;
    maintenanceCompleted: number;
    dailyStats?: Array<{
        date: string;
        occupied: number;
        vacated: number;
        maintenance: number;
    }>;
}

export interface QuickStats {
    apartmentUnits: {
        total: number;
        occupied: number;
        occupancyRate: number;
    };
    villaUnits: {
        total: number;
        occupied: number;
        occupancyRate: number;
    };
    commercialUnits: {
        total: number;
        occupied: number;
        occupancyRate: number;
    };
    parkingSpaces: {
        total: number;
        occupied: number;
        occupancyRate: number;
    };
}

export interface PropertyActivity {
    id: string;
    propertyId: string;
    propertyNumber: string;
    activityType: 'STATUS_CHANGED' | 'OWNER_ASSIGNED' | 'TENANT_ASSIGNED' | 'CREATED' | 'UPDATED' | 'DELETED';
    description: string;
    oldValue?: string;
    newValue?: string;
    performedBy: {
        id: string;
        name: string;
    };
    createdAt: string;
}

export interface BlockInfo {
    blockNumber: string;
    totalUnits: number;
    occupiedUnits: number;
    totalFloors: number;
}

export interface BlockResponse {
    blockInfo: BlockInfo;
    properties: Property[];
    stats?: {
        occupancyByFloor: Array<{
            floor: number;
            total: number;
            occupied: number;
        }>;
    };
}

export interface FilterOptions {
    blocks: string[];
    floors: {
        min: number;
        max: number;
    };
    areaRanges: {
        min: number;
        max: number;
    };
    roomCounts: string[];
    propertyGroups: string[];
}

// Bulk Operations
export interface BulkUpdateDto {
    propertyIds: string[];
    updates: {
        status?: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED';
        propertyGroup?: string;
        ownerId?: string;
        tenantId?: string;
    };
}

export interface BulkAssignmentDto {
    assignments: Array<{
        propertyId: string;
        tenantId: string;
        startDate: string;
        endDate?: string;
    }>;
}

export interface BulkActionResult {
    propertyId: string;
    success: boolean;
    message: string;
    error?: string;
}

export interface BulkActionResponse {
    successCount: number;
    failedCount: number;
    errors: Array<{
        propertyId: string;
        error: string;
    }>;
    results?: BulkActionResult[];
}

// Maintenance Management (for future endpoints)
export interface MaintenanceRecord {
    id: string;
    propertyId: string;
    reason: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    assignedTo?: PropertyUser;
    startedAt: string;
    estimatedCompletion?: string;
    completedAt?: string;
    completionNotes?: string;
}

export interface CreateMaintenanceDto {
    reason: string;
    estimatedDuration?: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    description?: string;
    assignedTo?: string;
}

export interface CompleteMaintenanceDto {
    completionNotes: string;
    actualDuration?: number;
}

// Export types (for future endpoints)
export interface ExportParams {
    format: 'excel' | 'csv' | 'pdf';
    filters?: string; // JSON stringified filters
    columns?: string; // Comma separated column names
}

export interface ImportResult {
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: Array<{
        row: number;
        error: string;
        data: any;
    }>;
} 