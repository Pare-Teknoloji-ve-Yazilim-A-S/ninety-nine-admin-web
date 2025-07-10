'use client';

import { useState, useCallback } from 'react';
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
    const [filters, setFilters] = useState<Record<string, unknown>>({});
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [drawerClosing, setDrawerClosing] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    
    // Sorting
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    
    // View and selection
    const [selectedView, setSelectedView] = useState('table');
    const [selectedResidents, setSelectedResidents] = useState<Resident[]>([]);

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
        setFilters(appliedFilters);
        setCurrentPage(1); // Reset to first page when applying filters
        handleCloseDrawer();
    }, []);

    const handleFiltersReset = useCallback(() => {
        setFilters({});
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
        setFilters,
        setShowFilterPanel,
        setCurrentPage,
        setRecordsPerPage,
        setSortConfig,
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