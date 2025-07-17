import { useState, useCallback, useMemo } from 'react';
import { PropertyFilterParams } from '@/services/types/property.types';

interface UseUnitsFiltersReturn {
    filters: PropertyFilterParams;
    searchQuery: string;
    showFilters: boolean;
    viewMode: 'table' | 'grid' | 'block' | 'map';
    setFilters: (filters: PropertyFilterParams) => void;
    updateFilter: (key: keyof PropertyFilterParams, value: any) => void;
    setSearchQuery: (query: string) => void;
    setShowFilters: (show: boolean) => void;
    setViewMode: (mode: 'table' | 'grid' | 'block' | 'map') => void;
    resetFilters: () => void;
    getFilteredParams: () => PropertyFilterParams;
}

const DEFAULT_FILTERS: PropertyFilterParams = {
    type: undefined,
    status: undefined,
    page: 1,
    limit: 20,
    orderColumn: 'firstName',
    orderBy: 'ASC'
};

export const useUnitsFilters = (
    initialFilters: PropertyFilterParams = DEFAULT_FILTERS
): UseUnitsFiltersReturn => {
    const [filters, setFilters] = useState<PropertyFilterParams>(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'block' | 'map'>('table');

    const updateFilter = useCallback((key: keyof PropertyFilterParams, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key === 'page' ? value : 1 // Reset to first page when other filters change
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setSearchQuery('');
    }, []);

    const getFilteredParams = useMemo((): PropertyFilterParams => {
        const params: PropertyFilterParams = { ...filters };
        
        if (searchQuery.trim()) {
            params.search = searchQuery.trim();
        }

        // Remove undefined values
        Object.keys(params).forEach(key => {
            if (params[key as keyof PropertyFilterParams] === undefined) {
                delete params[key as keyof PropertyFilterParams];
            }
        });

        return params;
    }, [filters, searchQuery]);

    return {
        filters,
        searchQuery,
        showFilters,
        viewMode,
        setFilters,
        updateFilter,
        setSearchQuery,
        setShowFilters,
        setViewMode,
        resetFilters,
        getFilteredParams: () => getFilteredParams
    };
};