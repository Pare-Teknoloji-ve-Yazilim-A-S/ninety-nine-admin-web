import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/client';

interface ExpiringAnnouncementsResponse {
  data: {
    count: number;
  };
}

export function useExpiringAnnouncements() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpiringAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get('/admin/announcements/count/expiring-in-1d');
        const data: ExpiringAnnouncementsResponse = response.data;
        setCount(data.data.count);
      } catch (err) {
        console.error('Error fetching expiring announcements count:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringAnnouncements();
  }, []);

  return { count, loading, error };
}
