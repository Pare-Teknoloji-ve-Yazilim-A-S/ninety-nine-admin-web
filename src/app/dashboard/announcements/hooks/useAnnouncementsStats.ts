// useAnnouncementsStats Hook
import { useState, useEffect, useCallback } from 'react';
import { announcementService } from '@/services';
import type { AnnouncementStats } from '@/services/types/announcement.types';

interface UseAnnouncementsStatsReturn {
    stats: AnnouncementStats | null;
    loading: boolean;
    error: string | null;
    refreshStats: () => Promise<void>;
}

const DEFAULT_STATS: AnnouncementStats = {
    total: 0,
    draft: 0,
    published: 0,
    archived: 0,
    emergency: 0,
    pinned: 0,
    expiringSoon: 0,
    byType: {
        GENERAL: 0,
        MAINTENANCE: 0,
        EMERGENCY: 0,
        EVENT: 0,
        RULE: 0,
        MEETING: 0,
        OTHER: 0,
    },
};

export function useAnnouncementsStats(): UseAnnouncementsStatsReturn {
    const [stats, setStats] = useState<AnnouncementStats | null>(DEFAULT_STATS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await announcementService.getAnnouncementStats();
            setStats(response.data || DEFAULT_STATS);
        } catch (err: any) {
            console.warn('Failed to fetch announcement stats, using defaults:', err);
            setError(null); // Don't show error to user, just use defaults
            setStats(DEFAULT_STATS); // Fallback to default stats
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshStats = useCallback(async () => {
        await fetchStats();
    }, [fetchStats]);

    // Initial load
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refreshStats,
    };
}