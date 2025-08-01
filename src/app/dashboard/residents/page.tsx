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
import DataTable from '@/app/components/ui/DataTable';
import FilterPanel from '@/app/components/ui/FilterPanel';
import ExportDropdown from '@/app/components/ui/ExportDropdown';
import { ToastContainer } from '@/app/components/ui/Toast';
import BulkMessageModal from '@/app/components/ui/BulkMessageModal';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { useToast } from '@/hooks/useToast';
import { useResidentsData } from '@/hooks/useResidentsData';
import { useResidentsFilters } from '@/hooks/useResidentsFilters';
import { useResidentsActions } from '@/hooks/useResidentsActions';
import { useResidentsUI } from '@/hooks/useResidentsUI';
import { useResidentsStats } from '@/hooks/useResidentsStats';
import { generateStatsCardsDataFromCounts } from './utils/stats';
import {
    Filter, Download, Plus, RefreshCw,
    ChevronRight, Eye, Edit, Phone, MessageSquare, QrCode, StickyNote, History, CreditCard, Trash2, UserCheck, UserX, CheckCircle, Users, Home, DollarSign, Calendar
} from 'lucide-react';
import { Resident } from '@/app/components/ui/ResidentRow';

// Import view components
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
import Checkbox from '@/app/components/ui/Checkbox';
import TablePagination from '@/app/components/ui/TablePagination';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import PaymentHistoryModal from '@/app/components/ui/PaymentHistoryModal';
import { Bill } from '@/services/billing.service';

// Import our extracted utilities and configurations
import {
    VIEW_OPTIONS,
    BREADCRUMB_ITEMS,
    DEFAULT_VALUES
} from './constants';
import { createBulkActionHandlers } from './actions/bulk-actions';
import { createResidentActionHandlers } from './actions/resident-actions';
import { createExportActionHandlers } from './actions/export-actions';
import { getTableColumns } from './components/table-columns';
import Portal from '@/app/components/ui/Portal';

