import { useState, useCallback, useEffect } from 'react';
import { adminResidentService } from '@/services/admin-resident.service';
import { Resident, ResidentFilterParams, PendingResidentsResponse } from '@/services/types/resident.types';

interface UsePendingResidentsProps {
  page?: number;
  limit?: number;
  orderColumn?: string;
  orderBy?: 'ASC' | 'DESC';
}

interface UsePendingResidentsReturn {
  residents: Resident[];
  loading: boolean;
  error: string | null;
  pagination: PendingResidentsResponse['pagination'] | null;
  refresh: () => Promise<void>;
}

export function usePendingResidents({
  page = 1,
  limit = 10,
  orderColumn,
  orderBy
}: UsePendingResidentsProps = {}): UsePendingResidentsReturn {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [pagination, setPagination] = useState<PendingResidentsResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingResidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ResidentFilterParams = {
        page,
        limit,
        orderColumn,
        orderBy
      };
      const response = await adminResidentService.getPendingResidents(params);
      setResidents(response.data || []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      setError(err?.message || 'Bekleyen sakinler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, orderColumn, orderBy]);

  useEffect(() => {
    fetchPendingResidents();
  }, [fetchPendingResidents]);

  return {
    residents,
    loading,
    error,
    pagination,
    refresh: fetchPendingResidents
  };
} 