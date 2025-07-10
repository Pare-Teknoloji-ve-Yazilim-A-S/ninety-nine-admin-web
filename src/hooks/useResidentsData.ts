'use client';

import { useState, useCallback, useEffect } from 'react';
import { residentService } from '@/services/resident.service';
import { Resident } from '@/app/components/ui/ResidentRow';
import { ResidentFilterParams, ResidentStatsResponse, Resident as ServiceResident } from '@/services/types/resident.types';

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

// Convert Service types to component types (Iraq-specific)
const transformServiceResidentToComponentResident = (serviceResident: ServiceResident): Resident => {
    return {
        id: serviceResident.id,
        firstName: serviceResident.firstName,
        lastName: serviceResident.lastName,
        fullName: `${serviceResident.firstName} ${serviceResident.lastName}`,
        // Iraq-specific: Use phone as national ID fallback
        nationalId: serviceResident.phone || 'Belirtilmemiş',
        profileImage: serviceResident.avatar,
        avatar: serviceResident.avatar,

        // Property information from service
        residentType: {
            type: serviceResident.property?.ownershipType || 'owner',
            label: serviceResident.property?.ownershipType === 'tenant' ? 'Kiracı' : 'Malik',
            color: serviceResident.property?.ownershipType === 'tenant' ? 'blue' : 'green'
        },
        address: {
            building: serviceResident.property?.block || 'Belirtilmemiş',
            apartment: serviceResident.property?.apartment || 'Belirtilmemiş',
            roomType: serviceResident.property?.propertyNumber || 'Belirtilmemiş'
        },
        contact: {
            phone: serviceResident.phone || 'Belirtilmemiş',
            email: serviceResident.email || 'Belirtilmemiş',
            formattedPhone: serviceResident.phone ? `+964 ${serviceResident.phone}` : 'Belirtilmemiş'
        },
        financial: {
            balance: 0,
            totalDebt: 0,
            lastPaymentDate: undefined
        },
        status: {
            type: serviceResident.status === 'ACTIVE' ? 'active' : 'inactive',
            label: serviceResident.status === 'ACTIVE' ? 'Aktif' : 'Pasif',
            color: serviceResident.status === 'ACTIVE' ? 'green' : 'red'
        },
        registrationDate: serviceResident.registrationDate || serviceResident.createdAt || new Date().toISOString(),
        lastActivity: serviceResident.lastLoginDate,
        notes: '',
        membershipTier: serviceResident.membershipTier === 'GOLD' ? 'Altın Üye' : 
                       serviceResident.membershipTier === 'SILVER' ? 'Gümüş Üye' : 'Standart Üye',
        verificationStatus: serviceResident.verificationStatus === 'APPROVED' ? 'Onaylandı' : 
                           serviceResident.verificationStatus === 'REJECTED' ? 'Reddedildi' : 'Beklemede'
    };
};

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
                // Transform service residents to component residents
                const transformedResidents = response.data.map(transformServiceResidentToComponentResident);
                setResidents(transformedResidents);
                setTotalRecords(response.pagination?.total || 0);
                setTotalPages(response.pagination?.totalPages || 0);
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
            setStats(statsResponse);
        } catch (error: unknown) {
            console.error('Failed to fetch stats:', error);
            // Don't set error state for stats failure, just log it
        }
    }, []);

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