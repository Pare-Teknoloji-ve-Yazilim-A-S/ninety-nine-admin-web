import { useState, useEffect, useCallback } from 'react';
import propertyService from '@/services/property.service';

interface DashboardMetrics {
    totalProperties: number;
    assignedProperties: number;
    loading: boolean;
    error: string | null;
}

export function useDashboardMetrics(): DashboardMetrics {
    const [totalProperties, setTotalProperties] = useState<number>(0);
    const [assignedProperties, setAssignedProperties] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Starting to fetch dashboard metrics...');

            // Fetch both metrics in parallel
            const [totalCount, assignedCount] = await Promise.all([
                propertyService.getAllPropertiesCount(),
                propertyService.getAssignedPropertiesCount()
            ]);

            console.log('Dashboard metrics fetched successfully:', { totalCount, assignedCount });

            setTotalProperties(totalCount);
            setAssignedProperties(assignedCount);
        } catch (err: any) {
            console.error('Failed to fetch dashboard metrics:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(`Dashboard metrikleri yüklenirken bir hata oluştu: ${err.message}`);
            // Set fallback values
            setTotalProperties(0);
            setAssignedProperties(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return {
        totalProperties,
        assignedProperties,
        loading,
        error
    };
} 