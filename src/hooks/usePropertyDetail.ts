import { useEffect, useState } from 'react';
import { unitsService } from '@/services/units.service';
import { Property } from '@/services/types/property.types';
import { ApiResponse } from '@/services/core/types'; // ApiResponse tipini import et

export function usePropertyDetail(id: string | undefined) {
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    unitsService.getPropertyById(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError('Konut detayı yüklenemedi');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { data, loading, error };
} 