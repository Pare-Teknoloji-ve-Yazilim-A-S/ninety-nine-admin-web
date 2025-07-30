'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import StatsCard from '@/app/components/ui/StatsCard';
import ViewToggle from '@/app/components/ui/ViewToggle';
import FilterPanel from '@/app/components/ui/FilterPanel';
import ExportDropdown from '@/app/components/ui/ExportDropdown';
import { ToastContainer } from '@/app/components/ui/Toast';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { useToast } from '@/hooks/useToast';
import {
    Filter, Download, Plus, RefreshCw, ChevronRight, Eye, Edit, 
    AlertTriangle, Pin, Archive, Send, Copy, Trash2, 
    MessageSquare, Calendar, Hash, Settings
} from 'lucide-react';
import type { Announcement } from '@/services/types/announcement.types';

// Import view components
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
import Checkbox from '@/app/components/ui/Checkbox';
import TablePagination from '@/app/components/ui/TablePagination';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';

// Import our hooks and configurations
import { useAnnouncementsData } from './hooks/useAnnouncementsData';
import { useAnnouncementsFilters } from './hooks/useAnnouncementsFilters';
import { useAnnouncementsStats } from './hooks/useAnnouncementsStats';
import { createBulkActionHandlers } from './actions/bulk-actions';
import { createAnnouncementActionHandlers } from './actions/announcement-actions';
import { getTableColumns } from './components/table-columns';
import {
    VIEW_OPTIONS,
    BREADCRUMB_ITEMS,
    ANNOUNCEMENT_FILTER_GROUPS,
    STATS_CONFIG
} from './constants';
import {
    getAnnouncementTypeLabel,
    getAnnouncementStatusLabel,
    getAnnouncementTypeColor,
    getAnnouncementStatusColor,
    isAnnouncementExpired,
    isAnnouncementExpiringSoon,
    getDaysUntilExpiry
} from '@/services/types/announcement.types';

/**
 * Main Announcements Page Component
 * 
 * This component follows SOLID principles and the established architecture:
 * - Single Responsibility: Only handles orchestration of the announcements page
 * - Open/Closed: Extensible through configuration and dependency injection
 * - Dependency Inversion: Depends on abstractions (hooks, services) not concrete implementations
 */
