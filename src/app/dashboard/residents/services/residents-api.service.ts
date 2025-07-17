import { residentService } from '@/services/resident.service';
import { ResidentFilterParams, ResidentStatsResponse } from '@/services/types/resident.types';
import { Resident } from '@/app/components/ui/ResidentRow';
import { ApiResident } from '../types';
import { 
    transformApiResidentsToComponentResidents, 
    transformApiResidentToComponentResident 
} from '../utils/transformations';
import { calculateStatsFromResidents } from '../utils/stats';
import { API_CONFIG } from '../constants';

/**
 * API Response interface
 */
interface ApiResponse<T> {
    data: T;
    totalRecords: number;
    currentPage: number;
    totalPages: number;
}

/**
 * API Error interface
 */
interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

/**
 * Residents API service class
 */
export class ResidentsApiService {
    
    /**
     * Build filter parameters for API call
     */
    private buildFilterParams(params: {
        page: number;
        limit: number;
        search?: string;
        sortConfig: { key: string; direction: string };
        filters: Record<string, any>;
    }): ResidentFilterParams {
        const { page, limit, search, sortConfig, filters } = params;
        
        // Map sort field to API field
        const orderColumn = API_CONFIG.SORT_FIELD_MAPPING[sortConfig.key as keyof typeof API_CONFIG.SORT_FIELD_MAPPING] 
            || API_CONFIG.SORT_FIELD_MAPPING.default;
        
        return {
            page,
            limit,
            search: search || undefined,
            orderColumn,
            orderBy: sortConfig.direction.toUpperCase() as 'ASC' | 'DESC',
            ...filters
        };
    }

    /**
     * Fetch residents from API
     */
    async fetchResidents(params: {
        page: number;
        limit: number;
        search?: string;
        sortConfig: { key: string; direction: string };
        filters: Record<string, any>;
    }): Promise<{
        residents: Resident[];
        totalRecords: number;
        currentPage: number;
        totalPages: number;
    }> {
        try {
            const filterParams = this.buildFilterParams(params);
            const response = await residentService.getAllResidents(filterParams);
            
            // Transform service Resident objects to component Resident objects
            // We need to map the service's Resident type to the component's Resident type
            const transformedResidents = response.data.map((resident: any) => ({
                ...resident,
                fullName: `${resident.firstName} ${resident.lastName}`,
                residentType: {
                    type: 'owner' as const,
                    label: 'Malik',
                    color: 'green' as const
                },
                address: {
                    building: resident.block || 'Belirtilmemiş',
                    apartment: resident.apartment || 'Belirtilmemiş',
                    roomType: resident.room || 'Belirtilmemiş'
                },
                contact: {
                    phone: resident.phone || 'Belirtilmemiş',
                    email: resident.email || 'Belirtilmemiş',
                    formattedPhone: resident.phone || 'Belirtilmemiş'
                },
                financial: {
                    balance: 0,
                    totalDebt: 0,
                    lastPaymentDate: undefined
                },
                status: {
                    type: 'active' as const,
                    label: 'Aktif',
                    color: 'green' as const
                },
                registrationDate: resident.createdAt || new Date().toISOString(),
                lastActivity: resident.updatedAt || new Date().toISOString(),
                isGoldMember: false,
                membershipTier: 'Standart',
                verificationStatus: 'İnceleniyor',
                notes: '',
                tags: []
            }));
            
            return {
                residents: transformedResidents,
                totalRecords: response.total || response.data.length,
                currentPage: response.page || params.page,
                totalPages: response.totalPages || Math.ceil((response.total || response.data.length) / params.limit)
            };
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Fetch resident statistics
     */
    async fetchStats(residents: Resident[], totalRecords: number): Promise<ResidentStatsResponse> {
        try {
            // For now, calculate stats from local data
            // In the future, this could be a separate API call
            return calculateStatsFromResidents(residents, totalRecords);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Create a new resident
     */
    async createResident(residentData: Partial<ApiResident>): Promise<Resident> {
        try {
            const response = await residentService.createResident(residentData);
            return transformApiResidentToComponentResident(response);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Update a resident
     */
    async updateResident(id: string, residentData: Partial<ApiResident>): Promise<Resident> {
        try {
            const response = await residentService.updateResident(id, residentData);
            return transformApiResidentToComponentResident(response);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Delete a resident
     */
    async deleteResident(id: string): Promise<void> {
        try {
            await residentService.deleteResident(id);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Get a single resident by ID
     */
    async getResident(id: string): Promise<Resident> {
        try {
            const response = await residentService.getResident(id);
            return transformApiResidentToComponentResident(response);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Bulk update residents
     */
    async bulkUpdateResidents(ids: string[], updateData: Partial<ApiResident>): Promise<Resident[]> {
        try {
            const updatePromises = ids.map(id => this.updateResident(id, updateData));
            return await Promise.all(updatePromises);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Bulk delete residents
     */
    async bulkDeleteResidents(ids: string[]): Promise<void> {
        try {
            const deletePromises = ids.map(id => this.deleteResident(id));
            await Promise.all(deletePromises);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Export residents data
     */
    async exportResidents(format: 'pdf' | 'excel' | 'csv' | 'json', filters?: ResidentFilterParams): Promise<Blob> {
        try {
            // Endpoint belirle
            let endpoint = '';
            switch (format) {
                case 'pdf':
                    endpoint = '/admin/users/export/pdf';
                    break;
                case 'excel':
                    endpoint = '/admin/users/export/excel';
                    break;
                case 'csv':
                    endpoint = '/admin/users/export/csv';
                    break;
                case 'json':
                    endpoint = '/admin/users/export/json';
                    break;
                default:
                    throw new Error('Unsupported export format');
            }

            // Filtreleri query string olarak ekle
            const params = { ...filters };
            // Query string oluştur
            const queryString = Object.keys(params).length > 0
                ? '?' + new URLSearchParams(
                    Object.entries(params).reduce((acc, [key, value]) => {
                        if (value !== undefined && value !== null) {
                            acc[key] = String(value);
                        }
                        return acc;
                    }, {} as Record<string, string>)
                ).toString()
                : '';

            // API çağrısı (responseType: 'blob')
            const response = await (await import('@/services/api/client')).apiClient['client'].get(
                `${endpoint}${queryString}`,
                { responseType: 'blob' }
            );
            return response.data;
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    /**
     * Handle API errors
     */
    private handleApiError(error: unknown): ApiError {
        if (error instanceof Error) {
            return {
                message: error.message,
                code: 'API_ERROR',
                details: error
            };
        }
        
        if (typeof error === 'object' && error !== null) {
            return {
                message: (error as any).message || 'Unknown API error',
                code: (error as any).code || 'UNKNOWN_ERROR',
                details: error
            };
        }
        
        return {
            message: 'An unexpected error occurred',
            code: 'UNEXPECTED_ERROR',
            details: error
        };
    }
}

/**
 * Create residents API service instance
 */
export const residentsApiService = new ResidentsApiService(); 