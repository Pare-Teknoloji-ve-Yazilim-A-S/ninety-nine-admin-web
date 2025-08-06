'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Memoize the current parameters to prevent unnecessary re-renders
    const currentParams = useMemo(() => {
        return {
            currentPage,
            recordsPerPage,
            searchQuery,
            sortConfig
        };
    }, [currentPage, recordsPerPage, searchQuery, sortConfig.key, sortConfig.direction]);

    // Memoize filters separately to prevent unnecessary re-renders
    const memoizedFilters = useMemo(() => {
        return filters;
    }, [JSON.stringify(filters)]);

    const fetchResidents = useCallback(async () => {
        try {
            setLoading(true);
            setApiError(null);

            const filterParams: ResidentFilterParams = {
                page: currentParams.currentPage,
                limit: currentParams.recordsPerPage,
                search: currentParams.searchQuery || undefined,
                orderColumn: currentParams.sortConfig.key,
                orderBy: currentParams.sortConfig.direction === 'asc' ? 'ASC' : 'DESC',
                ...memoizedFilters
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
    }, [currentParams, memoizedFilters]);

    const fetchStats = useCallback(async () => {
        try {
            const statsResponse = await residentService.getResidentStats();
            setStats(statsResponse as unknown as ResidentStatsResponse);
        } catch (error: unknown) {
            console.error('Failed to fetch stats:', error);
            // Don't set error state for stats failure, just log it
        }
    }, []);

    const refreshData = useCallback(async () => {
        await Promise.all([fetchResidents(), fetchStats()]);
    }, [fetchResidents, fetchStats]);

    // Auto-fetch when parameters change
    useEffect(() => {
        // Call fetchResidents directly instead of depending on it
        const doFetch = async () => {
            try {
                setLoading(true);
                setApiError(null);

                const filterParams: ResidentFilterParams = {
                    page: currentParams.currentPage,
                    limit: currentParams.recordsPerPage,
                    search: currentParams.searchQuery || undefined,
                    orderColumn: currentParams.sortConfig.key,
                    orderBy: currentParams.sortConfig.direction === 'asc' ? 'ASC' : 'DESC',
                    ...memoizedFilters
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
        };
        
        doFetch();
    }, [currentPage, recordsPerPage, searchQuery, sortConfig.key, sortConfig.direction, memoizedFilters]);

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