const residentFilterGroups = [
    {
        id: 'status',
        label: 'Durum',
        type: 'multiselect' as const,
        icon: CheckCircle,
        options: [
            { id: 'active', label: 'Aktif', value: 'active' },
            { id: 'pending', label: 'Beklemede', value: 'pending' },
            { id: 'inactive', label: 'Pasif', value: 'inactive' },
            { id: 'suspended', label: 'Askıya Alınmış', value: 'suspended' },
        ],
    },
    {
        id: 'type',
        label: 'Sakin Tipi',
        type: 'multiselect' as const,
        icon: Users,
        options: [
            { id: 'owner', label: 'Malik', value: 'resident' },
            { id: 'tenant', label: 'Kiracı', value: 'tenant' },
            { id: 'guest', label: 'Misafir', value: 'guest' },
        ],
    },
];

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

    // Add confirmation modal state
    const [confirmationState, setConfirmationState] = useState<{
        isOpen: boolean;
        resident: Resident | null;
        loading: boolean;
    }>({
        isOpen: false,
        resident: null,
        loading: false
    });

    // Add bulk delete modal state
    const [bulkDeleteState, setBulkDeleteState] = useState<{
        isOpen: boolean;
        residents: Resident[];
        loading: boolean;
    }>({
        isOpen: false,
        residents: [],
        loading: false
    });

    // Ödeme geçmişi modalı için state
    const [paymentHistoryModal, setPaymentHistoryModal] = useState<{
        isOpen: boolean;
        resident: Resident | null;
        bills: Bill[];
        loading: boolean;
        error: string | null;
    }>({
        isOpen: false,
        resident: null,
        bills: [],
        loading: false,
        error: null,
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

    // NEW: Use the new stats hook
    const stats = useResidentsStats();
    const statsData = generateStatsCardsDataFromCounts(stats);

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
        setMessageState,
        dataUpdateFunctions,
        bulkDeleteState,
        setBulkDeleteState
    );
    const residentActionHandlers = createResidentActionHandlers(
        toastFunctions,
        dataUpdateFunctions,
        dataHook.residents
    );
    const exportActionHandlers = createExportActionHandlers(toastFunctions);

    // Generate configuration data - regenerate when selected residents change
    const bulkActions = useMemo(() => 
        bulkActionHandlers.getBulkActions(filtersHook.selectedResidents),
        [filtersHook.selectedResidents, bulkActionHandlers]
    );

    // Create wrapper for table actions - only need view action for detail navigation
    const tableActionHandlers = {
        handleViewResident: residentActionHandlers.handleViewResident,
    };

    const tableColumns = getTableColumns(tableActionHandlers);

    // Handle delete confirmation
    const handleDeleteConfirmation = useCallback(async () => {
        if (!confirmationState.resident) return;

        setConfirmationState(prev => ({ ...prev, loading: true }));

        try {
            await residentActionHandlers.handleDeleteResident(confirmationState.resident);
            setConfirmationState({ isOpen: false, resident: null, loading: false });
        } catch (error) {
            setConfirmationState(prev => ({ ...prev, loading: false }));
        }
    }, [confirmationState.resident, residentActionHandlers]);

    // Handle bulk delete confirmation
    const handleBulkDeleteConfirmation = useCallback(async () => {
        await bulkActionHandlers.executeBulkDelete();
    }, [bulkActionHandlers]);

    // Create unified action handler for view components
    const handleResidentAction = useCallback(async (action: string, resident: Resident) => {
        switch (action) {
            case 'view':
                residentActionHandlers.handleViewResident(resident);
                break;
            case 'edit':
                residentActionHandlers.handleEditResident(resident);
                break;
            case 'delete':
                // Open confirmation modal instead of direct deletion
                setConfirmationState({
                    isOpen: true,
                    resident: resident,
                    loading: false
                });
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
            case 'deactivate':
                residentActionHandlers.handleUpdateResidentStatus &&
                    residentActionHandlers.handleUpdateResidentStatus(resident, 'INACTIVE');
                break;
            case 'activate':
                residentActionHandlers.handleUpdateResidentStatus &&
                    residentActionHandlers.handleUpdateResidentStatus(resident, 'ACTIVE');
                break;
            case 'payment-history': {
                setPaymentHistoryModal({
                    isOpen: true,
                    resident,
                    bills: [],
                    loading: true,
                    error: null,
                });
                try {
                    const { bills, error } = await actionsHook.handleViewPaymentHistory(resident);
                    setPaymentHistoryModal(prev => ({
                        ...prev,
                        bills,
                        loading: false,
                        error: error || null,
                    }));
                } catch (err: any) {
                    setPaymentHistoryModal(prev => ({
                        ...prev,
                        loading: false,
                        error: err?.message || 'Ödeme geçmişi alınamadı.',
                    }));
                }
                break;
            }
            default:
                console.warn('Unknown action:', action);
        }
    }, [residentActionHandlers, actionsHook]);

    // Filter groups configuration
    const filterGroups = residentFilterGroups;

    // Event handlers (orchestration only)
    const handleAddNewResident = useCallback(() => {
        router.push('/dashboard/residents/add');
    }, [router]);

    const handleRefresh = useCallback(() => {
        uiHook.handleRefresh();
    }, [uiHook]);

    // 1. Local search input state
    const [searchInput, setSearchInput] = useState(filtersHook.searchQuery || "");

    // 2. Input değişimini yöneten handler
    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    // 3. Debounce sonrası API çağrısını tetikleyen handler
    const handleSearchSubmit = useCallback((value: string) => {
        filtersHook.handleSearch(value); // Sadece burada API çağrısı yapılmalı
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

    // Resident card renderer for grid view
    const renderResidentCard = (resident: Resident, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: Resident }>) => {
        return (
            <ui.Card
                key={resident.id}
                className="p-6 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg group"
            >
                {/* Header: Checkbox + Name + Menu */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <ui.Checkbox
                            checked={selectedItems.includes(resident.id)}
                            onChange={() => onSelect(resident.id)}
                            className="focus:ring-2 focus:ring-primary-gold/30"
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-on-dark tracking-tight">
                                {resident.firstName} {resident.lastName}
                            </h3>
                            <p className="text-sm text-text-light-secondary dark:text-text-secondary font-medium mt-1">
                                {resident.address?.apartment}
                            </p>
                            {/* Membership Tier Badge */}
                            {(() => {
                                const membershipTier = resident.membershipTier || 'Standart';
                                if (membershipTier === 'Altın') {
                                    return (
                                        <ui.Badge
                                            variant="soft"
                                            color="gold"
                                            className="min-w-[88px] text-center justify-center text-xs px-3 py-1 rounded-full font-medium mt-2"
                                        >
                                            {membershipTier}
                                        </ui.Badge>
                                    );
                                } else if (membershipTier === 'Gümüş') {
                                    return (
                                        <ui.Badge
                                            variant="soft"
                                            color="secondary"
                                            className="min-w-[88px] text-center justify-center text-xs px-3 py-1 rounded-full font-medium mt-2"
                                        >
                                            {membershipTier}
                                        </ui.Badge>
                                    );
                                } else {
                                    return (
                                        <ui.Badge className="min-w-[88px] text-center justify-center text-xs px-3 py-1 rounded-full font-medium mt-2">
                                            {membershipTier}
                                        </ui.Badge>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                    {ActionMenu && <ActionMenu row={resident} />}
                </div>
                
                {/* Status and Type Badges */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <ui.Badge variant="soft" color={getStatusColor(resident.status)} className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <span
                            className="w-2 h-2 rounded-full inline-block border border-gray-300 dark:border-gray-700 mr-1"
                            style={{
                                backgroundColor:
                                    getStatusColor(resident.status) === 'primary' ? '#22C55E' :
                                    getStatusColor(resident.status) === 'gold' ? '#AC8D6A' :
                                    getStatusColor(resident.status) === 'red' ? '#E53E3E' :
                                    getStatusColor(resident.status) === 'accent' ? '#718096' :
                                    '#A8A29E',
                            }}
                            title={resident.status?.label}
                        />
                        {resident.status?.label}
                    </ui.Badge>
                    
                    {resident.verificationStatus && (
                        <ui.Badge
                            variant="outline"
                            color={
                                resident.verificationStatus.color === 'green' ? 'primary' :
                                resident.verificationStatus.color === 'yellow' ? 'gold' :
                                resident.verificationStatus.color === 'red' ? 'red' :
                                'secondary'
                            }
                            className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
                        >
                            {resident.verificationStatus.label}
                        </ui.Badge>
                    )}
                    
                    <ui.Badge
                        variant="soft"
                        className={
                            `text-xs px-3 py-1 rounded-full font-medium text-black ` +
                            (resident.residentType?.label === "Malik"
                                ? "bg-green-100"
                                : resident.residentType?.label === "Kiracı"
                                ? "bg-blue-100"
                                : "")
                        }
                    >
                        {resident.residentType?.label}
                    </ui.Badge>
                </div>
                
                {/* Contact Information */}
                <div className="mt-4 flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-secondary">
                    {resident.contact?.phone && (
                        <div className="flex items-center gap-2">
                            <span>{resident.contact.phone}</span>
                        </div>
                    )}
                    {resident.contact?.email && (
                        <div className="flex items-center gap-2">
                            <span>{resident.contact.email}</span>
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                {/* <div className="mt-6 flex gap-3">
                    {resident.contact?.phone && (
                        <ui.Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleResidentAction('call', resident)}
                            className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                        >
                            Ara
                        </ui.Button>
                    )}
                    <ui.Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleResidentAction('message', resident)}
                        className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                    >
                        Mesaj
                    </ui.Button>
                </div> */}
            </ui.Card>
        );
    };
    const getStatusColor = (status: any) => {
        switch (status?.color) {
            case 'green': return 'primary';
            case 'yellow': return 'gold';
            case 'red': return 'red';
            case 'blue': return 'accent';
            default: return 'secondary';
        }
    };
    const getTypeColor = (type: any) => {
        switch (type?.color) {
            case 'blue': return 'primary';
            case 'green': return 'accent';
            case 'purple': return 'accent';
            default: return 'secondary';
        }
    };

    // Resident Action Menu Component - Simplified to only show detail view
    const ResidentActionMenu: React.FC<{ resident: Resident; onAction: (action: string, resident: Resident) => void }> = ({ resident, onAction }) => {
        const handleDetailView = (e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('view', resident);
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

    // Wrapper: ActionMenuComponent tipi { row: Resident }
    const ResidentActionMenuWrapper: React.FC<{ row: Resident }> = ({ row }) => (
        <ResidentActionMenu resident={row} onAction={handleResidentAction} />
    );

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
                                    onExportExcel={() => exportActionHandlers.handleExportExcel({
                                        ...filtersHook.filters,
                                        search: filtersHook.searchQuery,
                                        orderColumn: !filtersHook.searchQuery ? 'firstName' : filtersHook.sortConfig.key,
                                        orderBy: filtersHook.sortConfig.direction ? filtersHook.sortConfig.direction.toUpperCase() as 'ASC' | 'DESC' : undefined,
                                        // page ve limit gönderme
                                    })}
                                    onExportCSV={() => exportActionHandlers.handleExportCSV({
                                        ...filtersHook.filters,
                                        search: filtersHook.searchQuery,
                                        orderColumn: !filtersHook.searchQuery ? 'firstName' : filtersHook.sortConfig.key,
                                        orderBy: filtersHook.sortConfig.direction ? filtersHook.sortConfig.direction.toUpperCase() as 'ASC' | 'DESC' : undefined,
                                        // page ve limit gönderme
                                    })}
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
                                    loading={stats.loading}
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
                            <GenericListView
                                data={dataHook.residents}
                                loading={dataHook.loading}
                                error={dataHook.apiError}
                                onSelectionChange={filtersHook.handleSelectionChange}
                                bulkActions={bulkActions}
                                columns={getTableColumns(tableActionHandlers, ResidentActionMenuWrapper)}
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
                                    filtersHook.searchQuery ?
                                        `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                        'Henüz sakin kaydı bulunmuyor.'
                                }
                                ActionMenuComponent={ResidentActionMenuWrapper}
                            />
                        )}

                        {filtersHook.selectedView === 'grid' && (
                            <GenericGridView
                                data={dataHook.residents}
                                loading={dataHook.loading}
                                error={dataHook.apiError}
                                onSelectionChange={(selectedIds) => {
                                    const selectedResidents = dataHook.residents.filter(r => selectedIds.includes(r.id));
                                    filtersHook.handleSelectionChange(selectedResidents);
                                }}
                                bulkActions={bulkActions}
                                onAction={handleResidentAction}
                                selectedItems={filtersHook.selectedResidents.map(r => r.id)}
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
                                        'Henüz sakin kaydı bulunmuyor.'
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
                                ActionMenu={ResidentActionMenuWrapper}
                                renderCard={renderResidentCard}
                                getItemId={(resident) => resident.id}
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

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationState.isOpen}
                    onClose={() => setConfirmationState({ isOpen: false, resident: null, loading: false })}
                    onConfirm={handleDeleteConfirmation}
                    title="Sakin Silme"
                    variant="danger"
                    loading={confirmationState.loading}
                    itemName={confirmationState.resident?.fullName}
                    itemType="sakin"
                />

                {/* Bulk Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={bulkDeleteState.isOpen}
                    onClose={() => setBulkDeleteState({ isOpen: false, residents: [], loading: false })}
                    onConfirm={handleBulkDeleteConfirmation}
                    title="Toplu Silme İşlemi"
                    description={`${bulkDeleteState.residents.length} sakin kalıcı olarak silinecektir. Bu işlem geri alınamaz.`}
                    confirmText="Hepsini Sil"
                    variant="danger"
                    loading={bulkDeleteState.loading}
                    itemType="sakinler"
                />

                {/* Payment History Modal */}
                <PaymentHistoryModal
                    isOpen={paymentHistoryModal.isOpen}
                    onClose={() => setPaymentHistoryModal(prev => ({ ...prev, isOpen: false }))}
                    bills={paymentHistoryModal.bills}
                    residentName={paymentHistoryModal.resident?.fullName || ''}
                    loading={paymentHistoryModal.loading}
                    error={paymentHistoryModal.error}
                />

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
} 