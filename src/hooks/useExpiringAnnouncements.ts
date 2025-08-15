import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/client';

interface ExpiringAnnouncementsResponse {
  data?: {
    count: number;
  };
  count?: number;
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
        console.log('Expiring announcements response:', response);
        const data: ExpiringAnnouncementsResponse = response.data;
        console.log('Expiring announcements data:', data);
        
        // Handle different response structures
        const count = data?.data?.count ?? data?.count ?? 0;
        console.log('Expiring announcements count:', count);
        setCount(count);
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
