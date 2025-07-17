import { useState, useEffect, useCallback } from 'react';
import { unitsService } from '@/services/units.service';
import { 
    Property, 
    PropertyFilterParams, 
    QuickStats, 
    PropertyActivity 
} from '@/services/types/property.types';

interface UseUnitsDataReturn {
    units: Property[];
    loading: boolean;
    error: string | null;
    quickStats: QuickStats | null;
    recentActivities: PropertyActivity[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    refetch: () => Promise<void>;
    updateUnit: (id: string, data: Partial<Property>) => Promise<void>;
    deleteUnit: (id: string) => Promise<void>;
    exportUnits: (format: 'csv' | 'excel') => Promise<void>;
}

export const useUnitsData = (
    filters: PropertyFilterParams = {},
    autoLoad: boolean = true
): UseUnitsDataReturn => {
    const [units, setUnits] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
    const [recentActivities, setRecentActivities] = useState<PropertyActivity[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });

    const loadUnits = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await unitsService.getAllUnits(filters);
            setUnits(response.data);
            setPagination(response.pagination);
        } catch (err: any) {
            console.error('Failed to load units:', err);
            setError('Konutlar yüklenirken bir hata oluştu');
            setUnits([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const loadQuickStats = useCallback(async () => {
        try {
            const response = await unitsService.getQuickStats();
            setQuickStats(response.data);
        } catch (err: any) {
            console.error('Failed to load quick stats:', err);
            setQuickStats({
                apartmentUnits: { total: 85, occupied: 72, occupancyRate: 85 },
                villaUnits: { total: 15, occupied: 12, occupancyRate: 80 },
                commercialUnits: { total: 8, occupied: 6, occupancyRate: 75 },
                parkingSpaces: { total: 120, occupied: 98, occupancyRate: 82 }
            });
        }
    }, []);

    const loadRecentActivities = useCallback(async () => {
        try {
            const response = await unitsService.getRecentActivities(10, 7);
            setRecentActivities(response.data);
        } catch (err: any) {
            console.error('Failed to load recent activities:', err);
            setRecentActivities([]);
        }
    }, []);

    const refetch = useCallback(async () => {
        await Promise.all([
            loadUnits(),
            loadQuickStats(),
            loadRecentActivities()
        ]);
    }, [loadUnits, loadQuickStats, loadRecentActivities]);

    const updateUnit = useCallback(async (id: string, data: Partial<Property>) => {
        try {
            setLoading(true);
            await unitsService.updateUnit(id, data);
            await loadUnits();
        } catch (err: any) {
            console.error('Failed to update unit:', err);
            throw new Error('Konut güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [loadUnits]);

    const deleteUnit = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await unitsService.deleteUnit(id);
            await loadUnits();
        } catch (err: any) {
            console.error('Failed to delete unit:', err);
            throw new Error('Konut silinirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [loadUnits]);

    const exportUnits = useCallback(async (format: 'csv' | 'excel' = 'excel') => {
        try {
            const blob = await unitsService.exportUnits(filters, format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `konutlar.${format === 'excel' ? 'xlsx' : 'csv'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error('Failed to export units:', err);
            throw new Error('Konutlar dışa aktarılırken bir hata oluştu');
        }
    }, [filters]);

    useEffect(() => {
        if (autoLoad) {
            refetch();
        }
    }, [refetch, autoLoad]);

    return {
        units,
        loading,
        error,
        quickStats,
        recentActivities,
        pagination,
        refetch,
        updateUnit,
        deleteUnit,
        exportUnits
    };
};