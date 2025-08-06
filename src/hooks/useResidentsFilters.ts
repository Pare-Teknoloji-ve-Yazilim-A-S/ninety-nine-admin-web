'use client';

import { useState, useCallback, useMemo } from 'react';
import { Resident } from '@/app/components/ui/ResidentRow';

interface UseResidentsFiltersReturn {
    // Search and filters
    searchQuery: string;
    filters: Record<string, unknown>;
    showFilterPanel: boolean;
    drawerClosing: boolean;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: Record<string, unknown>) => void;
    setShowFilterPanel: (show: boolean) => void;
    
    // Pagination
    currentPage: number;
    recordsPerPage: number;
    setCurrentPage: (page: number) => void;
    setRecordsPerPage: (records: number) => void;
    
    // Sorting
    sortConfig: { key: string; direction: 'asc' | 'desc' };
    setSortConfig: (config: { key: string; direction: 'asc' | 'desc' }) => void;
    
    // View and selection
    selectedView: string;
    selectedResidents: Resident[];
    setSelectedView: (view: string) => void;
    setSelectedResidents: (residents: Resident[]) => void;
    
    // Event handlers
    handleSearch: (query: string) => void;
    handleViewChange: (view: string) => void;
    handleSelectionChange: (residents: Resident[]) => void;
    handleSort: (key: string, direction: 'asc' | 'desc') => void;
    handlePageChange: (page: number) => void;
    handleRecordsPerPageChange: (records: number) => void;
    handleFiltersApply: (appliedFilters: Record<string, unknown>) => void;
    handleFiltersReset: () => void;
    handleCloseDrawer: () => void;
    handleOpenDrawer: () => void;
}

export const useResidentsFilters = (): UseResidentsFiltersReturn => {
    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filtersState, setFiltersState] = useState<Record<string, unknown>>({});
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [drawerClosing, setDrawerClosing] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    
    // Sorting
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'firstName', direction: 'asc' });
    
    // View and selection
    const [selectedView, setSelectedView] = useState('table');
    const [selectedResidents, setSelectedResidents] = useState<Resident[]>([]);

    // Memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => {
        return filtersState;
    }, [JSON.stringify(filtersState)]);

    // Event handlers
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page when searching
    }, []);

    const handleViewChange = useCallback((view: string) => {
        setSelectedView(view);
    }, []);

    const handleSelectionChange = useCallback((residents: Resident[]) => {
        setSelectedResidents(residents);
    }, []);

    const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset to first page when sorting
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleRecordsPerPageChange = useCallback((records: number) => {
        setRecordsPerPage(records);
        setCurrentPage(1); // Reset to first page when changing page size
    }, []);

    const handleFiltersApply = useCallback((appliedFilters: Record<string, unknown>) => {
        // Check if filters actually changed
        const currentFiltersString = JSON.stringify(filtersState);
        const newFiltersString = JSON.stringify(appliedFilters);
        
        if (currentFiltersString === newFiltersString) {
            // Close drawer without calling handleCloseDrawer to avoid circular dependency
            setDrawerClosing(true);
            setTimeout(() => {
                setShowFilterPanel(false);
                setDrawerClosing(false);
            }, 300);
            return;
        }
        
        // Map status filter values to uppercase if present
        let mappedFilters = { ...appliedFilters };
        if (mappedFilters.status && Array.isArray(mappedFilters.status)) {
            mappedFilters.status = mappedFilters.status.map((v: string) => v.toUpperCase());
        }
        // Map resident type to API values (owner -> resident, tenant -> tenant, guest -> guest)
        if (mappedFilters.type) {
            const typeMap: Record<string, string> = {
                'owner': 'resident',
                'tenant': 'tenant',
                'guest': 'guest',
            };
            if (Array.isArray(mappedFilters.type)) {
                mappedFilters.type = mappedFilters.type.map((v: string) => typeMap[v.toLowerCase()] || v.toLowerCase());
            } else if (typeof mappedFilters.type === 'string') {
                mappedFilters.type = typeMap[mappedFilters.type.toLowerCase()] || mappedFilters.type.toLowerCase();
            }
        }
        setFiltersState(mappedFilters);
        setCurrentPage(1); // Reset to first page when applying filters
        
        // Close drawer without calling handleCloseDrawer to avoid circular dependency
        setDrawerClosing(true);
        setTimeout(() => {
            setShowFilterPanel(false);
            setDrawerClosing(false);
        }, 300);
    }, [filtersState]);

    const handleFiltersReset = useCallback(() => {
        setFiltersState({});
        setCurrentPage(1); // Reset to first page when resetting filters
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setDrawerClosing(true);
        setTimeout(() => {
            setShowFilterPanel(false);
            setDrawerClosing(false);
        }, 300);
    }, []);

    const handleOpenDrawer = useCallback(() => {
        setShowFilterPanel(true);
        setDrawerClosing(false);
    }, []);

    return {
        // State
        searchQuery,
        filters,
        showFilterPanel,
        drawerClosing,
        currentPage,
        recordsPerPage,
        sortConfig,
        selectedView,
        selectedResidents,
        
        // Setters
        setSearchQuery,
        setFilters: setFiltersState,
        setShowFilterPanel,
        setCurrentPage,
        setRecordsPerPage,
        setSortConfig: (config: { key: string; direction: 'asc' | 'desc' }) => setSortConfig(config),
        setSelectedView,
        setSelectedResidents,
        
        // Handlers
        handleSearch,
        handleViewChange,
        handleSelectionChange,
        handleSort,
        handlePageChange,
        handleRecordsPerPageChange,
        handleFiltersApply,
        handleFiltersReset,
        handleCloseDrawer,
        handleOpenDrawer
    };
};