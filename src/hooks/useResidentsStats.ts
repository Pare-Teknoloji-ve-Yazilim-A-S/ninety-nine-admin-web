import { useEffect, useState } from 'react';
import { residentsStatsService } from '@/services';

export function useResidentsStats() {
  const [goldCount, setGoldCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [tenantsCount, setTenantsCount] = useState<number>(0);
  const [ownersCount, setOwnersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    Promise.all([
      residentsStatsService.getGoldResidentsCount(),
      residentsStatsService.getTotalResidentsCount(),
      residentsStatsService.getActiveUsersCount(),
      residentsStatsService.getTenantsCount(),
      residentsStatsService.getOwnersCount(),
    ])
      .then(([gold, total, active, tenants, owners]) => {
        if (!isMounted) return;
        setGoldCount(gold);
        setTotalCount(total);
        setActiveCount(active);
        setTenantsCount(tenants);
        setOwnersCount(owners);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError('İstatistikler alınamadı');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { goldCount, totalCount, activeCount, tenantsCount, ownersCount, loading, error };
} 