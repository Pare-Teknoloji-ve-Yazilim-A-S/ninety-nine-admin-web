import { useState, useCallback, useMemo } from 'react';
import { PropertyFilterParams } from '@/services/types/property.types';

export const useUnitsFilters = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Sort state
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'name',
        direction: 'asc'
    });

    // Filter state
    const [filters, setFilters] = useState<PropertyFilterParams>({});

    // View state
    const [selectedView, setSelectedView] = useState<'table' | 'grid'>('table');

    // Selection state
    const [selectedUnits, setSelectedUnits] = useState<any[]>([]);

    // Filter panel state
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [drawerClosing, setDrawerClosing] = useState(false);

    // Page change handler
    const handlePageChange = useCallback((page: number) => {
        console.log('🔄 Page change requested:', page);
        setCurrentPage(page);
    }, []);

    // Records per page change handler
    const handleRecordsPerPageChange = useCallback((newRecordsPerPage: number) => {
        console.log('📄 Records per page change:', newRecordsPerPage);
        setRecordsPerPage(newRecordsPerPage);
        setCurrentPage(1); // Reset to first page
    }, []);

    // Search handler
    const handleSearch = useCallback((query: string) => {
        console.log('🔍 Search query:', query);
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page
    }, []);

    // Sort handler
    const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
        console.log('📊 Sort change:', key, direction);
        setSortConfig({ key, direction });
    }, []);

    // View change handler
    const handleViewChange = useCallback((view: 'table' | 'grid') => {
        setSelectedView(view);
    }, []);

    // Selection change handler
    const handleSelectionChange = useCallback((selected: any[]) => {
        setSelectedUnits(selected);
    }, []);

    // Filter panel handlers
    const handleOpenDrawer = useCallback(() => {
        setShowFilterPanel(true);
        setDrawerClosing(false);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setDrawerClosing(true);
        setTimeout(() => {
            setShowFilterPanel(false);
            setDrawerClosing(false);
        }, 300);
    }, []);

    // Apply filters handler
    const handleFiltersApply = useCallback((newFilters: PropertyFilterParams) => {
        console.log('🔧 Applying filters:', newFilters);
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page
        handleCloseDrawer();
    }, [handleCloseDrawer]);

    // Reset filters handler
    const handleFiltersReset = useCallback(() => {
        console.log('🔄 Resetting filters');
        setFilters({});
        setCurrentPage(1);
        handleCloseDrawer();
    }, [handleCloseDrawer]);

    // Memoized filters object
    const processedFilters = useMemo(() => {
        const processed = { ...filters };
        
        // Remove empty values
        Object.keys(processed).forEach(key => {
            const value = processed[key as keyof PropertyFilterParams];
            if (value === '' || value === undefined || value === null) {
                delete processed[key as keyof PropertyFilterParams];
            }
        });

        return processed;
    }, [filters]);

    return {
        // Pagination
        currentPage,
        recordsPerPage,
        handlePageChange,
        handleRecordsPerPageChange,

        // Search
        searchQuery,
        handleSearch,

        // Sort
        sortConfig,
        handleSort,

        // View
        selectedView,
        handleViewChange,

        // Selection
        selectedUnits,
        handleSelectionChange,

        // Filters
        filters: processedFilters,
        handleFiltersApply,
        handleFiltersReset,

        // Filter panel
        showFilterPanel,
        drawerClosing,
        handleOpenDrawer,
        handleCloseDrawer
    };
};