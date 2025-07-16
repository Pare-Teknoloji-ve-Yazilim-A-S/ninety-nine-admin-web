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
import {
    Filter, Download, Plus, RefreshCw,
    MoreVertical, Eye, Edit, Phone, MessageSquare, QrCode, StickyNote, History, CreditCard, Trash2, UserCheck, UserX, CheckCircle, Users, Home, DollarSign, Calendar
} from 'lucide-react';
import { Resident } from '@/app/components/ui/ResidentRow';

// Import view components
import ResidentGridTemplate, { ActionMenuProps } from '@/app/components/templates/GridList';
import Checkbox from '@/app/components/ui/Checkbox';
import TablePagination from '@/app/components/ui/TablePagination';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import ListView from '@/app/components/templates/ListView';
import PaymentHistoryModal from '@/app/components/ui/PaymentHistoryModal';
import { Bill } from '@/services/billing.service';

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
        type: 'radio' as const,
        icon: Users,
        options: [
            { id: 'owner', label: 'Malik', value: 'owner' },
            { id: 'tenant', label: 'Kiracı', value: 'tenant' },
            { id: 'guest', label: 'Misafir', value: 'guest' },
        ],
    },
 
    {
        id: 'debt',
        label: 'Borç Miktarı',
        type: 'numberrange' as const,
        icon: DollarSign,
    },
    {
        id: 'registrationDate',
        label: 'Kayıt Tarihi',
        type: 'daterange' as const,
        icon: Calendar,
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

    // Create wrapper for table actions that uses modal for delete
    const tableActionHandlers = {
        ...residentActionHandlers,
        handleDeleteResident: (resident: Resident) => {
            // Open confirmation modal instead of direct deletion
            setConfirmationState({
                isOpen: true,
                resident: resident,
                loading: false
            });
        }
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

    // Copy ActionMenu and color helpers from ResidentGridView:
    const ResidentActionMenu: React.FC<ActionMenuProps> = ({ resident, onAction }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const dropdownRef = React.useRef<HTMLDivElement>(null);
        const buttonRef = React.useRef<HTMLButtonElement>(null);

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    dropdownRef.current &&
                    buttonRef.current &&
                    !dropdownRef.current.contains(event.target as Node) &&
                    !buttonRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);
        const handleDropdownToggle = (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        };
        const handleAction = (action: string) => (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsOpen(false);
            onAction(action, resident);
        };
        // Yeni: Aktif/Pasif butonu için handler
        const handleToggleStatus = async (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsOpen(false);
            // Handler'ı parent'a ilet
            if (resident.status.type === 'active') {
                onAction('deactivate', resident);
            } else if (resident.status.type === 'inactive') {
                onAction('activate', resident);
            }
        };
        return (
            <div className="flex items-center justify-center">
                <div className="relative group">
                    <Button
                        ref={buttonRef}
                        variant="ghost"
                        size="sm"
                        icon={MoreVertical}
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleDropdownToggle}
                    />
                    <div
                        ref={dropdownRef}
                        className={`absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${isOpen ? '' : 'hidden'}`}
                    >
                        <div className="py-1">
                            <button onClick={handleAction('view')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <Eye className="w-5 h-5" /> Görüntüle
                            </button>
                            <button onClick={handleAction('edit')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <Edit className="w-5 h-5" /> Düzenle
                            </button>
                            <hr className="border-gray-200 dark:border-gray-600 my-1" />
                            <button onClick={handleAction('call')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <Phone className="w-5 h-5" /> Ara
                            </button>
                            <button onClick={handleAction('message')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <MessageSquare className="w-5 h-5" /> Mesaj
                            </button>
                            <hr className="border-gray-200 dark:border-gray-600 my-1" />
                            {/* Aktif/Pasif butonu */}
                            {resident.status.type === 'active' && (
                                <button onClick={handleToggleStatus} className="w-full px-4 py-2 text-left text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-3">
                                    <UserX className="w-5 h-5" /> Pasif Yap
                                </button>
                            )}
                            {resident.status.type === 'inactive' && (
                                <button onClick={handleToggleStatus} className="w-full px-4 py-2 text-left text-sm text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-3">
                                    <UserCheck className="w-5 h-5" /> Aktif Yap
                                </button>
                            )}
                            <button onClick={handleAction('payment-history')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <CreditCard className="w-5 h-5" /> Ödeme Geçmişi
                            </button>
                            <hr className="border-gray-200 dark:border-gray-600 my-1" />
                            <button onClick={handleAction('delete')} className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
                                <Trash2 className="w-5 h-5" /> Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
                            <ListView
                                data={dataHook.residents}
                                loading={dataHook.loading}
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
                                    dataHook.apiError ? 'Veri yüklenirken hata oluştu.' :
                                        filtersHook.searchQuery ?
                                            `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                            'Henüz sakin kaydı bulunmuyor.'
                                }
                                ActionMenuComponent={ResidentActionMenuWrapper}
                            />
                        )}

                        {filtersHook.selectedView === 'grid' && (
                            <ResidentGridTemplate
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
                                getStatusColor={getStatusColor}

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