'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
    unitsService,
    Property,
    PropertyFilterParams,
    PropertyStatistics,
    QuickStats,
    PropertyActivity,
} from '@/services';
import {
    Building,
    Map,
    Plus,
    Download,
    RefreshCw,
    Filter,
    List,
    Grid3X3,
    Home,
    Store,
    Car,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    Calendar,
    Eye,
    MoreVertical,
    User,
    Edit,
    Trash2
} from 'lucide-react';
import { UnitsQuickStats } from './components/UnitsQuickStats';
import { UnitsFilters } from './components/UnitsFilters';
import { UnitsAnalytics } from './components/UnitsAnalytics';
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
import { ExportDropdown } from '@/app/components/ui';
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


export default function UnitsListPage() {
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // 1. Local search input state
    const [searchInput, setSearchInput] = useState("");
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'block' | 'map'>('table');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState<Property[]>([]);
    const [filters, setFilters] = useState<PropertyFilterParams>({
        type: undefined,
        status: undefined,
        page: 1,
        limit: 20,
        orderColumn: 'name',
        orderBy: 'ASC'
    });

    // API Data State
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
    const [recentActivities, setRecentActivities] = useState<PropertyActivity[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });

    // Load initial data
    useEffect(() => {
        loadProperties();
        loadQuickStats();
        loadRecentActivities();
    }, [filters]);

    const loadProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            // Pagination ve filtreleri logla
            console.log('Filters:', filters);
            const response = await unitsService.getAllUnits(filters);
            console.log('API Pagination:', response.pagination);
            setProperties(response.data);
            setPagination(response.pagination);
        } catch (err: any) {
            console.error('Failed to load properties:', err);
            setError('Konutlar yüklenirken bir hata oluştu');
            // Use fallback data for demo
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const loadQuickStats = async () => {
        try {
            const response = await unitsService.getQuickStats();
            setQuickStats(response.data);
        } catch (err: any) {
            console.error('Failed to load quick stats:', err);
            // Use fallback data for demo
            setQuickStats({
                apartmentUnits: { total: 85, occupied: 72, occupancyRate: 85 },
                villaUnits: { total: 15, occupied: 12, occupancyRate: 80 },
                commercialUnits: { total: 8, occupied: 6, occupancyRate: 75 },
                parkingSpaces: { total: 120, occupied: 98, occupancyRate: 82 }
            });
        }
    };

    const loadRecentActivities = async () => {
        try {
            const response = await unitsService.getRecentActivities(10, 7);
            setRecentActivities(response.data);
        } catch (err: any) {
            console.error('Failed to load recent activities:', err);
            setRecentActivities([]);
        }
    };

    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Konutlar', href: '/dashboard/units' },
        { label: 'Daire/Villa Listesi', active: true }
    ];

    // Statistics calculations from API data
    const totalUnits = quickStats ?
        quickStats.apartmentUnits.total + quickStats.villaUnits.total + quickStats.commercialUnits.total :
        properties.length;

    const occupiedUnits = quickStats ?
        quickStats.apartmentUnits.occupied + quickStats.villaUnits.occupied + quickStats.commercialUnits.occupied :
        properties.filter(p => p.status === 'OCCUPIED').length;

    const vacantUnits = properties.filter(p => p.status === 'AVAILABLE').length;
    const maintenanceUnits = properties.filter(p => p.status === 'UNDER_MAINTENANCE').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const apartmentUnits = quickStats?.apartmentUnits.total || properties.filter(p => p.type === 'RESIDENCE').length;
    const villaUnits = quickStats?.villaUnits.total || properties.filter(p => p.type === 'VILLA').length;
    const commercialUnits = quickStats?.commercialUnits.total || properties.filter(p => p.type === 'COMMERCIAL').length;

    const handleUnitAction = (action: string, unit: Property) => {
        console.log('Unit action:', action, unit);
        // Handle unit actions here
    };

    const handleQuickAction = (action: string) => {
        console.log('Quick action:', action);
        // Handle quick actions here
    };

    // Status configuration
    const statusConfig = {
        AVAILABLE: { label: 'Boş', color: 'info', icon: AlertCircle },
        OCCUPIED: { label: 'Dolu', color: 'success', icon: CheckCircle },
        UNDER_MAINTENANCE: { label: 'Bakımda', color: 'warning', icon: RotateCcw },
        RESERVED: { label: 'Rezerve', color: 'primary', icon: Calendar }
    };

    // Table columns configuration
    const getTableColumns = () => [
        {
            key: 'property',
            header: 'Konut',
            render: (_value: any, unit: Property) => (
                <div>
                    <div className="font-medium text-text-on-light dark:text-text-on-dark">
                        {unit?.propertyNumber || unit?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {unit?.blockNumber && `Blok ${unit.blockNumber}`}
                        {unit?.floor && ` • ${unit.floor}. kat`}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Tip',
            render: (_value: any, unit: Property) => (
                <Badge variant="soft" color="secondary">
                    {unit?.type ? unitsService.getTypeInfo(unit.type).label : 'N/A'}
                </Badge>
            ),
        },
        {
            key: 'area',
            header: 'm²',
            render: (_value: any, unit: Property) => unit?.area || '--',
        },
        {
            key: 'resident',
            header: 'Sakin',
            render: (_value: any, unit: Property) => {
                const currentResident = unit?.tenant || unit?.owner;
                if (currentResident) {
                    return (
                        <div>
                            <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                {currentResident.firstName} {currentResident.lastName}
                            </div>
                            <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                {unit?.tenant ? 'Kiracı' : 'Malik'}
                            </div>
                        </div>
                    );
                }
                return (
                    <span className="text-text-light-muted dark:text-text-muted">
                        Boş
                    </span>
                );
            },
        },
        {
            key: 'status',
            header: 'Durum',
            render: (_value: any, unit: Property) => {
                const statusInfo = statusConfig[unit?.status as keyof typeof statusConfig];
                if (!statusInfo) {
                    return <span className="text-text-light-muted dark:text-text-muted">N/A</span>;
                }
                const StatusIcon = statusInfo.icon;
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
            key: 'debt',
            header: 'Borç',
            render: (_value: any, unit: Property) => (
                unit?.bills && unit.bills.length > 0 ? (
                    <span className="text-primary-red font-medium">
                        Var
                    </span>
                ) : (
                    <span className="text-semantic-success-500">
                        Temiz
                    </span>
                )
            ),
        },
        {
            key: 'lastPayment',
            header: 'Son Ödeme',
            render: (_value: any, _unit: Property) => '--',
        },
    ];

    // UnitActionMenu
    const UnitActionMenu: React.FC<{ unit: Property; onAction: (action: string, unit: Property) => void }> = ({ unit, onAction }) => {
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
            onAction(action, unit);
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
                        className={`absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${isOpen ? '' : 'hidden'}`}
                    >
                        <div className="py-1">
                            <button onClick={handleAction('view')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <Eye className="w-5 h-5" /> Detay
                            </button>
                            <button onClick={handleAction('edit')} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                <Edit className="w-5 h-5" /> Düzenle
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

    const UnitActionMenuWrapper: React.FC<{ row: Property }> = ({ row }) => (
        <UnitActionMenu unit={row} onAction={handleUnitAction} />
    );

    // Unit card renderer for grid view
    const renderUnitCard = (unit: Property, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: Property }>) => {
        if (!unit) return null;
        
        const statusInfo = statusConfig[unit?.status as keyof typeof statusConfig];
        if (!statusInfo) return null;
        
        const StatusIcon = statusInfo.icon;
        const typeInfo = unit?.type ? unitsService.getTypeInfo(unit.type) : { label: 'N/A' };
        const currentResident = unit?.tenant || unit?.owner;

        return (
            <ui.Card key={unit.id} className="p-4 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ui.Checkbox
                            checked={selectedItems.includes(unit.id)}
                            onChange={() => onSelect(unit.id)}
                            className="focus:ring-2 focus:ring-primary-gold/30"
                        />
                        <div>
                            <h4 className="font-semibold text-text-on-light dark:text-text-on-dark">
                                {unit?.propertyNumber || unit?.name || 'N/A'}
                            </h4>
                            {/* Durum satırı: Daire isminin hemen altında */}
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
                    {ActionMenu && <ActionMenu row={unit} />}
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                        <Home className="h-4 w-4" />
                        <span>{typeInfo.label}</span>
                    </div>
                    {unit?.area && (
                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                            <Map className="h-4 w-4" />
                            <span>{unit.area} m²</span>
                        </div>
                    )}
                    {unit?.blockNumber && (
                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                            <Building className="h-4 w-4" />
                            <span>Blok {unit.blockNumber}</span>
                        </div>
                    )}
                    {currentResident && (
                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                            <User className="h-4 w-4" />
                            <span>{currentResident.firstName} {currentResident.lastName}</span>
                        </div>
                    )}
                </div>

                {unit?.bills && unit.bills.length > 0 && (
                    <div className="mb-4 p-2 bg-primary-red/10 dark:bg-primary-red/20 rounded-lg">
                        <div className="text-sm text-primary-red font-medium">
                            Ödenmemiş Faturalar Var
                        </div>
                    </div>
                )}
            </ui.Card>
        );
    };

    const handleExport = () => {
        console.log('Export triggered');
        // Handle export here
    };

    // Refresh handler eklendi
    const handleRefresh = () => {
        loadProperties();
        loadQuickStats();
        loadRecentActivities();
    };

    // 2. Input değişimini yöneten handler
    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
    };

    // 3. Debounce sonrası filtreleme (API çağrısı) yapan handler
    const handleSearchSubmit = (value: string) => {
        setSearchInput(value);
        setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    };

    // Export action handlers (placeholder functions)
    const exportActionHandlers = {
        handleExportPDF: () => { console.log('Export PDF'); },
        handleExportExcel: () => { console.log('Export Excel'); },
        handleExportCSV: () => { console.log('Export CSV'); },
        handleExportJSON: () => { console.log('Export JSON'); },
    };

    // Selection handler
    const handleSelectionChange = (selected: Property[]) => {
        setSelectedUnits(selected);
    };

    // Define filter groups for units
    const unitFilterGroups = [
        {
            id: 'type',
            label: 'Konut Tipi',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                { id: 'RESIDENCE', label: 'Daire', value: 'RESIDENCE' },
                { id: 'VILLA', label: 'Villa', value: 'VILLA' },
                { id: 'COMMERCIAL', label: 'Ticari', value: 'COMMERCIAL' },
            ],
        },
        {
            id: 'status',
            label: 'Durum',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                { id: 'OCCUPIED', label: 'Dolu', value: 'OCCUPIED' },
                { id: 'AVAILABLE', label: 'Boş', value: 'AVAILABLE' },
                { id: 'UNDER_MAINTENANCE', label: 'Bakımda', value: 'UNDER_MAINTENANCE' },
                { id: 'RESERVED', label: 'Rezerve', value: 'RESERVED' },
            ],
        },
        {
            id: 'blockNumber',
            label: 'Blok',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                { id: 'A', label: 'A Blok', value: 'A' },
                { id: 'B', label: 'B Blok', value: 'B' },
                { id: 'C', label: 'C Blok', value: 'C' },
                { id: 'D', label: 'D Blok', value: 'D' },
                { id: 'Villa', label: 'Villa', value: 'Villa' },
            ],
        },
        {
            id: 'rooms',
            label: 'Oda Sayısı',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                { id: '1+1', label: '1+1', value: '1+1' },
                { id: '2+1', label: '2+1', value: '2+1' },
                { id: '3+1', label: '3+1', value: '3+1' },
                { id: '4+1', label: '4+1', value: '4+1' },
            ],
        },
        {
            id: 'debtStatus',
            label: 'Borç Durumu',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                { id: 'clean', label: 'Temiz Hesap', value: 'clean' },
                { id: 'indebted', label: 'Borçlu', value: 'indebted' },
            ],
        },
    ];


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
                        title="Daire/Villa Listesi"
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Summary */}

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    Konut Listesi <span className="text-primary-gold">({totalUnits.toLocaleString()} Konut)
                                    </span>
                                </h2>
                                <p className="text-text-light-secondary dark:text-text-secondary">
                                    Dolu: {occupiedUnits} ({occupancyRate}%) | Boş: {vacantUnits} | Bakımda: {maintenanceUnits}
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
                                  <Button variant="primary" size="md" icon={Plus}>
                                    Yeni Konut
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
                                            placeholder="Blok, daire no, sakin adı, telefon veya özellik ile ara..."
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
                                                { id: 'block', label: 'Blok', icon: Building },
                                                { id: 'map', label: 'Harita', icon: Map }
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
                                    filterGroups={unitFilterGroups}
                                    onApplyFilters={(newFilters) => {
                                        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
                                        setShowFilters(false);
                                    }}
                                    onResetFilters={() => {
                                        setFilters({
                                            type: undefined,
                                            status: undefined,
                                            page: 1,
                                            limit: 20,
                                            orderColumn: 'name',
                                            orderBy: 'ASC',
                                        });
                                    }}
                                    onClose={() => setShowFilters(false)}
                                    variant="sidebar"
                                />
                            </div>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
                                <StatsCard
                                    title="Apartman Dairesi"
                                    value={quickStats?.apartmentUnits.total || 0}
                                    icon={Building}
                                    color="primary"
                                    loading={loading}
                                    size="md"
                                />
                                <StatsCard
                                    title="Villa"
                                    value={quickStats?.villaUnits.total || 0}
                                    icon={Home}
                                    color="success"
                                    loading={loading}
                                    size="md"
                                />
                                <StatsCard
                                    title="Ticari Alan"
                                    value={quickStats?.commercialUnits.total || 0}
                                    icon={Store}
                                    color="info"
                                    loading={loading}
                                    size="md"
                                />
                                <StatsCard
                                    title="Otopark Alanı"
                                    value={quickStats?.parkingSpaces.total || 0}
                                    icon={Car}
                                    color="danger"
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
                                        data={properties}
                                        loading={loading}
                                        error={error}
                                        onSelectionChange={handleSelectionChange}
                                        bulkActions={[]}
                                        columns={getTableColumns()}
                                        pagination={{
                                            currentPage: pagination.page,
                                            totalPages: pagination.totalPages,
                                            totalRecords: pagination.total,
                                            recordsPerPage: pagination.limit,
                                            onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
                                            onRecordsPerPageChange: (limit) => setFilters(prev => ({ ...prev, limit, page: 1 })),
                                        }}
                                        emptyStateMessage="Henüz konut kaydı bulunmuyor."
                                        selectable={true}
                                        showPagination={true}
                                        ActionMenuComponent={UnitActionMenuWrapper}
                                    />
                                )}
                                {viewMode === 'grid' && (
                                    <GenericGridView
                                        data={properties}
                                        loading={loading}
                                        error={error}
                                        onSelectionChange={(selectedIds) => {
                                            const selectedProperties = properties.filter(p => selectedIds.includes(p.id));
                                            setSelectedUnits(selectedProperties);
                                        }}
                                        bulkActions={[]}
                                        onAction={handleUnitAction}
                                        selectedItems={selectedUnits.map(u => u.id)}
                                        pagination={{
                                            currentPage: pagination.page,
                                            totalPages: pagination.totalPages,
                                            totalRecords: pagination.total,
                                            recordsPerPage: pagination.limit,
                                            onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
                                            onRecordsPerPageChange: (limit) => setFilters(prev => ({ ...prev, limit, page: 1 })),
                                        }}
                                        emptyStateMessage="Henüz konut kaydı bulunmuyor."
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
                                        ActionMenu={UnitActionMenuWrapper}
                                        renderCard={renderUnitCard}
                                        getItemId={(unit) => unit.id}
                                        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    />
                                )}
                                {viewMode === 'block' && (
                                    <Card>
                                        <div className="p-6 text-center">
                                            <Building className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                                            <p className="text-text-light-secondary dark:text-text-secondary">
                                                Blok görünümü yakında gelecek
                                            </p>
                                        </div>
                                    </Card>
                                )}
                                {viewMode === 'map' && (
                                    <Card>
                                        <div className="p-6 text-center">
                                            <Map className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                                            <p className="text-text-light-secondary dark:text-text-secondary">
                                                Harita görünümü yakında gelecek
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 