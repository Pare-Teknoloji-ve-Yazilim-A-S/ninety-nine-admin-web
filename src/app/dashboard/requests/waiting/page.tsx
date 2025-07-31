'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
    Wrench,
    Plus,
    RefreshCw,
    Filter,
    List,
    Grid3X3,
    AlertCircle,
    CheckCircle,
    RotateCcw,
    Calendar,
    MoreVertical,
    User,
    Edit,
    Trash2,
    PauseCircle
} from 'lucide-react';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import FilterPanel from '@/app/components/ui/FilterPanel';
import StatsCard from '@/app/components/ui/StatsCard';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import TablePagination from '@/app/components/ui/TablePagination';
import Checkbox from '@/app/components/ui/Checkbox';
import Link from 'next/link';
import { ticketService, Ticket, TicketPaginationResponse, TicketFilters } from '@/services/ticket.service';
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
import RequestDetailModal from '../RequestDetailModal';
import Portal from '@/app/components/ui/Portal';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { ApiResponse } from '@/services';
import { 
    createTicketFilterGroups, 
    STATUS_CONFIG, 
    TYPE_COLOR_MAP, 
    FilterStateManager,
    TicketFilters as RequestFilters 
} from '../constants';
import { useRequestsActions } from '../hooks/useRequestsActions';

