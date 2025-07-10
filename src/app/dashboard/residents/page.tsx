'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import StatsCard from '@/app/components/ui/StatsCard';
import ViewToggle from '@/app/components/ui/ViewToggle';
import DataTable from '@/app/components/ui/DataTable';
import FilterPanel, { commonFilterGroups } from '@/app/components/ui/FilterPanel';
import ExportDropdown from '@/app/components/ui/ExportDropdown';
import { ToastContainer } from '@/app/components/ui/Toast';
import BulkMessageModal from '@/app/components/ui/BulkMessageModal';
import { useToast } from '@/hooks/useToast';
import { useResidentsData } from '@/hooks/useResidentsData';
import { useResidentsFilters } from '@/hooks/useResidentsFilters';
import { useResidentsActions } from '@/hooks/useResidentsActions';
import { useResidentsUI } from '@/hooks/useResidentsUI';
import { Filter, Download, Plus, RefreshCw } from 'lucide-react';
import { Resident } from '@/app/components/ui/ResidentRow';

// Import view components
import ResidentListView from './components/ResidentListView';
import ResidentGridView from './components/ResidentGridView';

// Import our extracted utilities and configurations
import { 
    VIEW_OPTIONS, 
    BREADCRUMB_ITEMS, 
    DEFAULT_VALUES 
} from './constants';
import { generateStatsCardsData } from './utils/stats';
import { createBulkActionHandlers } from './actions/bulk-actions';
import { createResidentActionHandlers } from './actions/resident-actions';
import { createExportActionHandlers } from './actions/export-actions';
import { getTableColumns } from './components/table-columns';

/**
 * Main Residents Page Component
 * 
 * This component follows SOLID principles:
 * - Single Responsibility: Only handles orchestration of the residents page
 * - Open/Closed: Extensible through configuration and dependency injection
 * - Dependency Inversion: Depends on abstractions (hooks, services) not concrete implementations
 */