export default function AnnouncementsPage() {
    const router = useRouter();
    const { toasts, removeToast } = useToast();

    // UI State for modals and bulk actions
    const [bulkDeleteState, setBulkDeleteState] = useState<{
        isOpen: boolean;
        announcements: Announcement[];
        loading: boolean;
    }>({
        isOpen: false,
        announcements: [],
        loading: false
    });

    const [confirmationState, setConfirmationState] = useState<{
        isOpen: boolean;
        announcement: Announcement | null;
        loading: boolean;
    }>({
        isOpen: false,
        announcement: null,
        loading: false
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize all hooks for data management
    const filtersHook = useAnnouncementsFilters();
    const dataHook = useAnnouncementsData({
        currentPage: filtersHook.currentPage,
        recordsPerPage: filtersHook.recordsPerPage,
        searchQuery: filtersHook.searchQuery,
        sortConfig: filtersHook.sortConfig,
        filters: filtersHook.filters
    });
    const statsHook = useAnnouncementsStats();

    // Create action handlers with dependency injection
    const toastFunctions = {
        success: useCallback((title: string, message: string) => {
            console.log(`✓ ${title}: ${message}`);
        }, []),
        info: useCallback((title: string, message: string) => {
            console.info(`${title}: ${message}`);
        }, []),
        error: useCallback((title: string, message: string) => {
            console.error(`✗ ${title}: ${message}`);
        }, [])
    };

    const dataUpdateFunctions = {
        setAnnouncements: dataHook.setAnnouncements,
        refreshData: dataHook.refreshData
    };

    // Initialize action handlers
    const bulkActionHandlers = createBulkActionHandlers(
        toastFunctions,
        dataUpdateFunctions,
        bulkDeleteState,
        setBulkDeleteState
    );
    const announcementActionHandlers = createAnnouncementActionHandlers(
        toastFunctions,
        dataUpdateFunctions,
        dataHook.announcements
    );

    // Generate configuration data - regenerate when selected announcements change
    const bulkActions = useMemo(() => 
        bulkActionHandlers.getBulkActions(filtersHook.selectedAnnouncements),
        [filtersHook.selectedAnnouncements, bulkActionHandlers]
    );

    // Create wrapper for table actions
    const tableActionHandlers = {
        handleViewAnnouncement: announcementActionHandlers.handleViewAnnouncement,
    };

    const tableColumns = getTableColumns(tableActionHandlers);

    // Generate stats data
    const statsData = useMemo(() => {
        if (!statsHook.stats) return [];
        
        return STATS_CONFIG.map(config => {
            const statValue = statsHook.stats![config.key as keyof typeof statsHook.stats];
            // Handle both simple numbers and nested objects
            const value = typeof statValue === 'object' ? 0 : (statValue || 0);
            
            return {
                title: config.title,
                value: value,
                color: config.color === 'red' ? 'danger' : 
                       config.color === 'secondary' ? 'info' : 
                       config.color,
                icon: config.icon,
                loading: statsHook.loading
            };
        });
    }, [statsHook.stats, statsHook.loading]);

    // Handle delete confirmation
    const handleDeleteConfirmation = useCallback(async () => {
        if (!confirmationState.announcement) return;

        setConfirmationState(prev => ({ ...prev, loading: true }));

        try {
            await announcementActionHandlers.handleDeleteAnnouncement(confirmationState.announcement);
            setConfirmationState({ isOpen: false, announcement: null, loading: false });
        } catch (error) {
            setConfirmationState(prev => ({ ...prev, loading: false }));
        }
    }, [confirmationState.announcement, announcementActionHandlers]);

    // Handle bulk delete confirmation
    const handleBulkDeleteConfirmation = useCallback(async () => {
        await bulkActionHandlers.executeBulkDelete();
    }, [bulkActionHandlers]);

    // Create unified action handler for view components
    const handleAnnouncementAction = useCallback(async (action: string, announcement: Announcement) => {
        switch (action) {
            case 'view':
                announcementActionHandlers.handleViewAnnouncement(announcement);
                break;
            case 'edit':
                announcementActionHandlers.handleEditAnnouncement(announcement);
                break;
            case 'delete':
                // Open confirmation modal instead of direct deletion
                setConfirmationState({
                    isOpen: true,
                    announcement: announcement,
                    loading: false
                });
                break;
            case 'publish':
                announcementActionHandlers.handlePublishAnnouncement(announcement);
                break;
            case 'archive':
                announcementActionHandlers.handleArchiveAnnouncement(announcement);
                break;
            case 'toggle_pin':
                announcementActionHandlers.handleTogglePin(announcement);
                break;
            case 'toggle_emergency':
                announcementActionHandlers.handleToggleEmergency(announcement);
                break;
            case 'duplicate':
                announcementActionHandlers.handleDuplicateAnnouncement(announcement);
                break;
            case 'more':
                // Handle more actions menu
                console.log('More actions for announcement:', announcement.title);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }, [announcementActionHandlers]);

    // Event handlers (orchestration only)
    const handleAddNewAnnouncement = useCallback(() => {
        router.push('/dashboard/announcements/add');
    }, [router]);

    const handleRefresh = useCallback(() => {
        dataHook.refreshData();
        statsHook.refreshStats();
    }, [dataHook, statsHook]);

    // Search input state management
    const [searchInput, setSearchInput] = useState(filtersHook.searchQuery || "");

    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    const handleSearchSubmit = useCallback((value: string) => {
        filtersHook.handleSearch(value);
    }, [filtersHook]);

    // Lifecycle effects
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && filtersHook.showFilterPanel) {
                filtersHook.handleCloseDrawer();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [filtersHook.showFilterPanel, filtersHook.handleCloseDrawer]);

    useEffect(() => {
        if (filtersHook.showFilterPanel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [filtersHook.showFilterPanel]);

    // Announcement card renderer for grid view
    const renderAnnouncementCard = (announcement: Announcement, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: Announcement }>) => {
        const isExpired = isAnnouncementExpired(announcement);
        const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
        const daysUntilExpiry = getDaysUntilExpiry(announcement);

        return (
            <ui.Card
                key={announcement.id}
                className="p-6 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg group"
            >
                {/* Header: Checkbox + Title + Menu */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <ui.Checkbox
                            checked={selectedItems.includes(announcement.id)}
                            onChange={() => onSelect(announcement.id)}
                            className="focus:ring-2 focus:ring-primary-gold/30"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-on-dark tracking-tight">
                                    {announcement.title}
                                </h3>
                                {announcement.isPinned && (
                                    <Pin className="w-4 h-4 text-primary-gold" />
                                )}
                                {announcement.isEmergency && (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                            <p className="text-sm text-text-light-secondary dark:text-text-secondary font-medium line-clamp-3">
                                {announcement.content}
                            </p>
                        </div>
                    </div>
                    {ActionMenu && <ActionMenu row={announcement} />}
                </div>
                
                {/* Status and Type Badges */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <ui.Badge
                        variant="soft"
                        color={getAnnouncementStatusColor(announcement.status)}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                        {getAnnouncementStatusLabel(announcement.status)}
                    </ui.Badge>
                    
                    <ui.Badge
                        variant="soft"
                        color={getAnnouncementTypeColor(announcement.type)}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                        {getAnnouncementTypeLabel(announcement.type)}
                    </ui.Badge>

                    {isExpired && (
                        <ui.Badge
                            variant="soft"
                            color="red"
                            className="text-xs px-3 py-1 rounded-full font-medium"
                        >
                            Süresi Dolmuş
                        </ui.Badge>
                    )}

                    {isExpiringSoon && !isExpired && (
                        <ui.Badge
                            variant="soft"
                            color="gold"
                            className="text-xs px-3 py-1 rounded-full font-medium"
                        >
                            Yakında Bitiyor
                        </ui.Badge>
                    )}
                </div>
                
                {/* Date Information */}
                <div className="mt-4 flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-secondary">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Oluşturulma: {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {announcement.publishDate && (
                        <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            <span>Yayınlanma: {new Date(announcement.publishDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                    )}
                    {announcement.expiryDate && (
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>
                                Bitiş: {new Date(announcement.expiryDate).toLocaleDateString('tr-TR')}
                                {daysUntilExpiry !== undefined && (
                                    <span className={`ml-1 ${
                                        isExpired ? 'text-red-500' : 
                                        isExpiringSoon ? 'text-yellow-500' : 
                                        ''
                                    }`}>
                                        ({isExpired 
                                            ? `${Math.abs(daysUntilExpiry)} gün geçti`
                                            : `${daysUntilExpiry} gün kaldı`
                                        })
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Creator Information */}
                <div className="mt-4 flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                    <span>
                        Oluşturan: {announcement.createdBy 
                            ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`
                            : 'Bilinmiyor'
                        }
                    </span>
                </div>
            </ui.Card>
        );
    };

    // Announcement Action Menu Component
    const AnnouncementActionMenu: React.FC<{ announcement: Announcement; onAction: (action: string, announcement: Announcement) => void }> = ({ announcement, onAction }) => {
        const handleDetailView = (e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('view', announcement);
        };

        return (
            <div className="flex items-center justify-center">
                <button
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                    onClick={handleDetailView}
                    type="button"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    // Wrapper: ActionMenuComponent tipi { row: Announcement }
    const AnnouncementActionMenuWrapper: React.FC<{ row: Announcement }> = ({ row }) => (
        <AnnouncementActionMenu announcement={row} onAction={handleAnnouncementAction} />
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader
                        title="Duyuru Listesi"
                        breadcrumbItems={BREADCRUMB_ITEMS}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    Duyurular <span className="text-primary-gold">
                                        ({dataHook.totalRecords.toLocaleString()} {filtersHook.searchQuery ? 'filtrelenmiş' : 'toplam'})
                                    </span>
                                </h2>
                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Son güncelleme: {dataHook.lastUpdated.toLocaleTimeString('tr-TR')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleRefresh}>
                                    Yenile
                                </Button>
                                <ExportDropdown
                                    onExportExcel={() => {
                                        console.log('Export Excel');
                                        toastFunctions.info('Bilgi', 'Excel export özelliği yakında gelecek');
                                    }}
                                    onExportCSV={() => {
                                        console.log('Export CSV');
                                        toastFunctions.info('Bilgi', 'CSV export özelliği yakında gelecek');
                                    }}
                                    variant="secondary"
                                    size="md"
                                />
                                <Button variant="primary" size="md" icon={Plus} onClick={handleAddNewAnnouncement}>
                                    Yeni Duyuru
                                </Button>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder="Başlık, içerik ile ara..."
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            onSearch={handleSearchSubmit}
                                            showAdvancedFilter={true}
                                            onAdvancedFilterClick={filtersHook.handleOpenDrawer}
                                            debounceMs={500}
                                        />
                                    </div>

                                    {/* Filter and View Toggle */}
                                    <div className="flex gap-2 items-center">
                                        <div className="relative">
                                            <Button
                                                variant="secondary"
                                                size="md"
                                                icon={Filter}
                                                onClick={filtersHook.handleOpenDrawer}
                                            >
                                                Filtreler
                                            </Button>
                                            {Object.keys(filtersHook.filters).length > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-primary-gold text-primary-dark-gray text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                                    {Object.keys(filtersHook.filters).length}
                                                </span>
                                            )}
                                        </div>
                                        <ViewToggle
                                            options={VIEW_OPTIONS}
                                            activeView={filtersHook.selectedView}
                                            onViewChange={(viewId) => filtersHook.handleViewChange(viewId as 'table' | 'grid')}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            {statsData.map((stat) => (
                                <StatsCard
                                    key={stat.title}
                                    title={stat.title}
                                    value={stat.value}
                                    color={stat.color as 'primary' | 'gold' | 'danger' | 'success' | 'warning' | 'info'}
                                    icon={stat.icon}
                                    size="md"
                                    loading={stat.loading}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {dataHook.apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">{dataHook.apiError}</p>
                            </div>
                        )}

                        {/* Announcements Views */}
                        {filtersHook.selectedView === 'table' && (
                            <GenericListView
                                data={dataHook.announcements}
                                loading={dataHook.loading}
                                error={dataHook.apiError}
                                onSelectionChange={filtersHook.handleSelectionChange}
                                bulkActions={bulkActions.map(action => ({
                                    ...action,
                                    variant: action.variant === 'primary' ? 'default' : action.variant as any,
                                    onClick: (items: Announcement[]) => action.onClick()
                                }))}
                                columns={getTableColumns(tableActionHandlers, AnnouncementActionMenuWrapper)}
                                sortConfig={filtersHook.sortConfig}
                                onSortChange={(key, direction) => filtersHook.handleSort({ key: key as keyof Announcement, direction })}
                                pagination={{
                                    currentPage: filtersHook.currentPage,
                                    totalPages: dataHook.totalPages,
                                    totalRecords: dataHook.totalRecords,
                                    recordsPerPage: filtersHook.recordsPerPage,
                                    onPageChange: filtersHook.handlePageChange,
                                    onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                }}
                                emptyStateMessage={
                                    filtersHook.searchQuery ?
                                        `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                        'Henüz duyuru kaydı bulunmuyor.'
                                }
                                ActionMenuComponent={AnnouncementActionMenuWrapper}
                            />
                        )}

                        {filtersHook.selectedView === 'grid' && (
                            <GenericGridView
                                data={dataHook.announcements}
                                loading={dataHook.loading}
                                error={dataHook.apiError}
                                onSelectionChange={(selectedIds) => {
                                    const selectedAnnouncements = dataHook.announcements.filter(a => selectedIds.includes(a.id));
                                    filtersHook.handleSelectionChange(selectedAnnouncements);
                                }}
                                bulkActions={bulkActions.map(action => ({
                                    ...action,
                                    variant: action.variant === 'primary' ? 'default' : action.variant as any,
                                    onClick: (items: Announcement[]) => action.onClick()
                                }))}
                                onAction={handleAnnouncementAction}
                                selectedItems={filtersHook.selectedAnnouncements.map(a => a.id)}
                                pagination={{
                                    currentPage: filtersHook.currentPage,
                                    totalPages: dataHook.totalPages,
                                    totalRecords: dataHook.totalRecords,
                                    recordsPerPage: filtersHook.recordsPerPage,
                                    onPageChange: filtersHook.handlePageChange,
                                    onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                }}
                                emptyStateMessage={
                                    filtersHook.searchQuery ?
                                        `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                        'Henüz duyuru kaydı bulunmuyor.'
                                }
                                ui={{
                                    Card,
                                    Button,
                                    Checkbox,
                                    TablePagination,
                                    Badge,
                                    EmptyState,
                                    Skeleton,
                                    BulkActionsBar,
                                }}
                                ActionMenu={AnnouncementActionMenuWrapper}
                                renderCard={renderAnnouncementCard}
                                getItemId={(announcement) => announcement.id}
                            />
                        )}
                    </main>
                </div>

                {/* Filter Panel Drawer */}
                <div className={`fixed inset-0 z-50 ${filtersHook.showFilterPanel ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${filtersHook.showFilterPanel && !filtersHook.drawerClosing ? 'opacity-50' : 'opacity-0'
                            }`}
                        onClick={filtersHook.handleCloseDrawer}
                    />

                    {/* Drawer */}
                    <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background-light-card dark:bg-background-card shadow-2xl transform transition-transform duration-300 ease-in-out ${filtersHook.showFilterPanel && !filtersHook.drawerClosing ? 'translate-x-0' : 'translate-x-full'
                        }`}>
                        <FilterPanel
                            filterGroups={ANNOUNCEMENT_FILTER_GROUPS}
                            onApplyFilters={filtersHook.handleFiltersApply}
                            onResetFilters={filtersHook.handleFiltersReset}
                            onClose={filtersHook.handleCloseDrawer}
                            variant="sidebar"
                        />
                    </div>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationState.isOpen}
                    onClose={() => setConfirmationState({ isOpen: false, announcement: null, loading: false })}
                    onConfirm={handleDeleteConfirmation}
                    title="Duyuru Silme"
                    variant="danger"
                    loading={confirmationState.loading}
                    itemName={confirmationState.announcement?.title}
                    itemType="duyuru"
                />

                {/* Bulk Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={bulkDeleteState.isOpen}
                    onClose={() => setBulkDeleteState({ isOpen: false, announcements: [], loading: false })}
                    onConfirm={handleBulkDeleteConfirmation}
                    title="Toplu Silme İşlemi"
                    description={`${bulkDeleteState.announcements.length} duyuru kalıcı olarak silinecektir. Bu işlem geri alınamaz.`}
                    confirmText="Hepsini Sil"
                    variant="danger"
                    loading={bulkDeleteState.loading}
                    itemType="duyurular"
                />

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
}