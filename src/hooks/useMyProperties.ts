import { useState, useCallback, useEffect } from 'react';
import propertyService from '@/services/property.service';
import { Property } from '@/services/types/property.types';

interface UseMyPropertiesProps {
    ownerId?: string;
    autoFetch?: boolean;
}

interface UseMyPropertiesReturn {
    properties: Property[];
    loading: boolean;
    error: string | null;
    fetchProperties: (ownerIdParam?: string) => Promise<void>;
    refreshData: () => Promise<void>;
    clearError: () => void;
}

export const useMyProperties = ({
    ownerId,
    autoFetch = true
}: UseMyPropertiesProps = {}): UseMyPropertiesReturn => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = useCallback(async (ownerIdParam?: string) => {
        try {
            setLoading(true);
            setError(null);

            const targetOwnerId = ownerIdParam || ownerId;
            
            if (targetOwnerId) {
                const properties = await propertyService.getPropertiesByOwner(targetOwnerId);
                setProperties(properties || []);
            } else {
                const response = await propertyService.getMyProperties();
                if (response?.data) {
                    setProperties(response.data);
                } else {
                    setProperties([]);
                }
            }

        } catch (error: unknown) {
            console.error('Failed to fetch properties:', error);
            setError(error instanceof Error ? error.message : 'Konut bilgileri yüklenirken bir hata oluştu.');
            setProperties([]); // Clear data on error
        } finally {
            setLoading(false);
        }
    }, [ownerId]);

    const refreshData = useCallback(async () => {
        await fetchProperties();
    }, [fetchProperties]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Auto-fetch when ownerId changes or on mount if enabled
    useEffect(() => {
        if (autoFetch && (ownerId || !ownerId)) {
            fetchProperties();
        }
    }, [autoFetch, ownerId, fetchProperties]);

    return {
        properties,
        loading,
        error,
        fetchProperties,
        refreshData,
        clearError
    };
}; 