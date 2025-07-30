// useAnnouncementsFilters Hook
import { useState, useCallback, useMemo } from 'react';
import type { Announcement, AnnouncementSortConfig } from '@/services/types/announcement.types';
import { DEFAULT_VALUES } from '../constants';

interface UseAnnouncementsFiltersReturn {
    currentPage: number;
    recordsPerPage: number;
    searchQuery: string;
    sortConfig: AnnouncementSortConfig;
    filters: Record<string, any>;
    selectedView: 'table' | 'grid';
    selectedAnnouncements: Announcement[];
    showFilterPanel: boolean;
    drawerClosing: boolean;
    
    // Actions
    handlePageChange: (page: number) => void;
    handleRecordsPerPageChange: (recordsPerPage: number) => void;
    handleSearch: (query: string) => void;
    handleSort: (config: AnnouncementSortConfig) => void;
    handleFiltersApply: (newFilters: Record<string, any>) => void;
    handleFiltersReset: () => void;
    handleViewChange: (view: 'table' | 'grid') => void;
    handleSelectionChange: (announcements: Announcement[]) => void;
    handleOpenDrawer: () => void;
    handleCloseDrawer: () => void;
    setSelectedAnnouncements: (announcements: Announcement[]) => void;
}

export function useAnnouncementsFilters(): UseAnnouncementsFiltersReturn {
    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(DEFAULT_VALUES.currentPage);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(DEFAULT_VALUES.recordsPerPage);
    
    // Search and Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    
    // Sorting
    const [sortConfig, setSortConfig] = useState<AnnouncementSortConfig>(DEFAULT_VALUES.sortConfig);
    
    // View and Selection
    const [selectedView, setSelectedView] = useState<'table' | 'grid'>(DEFAULT_VALUES.selectedView);
    const [selectedAnnouncements, setSelectedAnnouncements] = useState<Announcement[]>([]);
    
    // UI State
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [drawerClosing, setDrawerClosing] = useState(false);

    // Pagination handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleRecordsPerPageChange = useCallback((newRecordsPerPage: number) => {
        setRecordsPerPage(newRecordsPerPage);
        setCurrentPage(1); // Reset to first page
    }, []);

    // Search handler
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page
        setSelectedAnnouncements([]); // Clear selection
    }, []);

    // Sort handler
    const handleSort = useCallback((config: AnnouncementSortConfig) => {
        setSortConfig(config);
        setCurrentPage(1); // Reset to first page
    }, []);

    // Filter handlers
    const handleFiltersApply = useCallback((newFilters: Record<string, any>) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page
        setSelectedAnnouncements([]); // Clear selection
        handleCloseDrawer();
    }, []);

    const handleFiltersReset = useCallback(() => {
        setFilters({});
        setCurrentPage(1); // Reset to first page
        setSelectedAnnouncements([]); // Clear selection
    }, []);

    // View handler
    const handleViewChange = useCallback((view: 'table' | 'grid') => {
        setSelectedView(view);
        setSelectedAnnouncements([]); // Clear selection when changing views
    }, []);

    // Selection handler
    const handleSelectionChange = useCallback((announcements: Announcement[]) => {
        setSelectedAnnouncements(announcements);
    }, []);

    // Drawer handlers
    const handleOpenDrawer = useCallback(() => {
        setShowFilterPanel(true);
        setDrawerClosing(false);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setDrawerClosing(true);
        setTimeout(() => {
            setShowFilterPanel(false);
            setDrawerClosing(false);
        }, 300); // Match transition duration
    }, []);

    return {
        currentPage,
        recordsPerPage,
        searchQuery,
        sortConfig,
        filters,
        selectedView,
        selectedAnnouncements,
        showFilterPanel,
        drawerClosing,
        
        handlePageChange,
        handleRecordsPerPageChange,
        handleSearch,
        handleSort,
        handleFiltersApply,
        handleFiltersReset,
        handleViewChange,
        handleSelectionChange,
        handleOpenDrawer,
        handleCloseDrawer,
        setSelectedAnnouncements,
    };
}