export default function WaitingRequestsPage() {
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRequests, setSelectedRequests] = useState<any[]>([]);
    
    // Filter State Management - SOLID: Single Responsibility
    const [filterManager] = useState(() => new FilterStateManager());
    const [activeFilters, setActiveFilters] = useState<RequestFilters>({});
    
    // Data State
    const [requests, setRequests] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });
    
    // Detay modalı state
    const [detailModal, setDetailModal] = useState<{ open: boolean, item: Ticket | null }>({ open: false, item: null });

    // Memoize current filters to prevent unnecessary re-renders
    const currentFilters = useMemo(() => {
        const filters = filterManager.getFilters();
        // Always filter for waiting status tickets
        return { ...filters, status: 'WAITING' };
    }, [filterManager, activeFilters]);

    // Fetch waiting tickets from API with pagination and filters
    const fetchRequests = useCallback(async (customFilters: RequestFilters = {}) => {
        setLoading(true);
        setError(null);
        
        const finalFilters: TicketFilters = {
            page: pagination.page,
            limit: pagination.limit,
            orderColumn: 'createdAt',
            orderBy: 'DESC',
            ...currentFilters,
            ...customFilters,
            status: 'WAITING', // Always filter for waiting tickets - override any other status
        };

        console.log(`🚀 Waiting Tickets API Call with filters:`, finalFilters);
        
        try {
            const response: ApiResponse<TicketPaginationResponse> = await ticketService.getTickets(finalFilters);
            setRequests(response.data as unknown as Ticket[]);
            setPagination(prev => ({
                ...prev,
                total: response.pagination.total,
                totalPages: response.pagination.totalPages,
                page: response.pagination.page,
                limit: response.pagination.limit
            }));
        } catch (err) {
            setError('Bekleyen talepler alınamadı.');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, currentFilters]);

    // Initialize request actions hook
    const {
        handleViewRequest,
        handleEditRequest,
        handleDeleteRequest,
        handleUpdateRequestStatus,
        handleSendNotification,
        isDeleting,
        confirmationDialog,
        showDeleteConfirmation,
        hideConfirmation,
        confirmDelete
    } = useRequestsActions({
        refreshData: fetchRequests,
        setSelectedRequests,
        setRequests
    });

    // Initial data fetch
    useEffect(() => {
        fetchRequests();
    }, [pagination.page, pagination.limit, currentFilters]);

    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Hizmet Talepleri', href: '/dashboard/requests' },
        { label: 'Bekleyen Talepler', active: true }
    ];

    // Icon mapping for status configuration
    const iconMap = {
        AlertCircle,
        RotateCcw,
        PauseCircle,
        CheckCircle,
        Calendar
    };

    // Get status info with proper icon mapping - SOLID: Open/Closed Principle
    const getStatusInfo = (status: string) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.WAITING;
        const IconComponent = iconMap[config.icon as keyof typeof iconMap] || PauseCircle;
        return {
            ...config,
            iconComponent: IconComponent
        };
    };

    // Table columns (API'den gelen Ticket yapısına göre)
    const getTableColumns = () => [
        {
            key: 'request',
            header: 'Talep',
            render: (_value: any, req: Ticket) => (
                <div>
                    <div className="font-medium text-text-on-dark">
                        {req?.title || 'Talep Başlığı'}
                    </div>
                    <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {req?.property?.name || req?.property?.propertyNumber || '--'}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Tip',
            render: (_value: any, req: Ticket) => (
                <Badge variant="soft" color={TYPE_COLOR_MAP[req?.type as string] || 'secondary'}>
                    {req?.type || 'Tip Yok'}
                </Badge>
            ),
        },
        {
            key: 'resident',
            header: 'Sakin',
            render: (_value: any, req: Ticket) => (
                <div>
                    <div className="font-medium text-text-on-dark">
                        {req?.creator?.firstName || ''} {req?.creator?.lastName || ''}
                    </div>
                    <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {req?.creator?.property?.ownershipType || '--'}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Durum',
            render: (_value: any, req: Ticket) => {
                const statusInfo = getStatusInfo(req?.status || 'WAITING');
                const StatusIcon = statusInfo.iconComponent;
                return (
                    <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 text-semantic-${statusInfo.color}-500`} />
                        <Badge variant="soft" color={statusInfo.color as any}>
                            {statusInfo.label}
                        </Badge>
                    </div>
                );
            },
        },
        {
            key: 'createdAt',
            header: 'Oluşturulma',
            render: (_value: any, req: Ticket) => req?.createdAt ? new Date(req.createdAt).toLocaleString('tr-TR') : '--',
        },
    ];

    // Action menu (placeholder)
    const RequestActionMenu: React.FC<{ req: any; onAction: (action: string, req: any) => void }> = ({ req, onAction }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

        React.useEffect(() => {
            if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const menuHeight = 160; // tahmini yükseklik
                const menuWidth = 180;
                const padding = 8;
                let top = rect.bottom + window.scrollY + padding;
                let left = rect.right + window.scrollX - menuWidth;
                if (top + menuHeight > window.innerHeight + window.scrollY) {
                    top = rect.top + window.scrollY - menuHeight - padding;
                }
                if (left < 0) {
                    left = padding;
                }
                setMenuStyle({
                    position: 'absolute',
                    top,
                    left,
                    zIndex: 9999,
                    minWidth: menuWidth,
                });
            }
        }, [isOpen]);

        React.useEffect(() => {
            if (!isOpen) return;
            const handleClick = (e: MouseEvent) => {
                if (
                    buttonRef.current &&
                    !buttonRef.current.contains(e.target as Node)
                ) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('click', handleClick); // mousedown -> click
            return () => document.removeEventListener('click', handleClick);
        }, [isOpen]);

        const handleDropdownToggle = (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        };

        const handleAction = (action: string) => (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsOpen(false);
            onAction(action, req);
        };

        return (
            <div className="flex items-center justify-center">
                <button
                    ref={buttonRef}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                    onClick={handleDropdownToggle}
                    type="button"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
                {isOpen && (
                    <Portal>
                        <div
                            style={menuStyle}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 max-h-72 overflow-auto"
                        >
                            <button onClick={handleAction('view')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <User className="w-5 h-5" /> Detay
                            </button>
                            <button onClick={handleAction('edit')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <Edit className="w-5 h-5" /> Düzenle
                            </button>
                            <hr className="border-gray-200 dark:border-gray-600 my-1" />
                            <button onClick={handleAction('delete')} className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
                                <Trash2 className="w-5 h-5" /> Sil
                            </button>
                        </div>
                    </Portal>
                )}
            </div>
        );
    };

    // Detay açma fonksiyonu
    const handleViewDetail = (req: Ticket) => {
        setDetailModal({ open: true, item: req });
    };

    // Unified action handler for request actions
    const handleRequestAction = useCallback(async (action: string, request: Ticket) => {
        switch (action) {
            case 'view':
                handleViewDetail(request);
                break;
            case 'edit':
                handleEditRequest(request);
                break;
            case 'delete':
                handleDeleteRequest(request);
                break;
            case 'start-progress':
                await handleUpdateRequestStatus(request, 'start-progress');
                break;
            case 'resolve':
                await handleUpdateRequestStatus(request, 'resolve');
                break;
            case 'close':
                await handleUpdateRequestStatus(request, 'close');
                break;
            case 'cancel':
                await handleUpdateRequestStatus(request, 'cancel');
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }, [handleViewDetail, handleEditRequest, handleDeleteRequest, handleUpdateRequestStatus]);

    const RequestActionMenuWrapper: React.FC<{ row: any }> = ({ row }) => (
        <RequestActionMenu req={row} onAction={(action, req) => {
            handleRequestAction(action, req);
        }} />
    );

    // Card renderer for grid view (API'den gelen Ticket yapısına göre)
    const renderRequestCard = (req: Ticket, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: any }>) => {
        const statusInfo = getStatusInfo(req?.status || 'WAITING');
        const StatusIcon = statusInfo.iconComponent;
        return (
            <ui.Card key={req.id} className="p-4 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ui.Checkbox
                            checked={selectedItems.includes(req.id)}
                            onChange={(e: any) => onSelect(req.id)}
                            className="focus:ring-2 focus:ring-primary-gold/30"
                        />
                        <div>
                            <h4 className="font-semibold text-text-on-light dark:text-text-on-dark">
                                {req?.title || 'Talep Başlığı'}
                            </h4>
                            {statusInfo && (
                                <div className="flex items-center">
                                    <StatusIcon className={`h-4 w-4 text-semantic-${statusInfo.color}-500`} />
                                    <ui.Badge variant="soft" color={statusInfo.color as any}>
                                        {statusInfo.label}
                                    </ui.Badge>
                                </div>
                            )}
                        </div>
                    </div>
                    {ActionMenu && <ActionMenu row={req} />}
                </div>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                        <Wrench className="h-4 w-4" />
                        <ui.Badge variant="soft" color={TYPE_COLOR_MAP[req?.type as string] || 'secondary'}>
                            {req?.type || 'Tip Yok'}
                        </ui.Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                        <User className="h-4 w-4" />
                        <span>{req?.creator?.firstName || ''} {req?.creator?.lastName || ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                        <span>{req?.property?.name || req?.property?.propertyNumber || '--'}</span>
                    </div>
                </div>
            </ui.Card>
        );
    };

    // Filter groups using SOLID factory pattern - Focus on waiting-related statuses
    const requestFilterGroups = useMemo(() => createTicketFilterGroups(true), []);

    // Selection handler for grid view
    const handleGridSelectionChange = (selectedIds: Array<string | number>) => {
        setSelectedRequests(requests.filter(r => selectedIds.includes(r.id)));
    };

    // Selection handler for list view
    const handleListSelectionChange = (selected: Ticket[]) => {
        setSelectedRequests(selected);
    };

    // Filter handlers with proper state management
    const handleFilterChange = useCallback((filterKey: string, value: any) => {
        console.log(`🎯 handleFilterChange: key=${filterKey}, value=${value}, type=${typeof value}`);
        filterManager.setFilter(filterKey as keyof RequestFilters, value);
        const newActiveFilters = filterManager.getFilters();
        console.log(`📋 Active filters after update:`, newActiveFilters);
        setActiveFilters(newActiveFilters);
        // Reset pagination to first page
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [filterManager]);

    const handleResetFilters = useCallback(() => {
        filterManager.resetFilters();
        setActiveFilters({});
        setSearchInput('');
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [filterManager]);

    // Search handlers - FIXED: Proper API integration
    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);
    
    const handleSearchSubmit = useCallback((value: string) => {
        console.log(`🔍 Waiting Tickets Search submitted: "${value}"`);
        setSearchInput(value);
        filterManager.setFilter('search', value);
        
        // Batch state updates to prevent multiple re-renders
        React.startTransition(() => {
            setActiveFilters(filterManager.getFilters());
            setPagination(prev => ({ ...prev, page: 1 }));
        });
    }, [filterManager]);

    // Refresh handler
    const handleRefresh = useCallback(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Table columns (API'den gelen Ticket yapısına göre)
    const tableColumns = useMemo(() => getTableColumns(), []);

    // GridView UI Adapter
    const gridViewUI = useMemo(() => ({
        Card,
        Button,
        Checkbox,
        TablePagination,
        Badge,
        EmptyState,
        Skeleton,
        BulkActionsBar,
    }), []);

    // GridView getItemId
    const getRequestId = useCallback((req: Ticket) => req.id, []);

    // Page change handlers
    const handlePageChange = useCallback((page: number) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    const handleRecordsPerPageChange = useCallback((limit: number) => {
        setPagination(prev => ({ ...prev, limit, page: 1 }));
    }, []);

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
                        title="Bekleyen Hizmet Talepleri"
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Summary */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    Bekleyen Talepler <span className="text-primary-gold">({requests.length} Talep)</span>
                                </h2>
                                <p className="text-text-light-secondary dark:text-text-secondary">
                                    Bekleyen: {requests.length}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleRefresh}>
                                    Yenile
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
                                            placeholder="Talep başlığı, sakin adı, daire veya tip ile ara..."
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            onSearch={handleSearchSubmit}
                                            debounceMs={500}
                                        />
                                    </div>
                                    {/* Filter and View Toggle */}
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            variant={showFilters ? "primary" : "secondary"}
                                            size="md"
                                            icon={Filter}
                                            onClick={() => setShowFilters(true)}
                                        >
                                            Filtreler
                                        </Button>
                                        <ViewToggle
                                            options={[
                                                { id: 'table', label: 'Tablo', icon: List },
                                                { id: 'grid', label: 'Kart', icon: Grid3X3 },
                                            ]}
                                            activeView={viewMode}
                                            onViewChange={(viewId) => setViewMode(viewId as typeof viewMode)}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                        
                        {/* Filter Sidebar (Drawer) */}
                        <div className={`fixed inset-0 z-50 ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                            {/* Backdrop */}
                            <div
                                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${showFilters ? 'opacity-50' : 'opacity-0'}`}
                                onClick={() => setShowFilters(false)}
                            />
                            {/* Drawer */}
                            <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background-light-card dark:bg-background-card shadow-2xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                                <FilterPanel
                                    filterGroups={requestFilterGroups}
                                    onApplyFilters={(filters) => {
                                        Object.entries(filters).forEach(([key, value]) => {
                                            handleFilterChange(key, value);
                                        });
                                        setShowFilters(false);
                                    }}
                                    onResetFilters={handleResetFilters}
                                    onClose={() => setShowFilters(false)}
                                    variant="sidebar"
                                />
                            </div>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                <StatsCard
                                    title="Bekleyen Talepler"
                                    value={requests.length}
                                    icon={PauseCircle}
                                    color="warning"
                                    loading={loading}
                                    size="md"
                                />
                            </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-1">
                                {viewMode === 'table' && (
                                    <GenericListView
                                        data={requests}
                                        loading={loading}
                                        error={error}
                                        columns={tableColumns}
                                        onSelectionChange={handleListSelectionChange}
                                        pagination={{
                                            currentPage: pagination.page,
                                            totalPages: pagination.totalPages,
                                            totalRecords: pagination.total,
                                            recordsPerPage: pagination.limit,
                                            onPageChange: handlePageChange,
                                            onRecordsPerPageChange: handleRecordsPerPageChange,
                                        }}
                                        ActionMenuComponent={RequestActionMenuWrapper}
                                        selectable={true}
                                        showPagination={true}
                                        emptyStateMessage="Henüz bekleyen hizmet talebi bulunmuyor."
                                    />
                                )}
                                {viewMode === 'grid' && (
                                    <GenericGridView
                                        data={requests}
                                        loading={loading}
                                        error={error}
                                        onSelectionChange={handleGridSelectionChange}
                                        selectedItems={selectedRequests.map(r => r.id)}
                                        pagination={{
                                            currentPage: pagination.page,
                                            totalPages: pagination.totalPages,
                                            totalRecords: pagination.total,
                                            recordsPerPage: pagination.limit,
                                            onPageChange: handlePageChange,
                                            onRecordsPerPageChange: handleRecordsPerPageChange,
                                        }}
                                        emptyStateMessage="Henüz bekleyen hizmet talebi bulunmuyor."
                                        ui={gridViewUI}
                                        ActionMenu={RequestActionMenuWrapper}
                                        renderCard={renderRequestCard}
                                        getItemId={getRequestId}
                                        selectable={true}
                                        showBulkActions={false}
                                        showPagination={true}
                                        showSelectAll={true}
                                        loadingCardCount={6}
                                        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                    {/* Detay Modalı */}
                    <RequestDetailModal
                        open={detailModal.open}
                        onClose={() => setDetailModal({ open: false, item: null })}
                        item={detailModal.item}
                        onActionComplete={() => {
                            setDetailModal({ open: false, item: null });
                            fetchRequests();
                        }}
                    />
                    {/* Confirmation Modal */}
                    <ConfirmationModal
                        isOpen={confirmationDialog.isOpen}
                        onClose={hideConfirmation}
                        onConfirm={confirmDelete}
                        title="Talep Silme"
                        description={
                            confirmationDialog.ticket 
                                ? `"${confirmationDialog.ticket.title}" adlı talep kalıcı olarak silinecektir. Bu işlem geri alınamaz.`
                                : "Bu talebi silmek istediğinizden emin misiniz?"
                        }
                        variant="danger"
                        loading={isDeleting}
                        itemName={confirmationDialog.ticket?.title}
                        itemType="talep"
                        confirmText="Sil"
                        cancelText="İptal"
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