export default function ResidentsPage() {
    const router = useRouter();
    const { toasts, removeToast } = useToast();

    // Add message modal state
    const [messageState, setMessageState] = useState<{
        isOpen: boolean;
        type: 'email' | 'sms' | null;
        recipients: Resident[];
    }>({
        isOpen: false,
        type: null,
        recipients: []
    });

    // Initialize all hooks for data management
    const filtersHook = useResidentsFilters();
    const dataHook = useResidentsData({
        currentPage: filtersHook.currentPage,
        recordsPerPage: filtersHook.recordsPerPage,
        searchQuery: filtersHook.searchQuery,
        sortConfig: filtersHook.sortConfig,
        filters: filtersHook.filters
    });
    const actionsHook = useResidentsActions({
        refreshData: dataHook.refreshData,
        setSelectedResidents: filtersHook.setSelectedResidents,
        setResidents: dataHook.setResidents
    });
    const uiHook = useResidentsUI({
        refreshData: dataHook.refreshData
    });

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
        setResidents: dataHook.setResidents,
        refreshData: dataHook.refreshData
    };

    // Initialize action handlers
    const bulkActionHandlers = createBulkActionHandlers(
        toastFunctions,
        messageState,
        setMessageState
    );
    const residentActionHandlers = createResidentActionHandlers(
        toastFunctions, 
        dataUpdateFunctions, 
        dataHook.residents
    );
    const exportActionHandlers = createExportActionHandlers(toastFunctions);

    // Generate configuration data
    const statsData = generateStatsCardsData(dataHook.stats);
    const bulkActions = bulkActionHandlers.getBulkActions();
    const tableColumns = getTableColumns(residentActionHandlers);

    // Create unified action handler for view components
    const handleResidentAction = useCallback((action: string, resident: Resident) => {
        switch (action) {
            case 'view':
                residentActionHandlers.handleViewResident(resident);
                break;
            case 'edit':
                residentActionHandlers.handleEditResident(resident);
                break;
            case 'delete':
                residentActionHandlers.handleDeleteResident(resident);
                break;
            case 'call':
                residentActionHandlers.handleCallResident(resident);
                break;
            case 'message':
                residentActionHandlers.handleMessageResident(resident);
                break;
            case 'more':
                // Handle more actions menu
                console.log('More actions for resident:', resident.fullName);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }, [residentActionHandlers]);

    // Filter groups configuration
    const filterGroups = [
        commonFilterGroups.residentStatus,
        commonFilterGroups.residentType,
        commonFilterGroups.building,
        commonFilterGroups.debtRange,
        commonFilterGroups.registrationDate,
    ];

    // Event handlers (orchestration only)
    const handleAddNewResident = useCallback(() => {
        router.push('/dashboard/residents/add');
    }, [router]);

    const handleRefresh = useCallback(() => {
        uiHook.handleRefresh();
    }, [uiHook]);

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

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={uiHook.sidebarOpen}
                    onClose={() => uiHook.setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader
                        title="Sakin Listesi"
                        breadcrumbItems={BREADCRUMB_ITEMS}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    Sakinler <span className="text-primary-gold">
                                        ({dataHook.totalRecords.toLocaleString()} {filtersHook.searchQuery ? 'filtrelenmiş' : 'aktif'})
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
                                    onExportPDF={exportActionHandlers.handleExportPDF}
                                    onExportExcel={exportActionHandlers.handleExportExcel}
                                    onExportCSV={exportActionHandlers.handleExportCSV}
                                    onExportJSON={exportActionHandlers.handleExportJSON}
                                    variant="secondary"
                                    size="md"
                                />
                                <Button variant="primary" size="md" icon={Plus} onClick={handleAddNewResident}>
                                    Yeni Sakin
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
                                            placeholder="Ad, soyad, pasaport, telefon, daire no ile ara..."
                                            value={filtersHook.searchQuery}
                                            onChange={filtersHook.handleSearch}
                                            showAdvancedFilter={true}
                                            onAdvancedFilterClick={filtersHook.handleOpenDrawer}
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
                                            onViewChange={filtersHook.handleViewChange}
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
                                    subtitle={stat.subtitle}
                                    color={stat.color}
                                    icon={stat.icon}
                                    size="md"
                                    loading={dataHook.loading && !dataHook.stats}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {dataHook.apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">{dataHook.apiError}</p>
                            </div>
                        )}

                        {/* Residents Views */}
                        {filtersHook.selectedView === 'table' && (
                            <ResidentListView
                                residents={dataHook.residents}
                                loading={dataHook.loading}
                                onSelectionChange={filtersHook.handleSelectionChange}
                                bulkActions={bulkActions}
                                columns={tableColumns}
                                sortConfig={filtersHook.sortConfig}
                                onSortChange={filtersHook.handleSort}
                                pagination={{
                                    currentPage: filtersHook.currentPage,
                                    totalPages: dataHook.totalPages,
                                    totalRecords: dataHook.totalRecords,
                                    recordsPerPage: filtersHook.recordsPerPage,
                                    onPageChange: filtersHook.handlePageChange,
                                    onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                }}
                                emptyStateMessage={
                                    dataHook.apiError ? 'Veri yüklenirken hata oluştu.' :
                                        filtersHook.searchQuery ?
                                            `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                            'Henüz sakin kaydı bulunmuyor.'
                                }
                            />
                        )}

                        {filtersHook.selectedView === 'grid' && (
                            <ResidentGridView
                                residents={dataHook.residents}
                                loading={dataHook.loading}
                                onSelectionChange={(selectedIds) => {
                                    const selectedResidents = dataHook.residents.filter(r => selectedIds.includes(r.id));
                                    filtersHook.handleSelectionChange(selectedResidents);
                                }}
                                bulkActions={bulkActions.map(action => ({
                                    ...action,
                                    onClick: (residents) => action.onClick(residents)
                                }))}
                                onAction={handleResidentAction}
                                selectedResidents={filtersHook.selectedResidents.map(r => r.id)}
                                pagination={{
                                    currentPage: filtersHook.currentPage,
                                    totalPages: dataHook.totalPages,
                                    totalRecords: dataHook.totalRecords,
                                    recordsPerPage: filtersHook.recordsPerPage,
                                    onPageChange: filtersHook.handlePageChange,
                                    onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                }}
                                emptyStateMessage={
                                    dataHook.apiError ? 'Veri yüklenirken hata oluştu.' :
                                        filtersHook.searchQuery ?
                                            `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                            'Henüz sakin kaydı bulunmuyor.'
                                }
                            />
                        )}
                    </main>
                </div>

                {/* Filter Panel Drawer */}
                <div className={`fixed inset-0 z-50 ${filtersHook.showFilterPanel ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                            filtersHook.showFilterPanel && !filtersHook.drawerClosing ? 'opacity-50' : 'opacity-0'
                        }`}
                        onClick={filtersHook.handleCloseDrawer}
                    />

                    {/* Drawer */}
                    <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background-light-card dark:bg-background-card shadow-2xl transform transition-transform duration-300 ease-in-out ${
                        filtersHook.showFilterPanel && !filtersHook.drawerClosing ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                        <FilterPanel
                            filterGroups={filterGroups}
                            onApplyFilters={filtersHook.handleFiltersApply}
                            onResetFilters={filtersHook.handleFiltersReset}
                            onClose={filtersHook.handleCloseDrawer}
                            variant="sidebar"
                        />
                    </div>
                </div>

                {/* Bulk Message Modal */}
                <BulkMessageModal
                    isOpen={messageState.isOpen}
                    onClose={() => setMessageState(prev => ({ ...prev, isOpen: false }))}
                    onSend={bulkActionHandlers.handleSendMessage}
                    type={messageState.type || 'email'}
                    recipientCount={messageState.recipients.length}
                />

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
} 