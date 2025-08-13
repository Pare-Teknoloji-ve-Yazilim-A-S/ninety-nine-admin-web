'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
    DollarSign,
    CreditCard,
    Receipt,
    AlertTriangle,
    Target,
    Calculator,
    Activity,
    Plus,
    RefreshCw,
    Filter,
    List,
    Grid3X3,
    Download,
    Eye,
    Edit,
    MoreVertical,
    TrendingUp,
    TrendingDown,
    Home,
    User,
    Calendar,
    Building
} from 'lucide-react';
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
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
import Avatar from '@/app/components/ui/Avatar';
import Portal from '@/app/components/ui/Portal';
import { useRouter } from 'next/navigation';
import { useFinancialList } from './hooks/useFinancialList';
import billingService from '@/services/billing.service';

export default function FinancialListPage() {
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

    const router = useRouter();

    // Use the financial list hook
    const {
        data,
        loading,
        error,
        filters,
        updateFilter,
        resetFilters,
        handleBulkAction,
        refetch,
        page,
        limit,
        setPage,
        setLimit,
    } = useFinancialList();

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Finansal İşlemler', active: true }
    ];

    // Format currency
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('tr-TR').format(amount);
    }, []);

    // Financial statistics from data
    const financialStats = useMemo(() => {
        if (!data) return {
            totalRevenue: 0,
            totalPending: 0,
            totalOverdue: 0,
            totalTransactions: 0,
            collectionRate: 0,
            averageTransaction: 0
        };

        return {
            totalRevenue: data.financialSummary.totalRevenue.amount,
            totalPending: data.financialSummary.totalPending.amount,
            totalOverdue: data.financialSummary.totalOverdue.amount,
            totalTransactions: data.financialSummary.totalTransactions,
            collectionRate: data.financialSummary.collectionRate,
            averageTransaction: data.financialSummary.averageTransactionAmount.amount
        };
    }, [data]);

    // Loading separation: cards vs table
    const [tableLoading, setTableLoading] = useState(false);
    const [cardsLoading, setCardsLoading] = useState(true);
    const lastFetchKind = useRef<'initial' | 'filters' | 'pagination'>('initial');

    // Track previous params to detect changes
    const prevPage = useRef(page);
    const prevLimit = useRef(limit);
    const filtersHash = `${filters.search.value}|${filters.transactionType.value}|${filters.paymentStatus.value}`;
    const prevFiltersHash = useRef(filtersHash);

    // Detect pagination changes
    useEffect(() => {
        if (prevPage.current !== page || prevLimit.current !== limit) {
            lastFetchKind.current = 'pagination';
            setTableLoading(true);
            prevPage.current = page;
            prevLimit.current = limit;
        }
    }, [page, limit]);

    // Detect filter changes (treat as full refresh)
    useEffect(() => {
        if (prevFiltersHash.current !== filtersHash) {
            lastFetchKind.current = lastFetchKind.current === 'initial' ? 'initial' : 'filters';
            setTableLoading(true);
            setCardsLoading(true);
            prevFiltersHash.current = filtersHash;
        }
    }, [filtersHash]);

    // When hook loading completes, end appropriate loading states
    useEffect(() => {
        if (!loading) {
            setTableLoading(false);
            if (lastFetchKind.current === 'filters' || lastFetchKind.current === 'initial') {
                setCardsLoading(false);
            }
            // After first load completes
            if (lastFetchKind.current === 'initial') {
                lastFetchKind.current = 'filters';
            }
        }
    }, [loading]);

    // Fetch pending payments summary for the card
    const [pendingSummary, setPendingSummary] = useState<number | null>(null);
    const [paidSummary, setPaidSummary] = useState<number | null>(null);
    const [overduePendingSummary, setOverduePendingSummary] = useState<number | null>(null);
    useEffect(() => {
        let isActive = true;
        (async () => {
            try {
                const res = await billingService.getPendingPaymentsSummary();
                if (isActive) setPendingSummary(res.totalPendingAmount ?? 0);
            } catch (e) {
                if (isActive) setPendingSummary(0);
            }
            try {
                const res2 = await billingService.getPaidPaymentsSummary();
                if (isActive) setPaidSummary(res2.totalPaidAmount ?? 0);
            } catch (e) {
                if (isActive) setPaidSummary(0);
            }
            try {
                const res3 = await billingService.getOverduePendingPaymentsSummary();
                if (isActive) setOverduePendingSummary(res3.totalOverduePendingAmount ?? 0);
            } catch (e) {
                if (isActive) setOverduePendingSummary(0);
            }
        })();
        return () => { isActive = false };
    }, []);

    // Handle actions
    const handleTransactionAction = useCallback((action: string, transaction: any) => {
        switch (action) {
            case 'view':
                router.push(`/dashboard/financial/${transaction.id}`);
                break;
            case 'edit':
                console.log('Edit transaction:', transaction);
                break;
            case 'delete':
                console.log('Delete transaction:', transaction);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }, [router]);

    // Table columns configuration
    const tableColumns = useMemo(() => [
        {
            key: 'title',
            header: 'Title',
            render: (_value: any, transaction: any) => (
                <button
                    onClick={() => handleTransactionAction('view', transaction)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                    {transaction.title}
                </button>
            ),
        },
        {
            key: 'apartment',
            header: 'Daire',
            render: (_value: any, transaction: any) => (
                <div className="font-medium text-gray-900 dark:text-white">
                    {transaction.apartment.number}
                </div>
            ),
        },
        {
            key: 'resident',
            header: 'Sakin',
            render: (_value: any, transaction: any) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        fallback={transaction.resident.name}
                        size="sm"
                        className="flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                            {transaction.resident.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {transaction.resident.type === 'owner' ? 'Malik' : 'Kiracı'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'transactionType',
            header: 'İşlem Türü',
            render: (_value: any, transaction: any) => (
                <Badge variant="soft" className="flex items-center gap-1">
                    <span>{transaction.transactionType.icon}</span>
                    {transaction.transactionType.label}
                </Badge>
            ),
        },
        {
            key: 'amount',
            header: 'Tutar',
            render: (_value: any, transaction: any) => (
                <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount.amount)} IQD
                    </div>
                    {transaction.penalty && transaction.penalty.amount > 0 && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                            +{formatCurrency(transaction.penalty.amount)} ceza
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Durum',
            render: (_value: any, transaction: any) => (
                <div className="flex items-center gap-2">
                    <Badge 
                        variant={
                            transaction.status.id === 'paid' ? 'success' :
                            transaction.status.id === 'pending' ? 'warning' :
                            transaction.status.id === 'overdue' ? 'danger' : 'info'
                        }
                    >
                        {transaction.status.label}
                    </Badge>
                    {transaction.isOverdue && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">{transaction.daysOverdue}g</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'transactionDate',
            header: 'İşlem Tarihi',
            render: (_value: any, transaction: any) => (
                <div>
                    <div className="text-gray-900 dark:text-white">
                        {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.transactionDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            ),
        },
    ], [handleTransactionAction, formatCurrency]);

    // Transaction Action Menu
    const TransactionActionMenu: React.FC<{ transaction: any; onAction: (action: string, transaction: any) => void }> = React.memo(({ transaction, onAction }) => {
        const handleGoDetail = (e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('view', transaction);
        };

        return (
            <div className="flex items-center justify-center">
                <button
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                    onClick={handleGoDetail}
                    type="button"
                    title="Detaya git"
                >
                    {/* Replace 3-dot with > icon */}
                    <span className="text-xl leading-none">›</span>
                </button>
            </div>
        );
    });

    const TransactionActionMenuWrapper: React.FC<{ row: any }> = useMemo(() =>
        ({ row }) => <TransactionActionMenu transaction={row} onAction={handleTransactionAction} />
        , [handleTransactionAction]);

    // Card renderer for grid view
    const renderTransactionCard = useCallback((transaction: any, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: any }>) => {
        if (!transaction) return null;

        const isOverdue = transaction.isOverdue;

        return (
            <ui.Card key={transaction.id} className={`p-4 rounded-2xl shadow-md bg-white dark:bg-gray-800 border transition-transform hover:scale-[1.01] hover:shadow-lg ${isOverdue ? 'border-l-4 border-l-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ui.Checkbox
                            checked={selectedItems.includes(transaction.id)}
                            onChange={() => onSelect(transaction.id)}
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {transaction.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ui.Badge 
                            variant={
                                transaction.status.id === 'paid' ? 'success' :
                                transaction.status.id === 'pending' ? 'warning' :
                                transaction.status.id === 'overdue' ? 'danger' : 'secondary'
                            }
                        >
                            {transaction.status.label}
                        </ui.Badge>
                        {ActionMenu && <ActionMenu row={transaction} />}
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Home className="h-4 w-4" />
                        <span>{transaction.apartment.number} - {transaction.apartment.floor}. Kat</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{transaction.resident.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{transaction.transactionType.icon}</span>
                        <span>{transaction.transactionType.label} - {transaction.serviceType.label}</span>
                    </div>
                </div>

                <div className="text-right mb-3">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount.amount)} IQD
                    </p>
                    {transaction.penalty && transaction.penalty.amount > 0 && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            +{formatCurrency(transaction.penalty.amount)} IQD ceza
                        </p>
                    )}
                </div>

                {transaction.isOverdue && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full text-sm">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{transaction.daysOverdue} gün gecikmiş</span>
                    </div>
                )}
            </ui.Card>
        );
    }, [formatCurrency]);

    // Search handlers
    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    const handleSearchSubmit = useCallback((value: string) => {
        updateFilter('search', value);
    }, [updateFilter]);

    // Selection handlers
    const handleSelectionChange = useCallback((selected: any[]) => {
        setSelectedTransactions(selected.map(t => t.id));
    }, []);

    const handleGridSelectionChange = useCallback((selectedIds: Array<string | number>) => {
        setSelectedTransactions(selectedIds as string[]);
    }, []);

    // Filter configuration
    const filterGroups = useMemo(() => [
        {
            id: 'transactionType',
            label: 'İşlem Türü',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: 'all' },
                { id: 'DUES', label: 'Aidat', value: 'DUES' },
                { id: 'UTILITY', label: 'Fatura', value: 'UTILITY' },
                { id: 'MAINTENANCE', label: 'Bakım', value: 'MAINTENANCE' },
                { id: 'PENALTY', label: 'Ceza', value: 'PENALTY' },
                { id: 'OTHER', label: 'Diğer', value: 'OTHER' },
            ],
        },
        {
            id: 'paymentStatus',
            label: 'Durum',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: 'all' },
                { id: 'PENDING', label: 'Bekliyor', value: 'PENDING' },
                { id: 'PARTIALLY_PAID', label: 'Kısmi Ödendi', value: 'PARTIALLY_PAID' },
                { id: 'PAID', label: 'Ödendi', value: 'PAID' },
                { id: 'OVERDUE', label: 'Gecikmiş', value: 'OVERDUE' },
                { id: 'CANCELLED', label: 'İptal', value: 'CANCELLED' },
            ],
        },
        {
            id: 'paymentMethod',
            label: 'Ödeme Yöntemi',
            type: 'select' as const,
            options: data?.filters.paymentMethod.options.map(option => ({
                id: option.value,
                label: option.label,
                value: option.value
            })) || [],
        },
    ], [data]);

    const handleApplyFilters = useCallback((newFilters: any) => {
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] !== '' && newFilters[key] !== undefined && newFilters[key] !== null) {
                updateFilter(key, newFilters[key]);
            }
        });
        setShowFilters(false);
    }, [updateFilter]);

    const handleResetFilters = useCallback(() => {
        resetFilters();
        setSearchInput('');
    }, [resetFilters]);

    // Grid UI
    const gridUI = useMemo(() => ({
        Card,
        Button,
        Checkbox,
        TablePagination,
        Badge,
        EmptyState,
        Skeleton,
        BulkActionsBar,
    }), []);

    const getItemId = useCallback((transaction: any) => transaction.id, []);

    // New Transaction Navigation Handler
    const handleNewTransactionClick = useCallback(() => {
        router.push('/dashboard/financial/create');
    }, [router]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <div className="lg:ml-72">
                    <DashboardHeader
                        title="Finansal İşlemler"
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Summary */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                    Finansal İşlemler
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Toplam Gelir: {formatCurrency((paidSummary ?? financialStats.totalRevenue))} IQD | 
                                    Bekleyen: {formatCurrency((pendingSummary ?? financialStats.totalPending))} IQD | 
                                    Gecikmiş: {formatCurrency((overduePendingSummary ?? financialStats.totalOverdue))} IQD
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={refetch}>
                                    Yenile
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="md" 
                                    icon={Plus}
                                    onClick={handleNewTransactionClick}
                                >
                                    Yeni İşlem
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats Cards - moved to top */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                <StatsCard
                                    title="Toplam Gelir"
                                    value={`${formatCurrency((paidSummary ?? financialStats.totalRevenue))} IQD`}
                                    icon={DollarSign}
                                    color="success"
                                    loading={cardsLoading || paidSummary === null}
                                    size="md"
                                />
                                <StatsCard
                                    title="Bekleyen Ödemeler"
                                    value={`${formatCurrency((pendingSummary ?? financialStats.totalPending))} IQD`}
                                    icon={Receipt}
                                    color="warning"
                                    loading={cardsLoading || pendingSummary === null}
                                    size="md"
                                />
                                <StatsCard
                                    title="Gecikmiş Borçlar"
                                    value={`${formatCurrency((overduePendingSummary ?? financialStats.totalOverdue))} IQD`}
                                    icon={AlertTriangle}
                                    color="danger"
                                    loading={cardsLoading || overduePendingSummary === null}
                                    size="md"
                                />
                                {/* Tahsilat Oranı kartı kaldırıldı */}
                            </div>
                        </div>

                        {/* Search and Filters - moved just above the table */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder="Başlık, açıklama veya belge no ile ara..."
                                            value={searchInput}
                                            onChange={(v) => {
                                                setSearchInput(v);
                                            }}
                                            onSearch={(v) => {
                                                updateFilter('search', v);
                                            }}
                                            debounceMs={500}
                                        />
                                    </div>
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
                                                { id: 'grid', label: 'Kart', icon: Grid3X3 }
                                            ]}
                                            activeView={viewMode}
                                            onViewChange={(viewId) => setViewMode(viewId as typeof viewMode)}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Filter Sidebar */}
                        <div className={`fixed inset-0 z-50 ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                            <div
                                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${showFilters ? 'opacity-50' : 'opacity-0'}`}
                                onClick={() => setShowFilters(false)}
                            />
                            <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                                <FilterPanel
                                    filterGroups={filterGroups}
                                    onApplyFilters={(newFilters) => {
                                        // Map UI filters to API-driven filters
                                        if (newFilters?.paymentStatus) {
                                            updateFilter('paymentStatus', newFilters.paymentStatus);
                                        }
                                        handleApplyFilters(newFilters);
                                    }}
                                    onResetFilters={() => {
                                        handleResetFilters();
                                        updateFilter('paymentStatus', 'all');
                                    }}
                                    onClose={() => setShowFilters(false)}
                                    variant="sidebar"
                                />
                            </div>
                        </div>

                        

                        {/* Data Display */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <div className="lg:col-span-1">
                                {viewMode === 'table' && (
                                        <GenericListView
                                        data={data?.transactions || []}
                                        loading={loading}
                                        error={error}
                                        onSelectionChange={handleSelectionChange}
                                        bulkActions={[]}
                                        columns={tableColumns}
                                        pagination={{
                                                currentPage: data?.pagination.currentPage ?? page,
                                                totalPages: data?.pagination.totalPages ?? 1,
                                                totalRecords: data?.pagination.totalItems ?? 0,
                                                recordsPerPage: data?.pagination.itemsPerPage ?? limit,
                                                onPageChange: (p: number) => {
                                                    if (p !== page) setPage(p);
                                                },
                                                onRecordsPerPageChange: (n: number) => {
                                                    if (n !== limit) {
                                                        setLimit(n);
                                                        setPage(1);
                                                    }
                                                },
                                                recordsPerPageOptions: [10, 25, 50, 100],
                                                preventScroll: true,
                                            }}
                                        emptyStateMessage="Henüz finansal işlem kaydı bulunmuyor."
                                        selectable={true}
                                        showPagination={true}
                                        ActionMenuComponent={TransactionActionMenuWrapper}
                                    />
                                )}
                                {viewMode === 'grid' && (
                                    <GenericGridView
                                        data={data?.transactions || []}
                                        loading={loading}
                                        error={error}
                                        onSelectionChange={handleGridSelectionChange}
                                        bulkActions={[]}
                                        onAction={handleTransactionAction}
                                        selectedItems={selectedTransactions}
                                        pagination={{
                                            currentPage: data?.pagination.currentPage || 1,
                                            totalPages: data?.pagination.totalPages || 1,
                                            totalRecords: data?.pagination.totalItems || 0,
                                            recordsPerPage: data?.pagination.itemsPerPage || 50,
                                            onPageChange: () => {},
                                            onRecordsPerPageChange: () => {},
                                        }}
                                        emptyStateMessage="Henüz finansal işlem kaydı bulunmuyor."
                                        ui={gridUI}
                                        ActionMenu={TransactionActionMenuWrapper}
                                        renderCard={renderTransactionCard}
                                        getItemId={getItemId}
                                        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>

            </div>
        </ProtectedRoute>
    );
}