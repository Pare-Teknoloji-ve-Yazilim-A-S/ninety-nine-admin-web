'use client';

import { useState, useCallback, useEffect } from 'react';
import { residentService } from '@/services/resident.service';
import { Resident } from '@/app/components/ui/ResidentRow';
import { ResidentFilterParams, ResidentStatsResponse } from '@/services/types/resident.types';
import { ApiResident } from '@/app/dashboard/residents/types';
import { transformApiResidentToComponentResident } from '@/app/dashboard/residents/utils/transformations';

interface UseResidentsDataProps {
    currentPage: number;
    recordsPerPage: number;
    searchQuery: string;
    sortConfig: { key: string; direction: 'asc' | 'desc' };
    filters: Record<string, unknown>;
}

interface UseResidentsDataReturn {
    residents: Resident[];
    totalRecords: number;
    totalPages: number;
    stats: ResidentStatsResponse | null;
    loading: boolean;
    apiError: string | null;
    lastUpdated: Date;
    fetchResidents: () => Promise<void>;
    fetchStats: () => Promise<void>;
    refreshData: () => Promise<void>;
    setResidents: React.Dispatch<React.SetStateAction<Resident[]>>;
}

// Convert API types to component types (Iraq-specific)
// const transformApiResidentToComponentResident = (apiResident: ApiResident): Resident => {
//     return {
//         id: apiResident.id,
//         firstName: apiResident.firstName,
//         lastName: apiResident.lastName,
//         fullName: `${apiResident.firstName} ${apiResident.lastName}`,
//         // Iraq-specific: National ID could be Iraqi National ID or Passport
//         nationalId: apiResident.tcKimlikNo || apiResident.nationalId || apiResident.passportNumber,
//         email: apiResident.email,
//         phone: apiResident.phone,

//         // Property information from API
//         residentType: {
//             type: apiResident.property?.ownershipType || 'owner',
//             label: apiResident.property?.ownershipType === 'tenant' ? 'Kiracı' : 'Malik',
//             color: apiResident.property?.ownershipType === 'tenant' ? 'blue' : 'green'
//         },
//         address: {
//             building: apiResident.property?.block || 'Belirtilmemiş',
//             apartment: apiResident.property?.apartment || 'Belirtilmemiş',
//             roomType: apiResident.property?.roomType || 'Belirtilmemiş',
//             // Iraq-specific location fields
//             governorate: apiResident.property?.governorate || 'Belirtilmemiş',
//             district: apiResident.property?.district || 'Belirtilmemiş',
//             neighborhood: apiResident.property?.neighborhood || 'Belirtilmemiş'
//         },
//         contact: {
//             phone: apiResident.phone || 'Belirtilmemiş',
//             email: apiResident.email || 'Belirtilmemiş',
//             formattedPhone: apiResident.phone ? `+964 ${apiResident.phone}` : 'Belirtilmemiş'
//         },
//         financial: {
//             balance: apiResident.financial?.balance || 0,
//             totalDebt: apiResident.financial?.totalDebt || 0,
//             lastPaymentDate: apiResident.financial?.lastPaymentDate
//         },
//         status: {
//             type: 'active',
//             label: 'Aktif',
//             color: 'green'
//         },
//         membershipTier: {
//             type: 'BRONZE',
//             label: 'Bronz Üye'
//         },
//         verificationStatus: {
//             color: 'green',
//             label: 'Doğrulandı'
//         },
//         registrationDate: apiResident.registrationDate || new Date().toISOString(),
//         lastActivity: apiResident.lastActivity,
//         notes: apiResident.notes,
//         profileImage: apiResident.avatar,
//         createdAt: apiResident.createdAt,
//         updatedAt: apiResident.updatedAt
//     };
// };

export const useResidentsData = ({
    currentPage,
    recordsPerPage,
    searchQuery,
    sortConfig,
    filters
}: UseResidentsDataProps): UseResidentsDataReturn => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [stats, setStats] = useState<ResidentStatsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchResidents = useCallback(async () => {
        try {
            setLoading(true);
            setApiError(null);

            const filterParams: ResidentFilterParams = {
                page: currentPage,
                limit: recordsPerPage,
                search: searchQuery || undefined,
                orderColumn: sortConfig.key,
                orderBy: sortConfig.direction === 'asc' ? 'ASC' : 'DESC',
                ...filters
            };

            const response = await residentService.getAllResidents(filterParams);
            
            if (response.data) {
                const transformedResidents = (response.data as ApiResident[]).map(transformApiResidentToComponentResident);
                setResidents(transformedResidents);
                setTotalRecords(response.total || 0);
                setTotalPages(response.totalPages || 0);
            } else {
                setResidents([]);
                setTotalRecords(0);
                setTotalPages(0);
            }

            setLastUpdated(new Date());

        } catch (error: unknown) {
            console.error('Failed to fetch residents:', error);
            setApiError(error instanceof Error ? error.message : 'Sakinler yüklenirken bir hata oluştu.');
            // Keep existing data on error, don't clear it
        } finally {
            setLoading(false);
        }
    }, [currentPage, recordsPerPage, searchQuery, sortConfig, filters]);

    const fetchStats = useCallback(async () => {
        try {
            const statsResponse = await residentService.getResidentStats();
            setStats(statsResponse as unknown as ResidentStatsResponse);
        } catch (error: unknown) {
            console.error('Failed to fetch stats:', error);
            // Don't set error state for stats failure, just log it
        }
    }, [residents]);

    const refreshData = useCallback(async () => {
        await Promise.all([fetchResidents(), fetchStats()]);
    }, [fetchResidents, fetchStats]);

    // Auto-fetch when dependencies change
    useEffect(() => {
        fetchResidents();
    }, [fetchResidents]);

    // Initial stats fetch
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        residents,
        totalRecords,
        totalPages,
        stats,
        loading,
        apiError,
        lastUpdated,
        fetchResidents,
        fetchStats,
        refreshData,
        setResidents
    };
};