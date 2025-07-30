// useAnnouncementsData Hook
import { useState, useEffect, useCallback } from 'react';
import { announcementService } from '@/services';
import type { 
    Announcement, 
    AnnouncementFilterParams,
    AnnouncementSortConfig 
} from '@/services/types/announcement.types';

interface UseAnnouncementsDataProps {
    currentPage: number;
    recordsPerPage: number;
    searchQuery: string;
    sortConfig: AnnouncementSortConfig;
    filters: Record<string, any>;
}

interface UseAnnouncementsDataReturn {
    announcements: Announcement[];
    loading: boolean;
    apiError: string | null;
    totalRecords: number;
    totalPages: number;
    lastUpdated: Date;
    refreshData: () => Promise<void>;
    setAnnouncements: (announcements: Announcement[]) => void;
}

export function useAnnouncementsData({
    currentPage,
    recordsPerPage,
    searchQuery,
    sortConfig,
    filters,
}: UseAnnouncementsDataProps): UseAnnouncementsDataReturn {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setApiError(null);

        try {
            const params: AnnouncementFilterParams = {
                page: currentPage,
                limit: recordsPerPage,
                search: searchQuery || undefined,
                orderColumn: sortConfig.key,
                orderBy: sortConfig.direction?.toUpperCase() as 'ASC' | 'DESC',
                ...filters,
            };

            // Clean up empty params
            Object.keys(params).forEach(key => {
                const value = params[key as keyof AnnouncementFilterParams];
                if (value === undefined || value === null || value === '') {
                    delete params[key as keyof AnnouncementFilterParams];
                }
            });

            let response;
            if (searchQuery) {
                response = await announcementService.searchAnnouncements(searchQuery, params);
            } else {
                response = await announcementService.getAllAnnouncements(params);
            }

            setAnnouncements(response.data || []);
            setTotalRecords(response.total || 0);
            setTotalPages(response.totalPages || 0);
            setLastUpdated(new Date());
        } catch (error: any) {
            console.error('Failed to fetch announcements:', error);
            setApiError(error?.message || 'Duyurular yüklenirken bir hata oluştu');
            setAnnouncements([]);
            setTotalRecords(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, recordsPerPage, searchQuery, sortConfig, filters]);

    const refreshData = useCallback(async () => {
        await fetchAnnouncements();
    }, [fetchAnnouncements]);

    // Initial load and refetch when dependencies change
    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    return {
        announcements,
        loading,
        apiError,
        totalRecords,
        totalPages,
        lastUpdated,
        refreshData,
        setAnnouncements,
    };
}