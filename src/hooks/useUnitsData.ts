import { useState, useCallback, useEffect, useMemo } from 'react';
import { Property } from '@/services/types/property.types';
import { PropertyService } from '@/services/property.service';

interface PropertyFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    propertyGroup?: string;
    orderColumn?: string;
    orderBy?: 'ASC' | 'DESC';
}

interface UnitsDataHookProps {
    currentPage: number;
    recordsPerPage: number;
    searchQuery: string;
    sortConfig: { key: string; direction: 'asc' | 'desc' };
    filters: PropertyFilterParams;
}

export const useUnitsData = ({
    currentPage,
    recordsPerPage,
    searchQuery,
    sortConfig,
    filters
}: UnitsDataHookProps) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const unitsService = useMemo(() => new PropertyService(), []);

    const loadProperties = useCallback(async (showLoadingIndicator: boolean = true) => {
        try {
            if (showLoadingIndicator) {
                setLoading(true);
            }
            setError(null);

            // Process filters
            const processedFilters = { ...filters };
            Object.keys(processedFilters).forEach(key => {
                const value = processedFilters[key as keyof PropertyFilterParams];
                if (value === '' || value === undefined || value === null) {
                    delete processedFilters[key as keyof PropertyFilterParams];
                }
            });

            // Always keep pagination and ordering parameters
            if (!processedFilters.page) processedFilters.page = currentPage;
            if (!processedFilters.limit) processedFilters.limit = recordsPerPage;
            if (!processedFilters.orderColumn) processedFilters.orderColumn = sortConfig.key || 'name';
            if (!processedFilters.orderBy) processedFilters.orderBy = sortConfig.direction?.toUpperCase() as 'ASC' | 'DESC' || 'ASC';

            // Add search query if exists
            if (searchQuery) {
                processedFilters.search = searchQuery;
            }

            console.log('🔍 Loading properties with filters:', processedFilters);

            const response = await unitsService.getAllProperties({
                ...processedFilters,
                includeBills: false
            });
            
            console.log('✅ Properties loaded:', response.data.length, 'items');
            console.log('📄 Full response object:', response);
            console.log('📄 Pagination info:', response.pagination);
            
            setProperties(response.data);
            setTotalRecords(response.pagination?.total || 0);
            setTotalPages(response.pagination?.totalPages || 1);
            setLastUpdated(new Date());
            
        } catch (err: any) {
            console.error('❌ Error loading properties:', err);
            setError('Konutlar yüklenirken bir hata oluştu');
            setProperties([]);
            setTotalRecords(0);
            setTotalPages(1);
        } finally {
            if (showLoadingIndicator) {
                setLoading(false);
            }
        }
    }, [currentPage, recordsPerPage, searchQuery, sortConfig, filters, unitsService]);

    // Load data when dependencies change
    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    const refreshData = useCallback(() => {
        loadProperties();
    }, [loadProperties]);

    return {
        properties,
        loading,
        error,
        totalRecords,
        totalPages,
        lastUpdated,
        setProperties,
        refreshData,
        loadProperties
    };
};