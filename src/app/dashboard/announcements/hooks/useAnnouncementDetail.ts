// useAnnouncementDetail Hook
import { useState, useEffect, useCallback } from 'react';
import { announcementService } from '@/services';
import type { Announcement } from '@/services/types/announcement.types';

interface UseAnnouncementDetailProps {
    announcementId: string;
}

interface UseAnnouncementDetailReturn {
    announcement: Announcement | null;
    loading: boolean;
    error: string | null;
    refreshAnnouncement: () => Promise<void>;
    updateAnnouncement: (updates: Partial<Announcement>) => void;
}

export function useAnnouncementDetail({ announcementId }: UseAnnouncementDetailProps): UseAnnouncementDetailReturn {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnnouncement = useCallback(async () => {
        if (!announcementId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await announcementService.getAnnouncementById(announcementId);
            setAnnouncement(response.data);
        } catch (err: any) {
            console.error('Failed to fetch announcement:', err);
            setError(err?.message || 'Duyuru yüklenirken bir hata oluştu');
            setAnnouncement(null);
        } finally {
            setLoading(false);
        }
    }, [announcementId]);

    const refreshAnnouncement = useCallback(async () => {
        await fetchAnnouncement();
    }, [fetchAnnouncement]);

    const updateAnnouncement = useCallback((updates: Partial<Announcement>) => {
        if (announcement) {
            setAnnouncement(prev => prev ? { ...prev, ...updates } : null);
        }
    }, [announcement]);

    // Initial load and refetch when id changes  
    useEffect(() => {
        if (announcementId) {
            fetchAnnouncement();
        }
    }, [fetchAnnouncement, announcementId]);

    return {
        announcement,
        loading,
        error,
        refreshAnnouncement,
        updateAnnouncement,
    };
}