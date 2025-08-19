'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUnitsData } from '@/hooks/useUnitsData';
import { useUnitsFilters } from '@/hooks/useUnitsFilters';
import { useUnitsActions } from '@/hooks/useUnitsActions';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';


// Dil çevirileri
const translations = {
  tr: {
    title: 'Daire/Villa Listesi',
    welcome: 'Konut yönetimi',
    home: 'Ana Sayfa',
    units: 'Konutlar',
    unitsList: 'Daire/Villa Listesi',
    totalUnits: 'Konut',
    vacant: 'Boş',
    maintenance: 'Bakımda',
    occupancyRate: 'Doluluk Oranı',
    refresh: 'Yenile',
    newUnit: 'Yeni Konut',
    apartmentUnit: 'Apartman Dairesi',
    villa: 'Villa',
    availableUnit: 'Müsait Konut',
    searchPlaceholder: 'Blok, daire no, sakin adı, telefon veya özellik ile ara...',
    filters: 'Filtreler',
    table: 'Tablo',
    card: 'Kart',
    unit: 'Konut',
    type: 'Tip',
    area: 'm²',
    resident: 'Sakin',
    status: 'Durum',
    debt: 'Borç',
    lastPayment: 'Son Ödeme',
    available: 'Boş',
    occupied: 'Dolu',
    underMaintenance: 'Bakımda',
    reserved: 'Rezerve',
    clean: 'Temiz',
    hasDebt: 'Var',
    overdue: 'Gecikmiş',
    tenant: 'Kiracı',
    owner: 'Malik',
    empty: 'Boş',
    detail: 'Detay',
    unitType: 'Konut Tipi',
    residence: 'Daire',
    villaType: 'Villa',
    commercial: 'Ticari',
    unitStatus: 'Durum',
    bulkEdit: 'Toplu Düzenle',
    bulkExport: 'Dışa Aktar',
    bulkDelete: 'Toplu Sil',
    deleteUnit: 'Konutu Sil',
    deleteConfirm: 'Bu konutu silmek istediğinizden emin misiniz?',
    deleteWarning: 'kalıcı olarak silinecektir. Bu işlem geri alınamaz.',
    delete: 'Sil',
    cancel: 'İptal',
    noUnitsFound: 'Henüz konut kaydı bulunmuyor.',
    unpaidBills: 'Ödenmemiş Faturalar Var',
    block: 'Blok',
    floor: 'kat'
  },
  en: {
    title: 'Units List',
    welcome: 'Property management',
    home: 'Home',
    units: 'Units',
    unitsList: 'Units List',
    totalUnits: 'Units',
    vacant: 'Vacant',
    maintenance: 'Maintenance',
    occupancyRate: 'Occupancy Rate',
    refresh: 'Refresh',
    newUnit: 'New Unit',
    apartmentUnit: 'Apartment Unit',
    villa: 'Villa',
    availableUnit: 'Available Unit',
    searchPlaceholder: 'Search by block, unit number, resident name, phone or feature...',
    filters: 'Filters',
    table: 'Table',
    card: 'Card',
    unit: 'Unit',
    type: 'Type',
    area: 'm²',
    resident: 'Resident',
    status: 'Status',
    debt: 'Debt',
    lastPayment: 'Last Payment',
    available: 'Available',
    occupied: 'Occupied',
    underMaintenance: 'Under Maintenance',
    reserved: 'Reserved',
    clean: 'Clean',
    hasDebt: 'Has Debt',
    overdue: 'Overdue',
    tenant: 'Tenant',
    owner: 'Owner',
    empty: 'Empty',
    detail: 'Detail',
    unitType: 'Unit Type',
    residence: 'Residence',
    villaType: 'Villa',
    commercial: 'Commercial',
    unitStatus: 'Status',
    bulkEdit: 'Bulk Edit',
    bulkExport: 'Export',
    bulkDelete: 'Bulk Delete',
    deleteUnit: 'Delete Unit',
    deleteConfirm: 'Are you sure you want to delete this unit?',
    deleteWarning: 'will be permanently deleted. This action cannot be undone.',
    delete: 'Delete',
    cancel: 'Cancel',
    noUnitsFound: 'No units found yet.',
    unpaidBills: 'Unpaid Bills',
    block: 'Block',
    floor: 'floor'
  },
  ar: {
    title: 'قائمة الوحدات',
    welcome: 'إدارة العقارات',
    home: 'الرئيسية',
    units: 'الوحدات',
    unitsList: 'قائمة الوحدات',
    totalUnits: 'وحدة',
    vacant: 'شاغر',
    maintenance: 'صيانة',
    occupancyRate: 'معدل الإشغال',
    refresh: 'تحديث',
    newUnit: 'وحدة جديدة',
    apartmentUnit: 'وحدة شقة',
    villa: 'فيلا',
    availableUnit: 'وحدة متاحة',
    searchPlaceholder: 'البحث بالكتلة، رقم الوحدة، اسم المقيم، الهاتف أو الميزة...',
    filters: 'المرشحات',
    table: 'جدول',
    card: 'بطاقة',
    unit: 'وحدة',
    type: 'النوع',
    area: 'م²',
    resident: 'المقيم',
    status: 'الحالة',
    debt: 'الدين',
    lastPayment: 'آخر دفعة',
    available: 'متاح',
    occupied: 'مشغول',
    underMaintenance: 'تحت الصيانة',
    reserved: 'محجوز',
    clean: 'نظيف',
    hasDebt: 'لديه دين',
    overdue: 'متأخر',
    tenant: 'مستأجر',
    owner: 'مالك',
    empty: 'فارغ',
    detail: 'تفاصيل',
    unitType: 'نوع الوحدة',
    residence: 'سكني',
    villaType: 'فيلا',
    commercial: 'تجاري',
    unitStatus: 'الحالة',
    bulkEdit: 'تعديل جماعي',
    bulkExport: 'تصدير',
    bulkDelete: 'حذف جماعي',
    deleteUnit: 'حذف الوحدة',
    deleteConfirm: 'هل أنت متأكد من حذف هذه الوحدة؟',
    deleteWarning: 'سيتم حذفه نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    delete: 'حذف',
    cancel: 'إلغاء',
    noUnitsFound: 'لم يتم العثور على وحدات بعد.',
    unpaidBills: 'فواتير غير مدفوعة',
    block: 'كتلة',
    floor: 'طابق'
  }
};

export default function UnitsListPage() {
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // 1. Local search input state
    const [searchInput, setSearchInput] = useState("");
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState<Property[]>([]);
    const [filters, setFilters] = useState<PropertyFilterParams>({
        type: undefined,
        status: undefined,
        page: 1,
        limit: 10,
        orderColumn: 'name',
        orderBy: 'ASC'
    });
    const [currentLanguage, setCurrentLanguage] = useState('tr');

    // Dil tercihini localStorage'dan al
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];

    // API Data State
    // Initialize hooks
    const filtersHook = useUnitsFilters();
    const dataHook = useUnitsData({
        currentPage: filtersHook.currentPage,
        recordsPerPage: filtersHook.recordsPerPage,
        searchQuery: filtersHook.searchQuery,
        sortConfig: filtersHook.sortConfig,
        filters: filtersHook.filters
    });

    // Units actions hook
    const {
        isDeleting,
        confirmationDialog,
        showDeleteConfirmation,
        hideConfirmation,
        confirmDelete
    } = useUnitsActions({
        onDeleteSuccess: () => {
            // Refresh the list after successful delete
            dataHook.refreshData();
        },
        onRefreshNeeded: () => {
            dataHook.refreshData();
        }
    });

    const breadcrumbItems = [
        { label: t.home, href: '/dashboard' },
        { label: t.units, href: '/dashboard/units' },
        { label: t.unitsList, active: true }
    ];

    // Statistics calculations from API data - MEMOIZED
    const unitStats = useMemo(() => {
        const list = Array.isArray(dataHook.properties) ? dataHook.properties : [];
        const totalUnits = list.length;
        const occupiedUnits = list.filter(p => p.status === 'OCCUPIED').length;
        const vacantUnits = list.filter(p => p.status === 'AVAILABLE').length;
        const maintenanceUnits = list.filter(p => p.status === 'UNDER_MAINTENANCE').length;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        const apartmentUnits = list.filter(p => p.type === 'RESIDENCE').length;
        const villaUnits = list.filter(p => p.type === 'VILLA').length;
        const commercialUnits = list.filter(p => p.type === 'COMMERCIAL').length;

        return {
            totalUnits,
            occupiedUnits,
            vacantUnits,
            maintenanceUnits,
            occupancyRate,
            apartmentUnits,
            villaUnits,
            commercialUnits
        };
    }, [dataHook.properties]);

    const router = useRouter();

    const handleUnitAction = useCallback((action: string, unit: Property) => {
        switch (action) {
            case 'view':
                router.push(`/dashboard/units/${unit.id}`);
                break;
            case 'edit':
                // Navigate to edit page - we'll create this page next
                router.push(`/dashboard/units/${unit.id}/edit`);
                break;
            case 'delete':
                showDeleteConfirmation(unit);
                break;
            default:
                console.log('Unknown unit action:', action, unit);
        }
    }, [router, showDeleteConfirmation]);

    const handleQuickAction = useCallback((action: string) => {
        console.log('Quick action:', action);
        switch (action) {
            case 'add-unit':
                router.push('/dashboard/units/add');
                break;
            case 'bulk-assign':
                // TODO: Implement bulk assign functionality
                console.log('Bulk assign action');
                break;
            case 'debt-analysis':
                // TODO: Implement debt analysis functionality
                console.log('Debt analysis action');
                break;
            case 'occupancy-report':
                // TODO: Implement occupancy report functionality
                console.log('Occupancy report action');
                break;
            default:
                console.log('Unknown quick action:', action);
        }
    }, [router]);

    // Status configuration - MEMOIZED
    const statusConfig = useMemo(() => ({
        AVAILABLE: { label: t.available, color: 'info', icon: AlertCircle },
        OCCUPIED: { label: t.occupied, color: 'success', icon: CheckCircle },
        UNDER_MAINTENANCE: { label: t.underMaintenance, color: 'warning', icon: RotateCcw },
        RESERVED: { label: t.reserved, color: 'primary', icon: Calendar }
    }), [t]);

    // Table columns configuration - MEMOIZED
    const tableColumns = useMemo(() => [
        {
            key: 'property',
            header: t.unit,
            render: (_value: any, unit: Property) => (
                <div>
                    <div className="font-medium text-text-on-light dark:text-text-on-dark">
                        {unit?.propertyNumber || unit?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {unit?.blockNumber && `${t.block} ${unit.blockNumber}`}
                        {unit?.floor && ` • ${unit.floor}. ${t.floor}`}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: t.type,
            render: (_value: any, unit: Property) => (
                <Badge variant="soft" color="secondary">
                    {unit?.type ? unitsService.getTypeInfo(unit.type).label : 'N/A'}
                </Badge>
            ),
        },
        {
            key: 'area',
            header: t.area,
            render: (_value: any, unit: Property) => unit?.area || '--',
        },
        {
            key: 'resident',
            header: t.resident,
            render: (_value: any, unit: Property) => {
                const currentResident = unit?.tenant || unit?.owner;
                if (currentResident) {
                    return (
                        <div>
                            <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                {currentResident.firstName} {currentResident.lastName}
                            </div>
                            <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                {unit?.tenant ? t.tenant : t.owner}
                            </div>
                        </div>
                    );
                }
                return (
                    <span className="text-text-light-muted dark:text-text-muted">
                        {t.empty}
                    </span>
                );
            },
        },
        {
            key: 'status',
            header: t.status,
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
            header: t.debt,
            render: (_value: any, unit: Property) => {
                // Use debtStatus if available, otherwise fallback to bills check
                if (unit.debtStatus) {
                    return unit.debtStatus.hasDebt ? (
                        <div className="flex items-center gap-2">
                            <span className="text-primary-red font-medium">
                                {unit.debtStatus.totalDebt.toLocaleString('tr-TR')} ₺
                            </span>
                            {unit.debtStatus.overdueBills > 0 && (
                                <Badge variant="soft" color="red" className="text-xs">
                                    {unit.debtStatus.overdueBills} {t.overdue}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <span className="text-semantic-success-500">
                            {t.clean}
                        </span>
                    );
                }
                
                // Fallback to bills check (for backward compatibility)
                return unit?.bills && unit.bills.length > 0 ? (
                    <span className="text-primary-red font-medium">
                        {t.hasDebt}
                    </span>
                ) : (
                    <span className="text-semantic-success-500">
                        {t.clean}
                    </span>
                );
            },
        },
        {
            key: 'lastPayment',
            header: t.lastPayment,
            render: (_value: any, unit: Property) => {
                if (unit.debtStatus?.lastPaymentDate) {
                    return new Date(unit.debtStatus.lastPaymentDate).toLocaleDateString('tr-TR');
                }
                return '--';
            },
        },
    ], [statusConfig, t]);

    // UnitActionMenu - MEMOIZED - Simplified to only show detail view
    const UnitActionMenu: React.FC<{ unit: Property; onAction: (action: string, unit: Property) => void }> = React.memo(({ unit, onAction }) => {
        const handleDetailView = (e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('view', unit);
        };

        return (
            <div className="flex items-center justify-center">
                <button
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                    onClick={handleDetailView}
                    type="button"
                    title={t.detail}
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        );
    });

    const UnitActionMenuWrapper: React.FC<{ row: Property }> = useMemo(() =>
        ({ row }) => <UnitActionMenu unit={row} onAction={handleUnitAction} />
        , [handleUnitAction, t]);

    // Unit card renderer for grid view - MEMOIZED
    const renderUnitCard = useCallback((unit: Property, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: Property }>) => {
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
                            onChange={(e: any) => onSelect(unit.id)}
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
                            <span>{t.block} {unit.blockNumber}</span>
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
                            {t.unpaidBills}
                        </div>
                    </div>
                )}
            </ui.Card>
        );
    }, [statusConfig, t]);

    const handleExport = useCallback(() => {
        console.log('Export triggered');
        // Handle export here
    }, []);

    // Refresh handler - FIXED
    const handleRefresh = useCallback(() => {
        dataHook.refreshData();
    }, [dataHook]);

    // Search handlers - FIXED: Prevent duplicate API calls
    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    const handleSearchSubmit = useCallback((value: string) => {
        setSearchInput(value);

        // Batch state updates to prevent multiple re-renders
        React.startTransition(() => {
            setFilters(prev => ({ ...prev, search: value, page: 1 }));
        });
    }, []);

    // Export action handlers - MEMOIZED
    const exportActionHandlers = useMemo(() => ({
        handleExportPDF: () => { console.log('Export PDF'); },
        handleExportExcel: () => { console.log('Export Excel'); },
        handleExportCSV: () => { console.log('Export CSV'); },
        handleExportJSON: () => { console.log('Export JSON'); },
    }), []);

    // Selection handlers - FIXED
    const handleSelectionChange = useCallback((selected: Property[]) => {
        setSelectedUnits(selected);
    }, []);

    const handleGridSelectionChange = useCallback((selectedIds: Array<string | number>) => {
        const selectedProperties = dataHook.properties.filter(p => selectedIds.includes(p.id));
        setSelectedUnits(selectedProperties);
    }, [dataHook.properties]);

    // Filter handlers - FIXED
    const handleApplyFilters = useCallback((newFilters: any) => {
        React.startTransition(() => {
            // Process new filters to remove empty values - NEW
            // This ensures "Tümü" selections (empty strings) are excluded from filter state
            const processedNewFilters = Object.keys(newFilters).reduce((acc, key) => {
                const value = newFilters[key];
                if (value !== '' && value !== undefined && value !== null) {
                    acc[key] = value;
                }
                return acc;
            }, {} as any);

            setFilters(prev => ({ ...prev, ...processedNewFilters, page: 1 }));
            setShowFilters(false);
        });
    }, []);

    const handleResetFilters = useCallback(() => {
        React.startTransition(() => {
            setFilters({
                type: undefined,
                status: undefined,
                page: 1,
                limit: 20,
                orderColumn: 'name',
                orderBy: 'ASC',
            });
            setSearchInput('');
        });
    }, []);

    // Define filter groups for units - MEMOIZED
    const unitFilterGroups = useMemo(() => [
        {
            id: 'type',
            label: t.unitType,
            type: 'select' as const,
            options: [
                { id: 'RESIDENCE', label: t.residence, value: 'RESIDENCE' },
                { id: 'VILLA', label: t.villaType, value: 'VILLA' },
                { id: 'COMMERCIAL', label: t.commercial, value: 'COMMERCIAL' },
            ],
        },
        {
            id: 'status',
            label: t.unitStatus,
            type: 'select' as const,
            options: [
                { id: 'OCCUPIED', label: t.occupied, value: 'OCCUPIED' },
                { id: 'AVAILABLE', label: t.available, value: 'AVAILABLE' },
                { id: 'UNDER_MAINTENANCE', label: t.underMaintenance, value: 'UNDER_MAINTENANCE' },
                { id: 'RESERVED', label: t.reserved, value: 'RESERVED' },
            ],
        },
    ], [t]);

    // Grid UI - MEMOIZED
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

    // Get item ID - MEMOIZED
    const getItemId = useCallback((unit: Property) => unit.id, []);

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
                        title={t.title}
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Summary */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    {t.title} <span className="text-primary-gold">({unitStats.totalUnits.toLocaleString()} {t.totalUnits})
                                    </span>
                                </h2>
                                <p className="text-text-light-secondary dark:text-text-secondary">
                                    {t.occupied}: {unitStats.occupiedUnits} ({unitStats.occupancyRate}%) | {t.vacant}: {unitStats.vacantUnits} | {t.maintenance}: {unitStats.maintenanceUnits}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleRefresh}>
                                    {t.refresh}
                                </Button>
                                <Link href="/dashboard/units/add">
                                    <Button variant="primary" size="md" icon={Plus}>
                                        {t.newUnit}
                                    </Button>
                                </Link>
                            </div>
                        </div>



{/* Quick Stats Cards */}
{dataHook.error && (
    <Card className="mb-4">
        <div className="p-4 text-primary-red text-center font-medium">
            {dataHook.error}
        </div>
    </Card>
)}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                                <StatsCard
                                    title={t.apartmentUnit}
                                    value={unitStats.apartmentUnits}
                                    icon={Building}
                                    color="primary"
                                    loading={dataHook.loading}
                                    size="md"
                                />
                                <StatsCard
                                    title={t.villaType}
                                    value={unitStats.villaUnits}
                                    icon={Home}
                                    color="success"
                                    loading={dataHook.loading}
                                    size="md"
                                />
                                <StatsCard
                                    title={t.availableUnit}
                                    value={unitStats.vacantUnits}
                                    icon={Store}
                                    color="info"
                                    loading={dataHook.loading}
                                    size="md"
                                />
                            </div>
                        </div> 

                        {/* Search and Filters */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder={t.searchPlaceholder}
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
                                            {t.filters}
                                        </Button>
                                        <ViewToggle
                                            options={[
                                                { id: 'table', label: t.table, icon: List },
                                                { id: 'grid', label: t.card, icon: Grid3X3 }
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
                                    onApplyFilters={handleApplyFilters}
                                    onResetFilters={handleResetFilters}
                                    onClose={() => setShowFilters(false)}
                                    variant="sidebar"
                                />
                            </div>
                        </div>
                        {/* Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-1">
                                {viewMode === 'table' && (
                                    <>
                                        {console.log('🔍 Units Table Pagination Debug:', {
                                            currentPage: filtersHook.currentPage,
                                            totalPages: dataHook.totalPages,
                                            totalRecords: dataHook.totalRecords,
                                            recordsPerPage: filtersHook.recordsPerPage,
                                            showPagination: true
                                        })}
                                        <GenericListView
                                            data={dataHook.properties}
                                            loading={dataHook.loading}
                                            error={dataHook.error}
                                            onSelectionChange={handleSelectionChange}
                                            bulkActions={[
                                                {
                                                    id: 'bulk-edit',
                                                    label: t.bulkEdit,
                                                    icon: Edit,
                                                    onClick: (selectedItems: Property[]) => {
                                                        console.log('Toplu düzenleme:', selectedItems.map(item => item.id));
                                                        // TODO: Toplu düzenleme modal'ı açılacak
                                                    }
                                                },
                                                {
                                                    id: 'bulk-export',
                                                    label: t.bulkExport,
                                                    icon: Download,
                                                    onClick: (selectedItems: Property[]) => {
                                                        console.log('Seçili konutları dışa aktar:', selectedItems.map(item => item.id));
                                                        // TODO: Seçili konutları Excel/PDF olarak dışa aktar
                                                    }
                                                },
                                                {
                                                    id: 'bulk-delete',
                                                    label: t.bulkDelete,
                                                    icon: Trash2,
                                                    variant: 'danger' as const,
                                                    onClick: (selectedItems: Property[]) => {
                                                        console.log('Toplu silme:', selectedItems.map(item => item.id));
                                                        // TODO: Toplu silme onayı ve işlemi
                                                    }
                                                }
                                            ]}
                                            columns={tableColumns}
                                            pagination={{
                                                currentPage: filtersHook.currentPage,
                                                totalPages: Math.max(dataHook.totalPages, 5), // Force multiple pages for testing
                                                totalRecords: Math.max(dataHook.totalRecords, 50), // Force more records for testing
                                                recordsPerPage: filtersHook.recordsPerPage,
                                                onPageChange: (page) => {
                                                    filtersHook.handlePageChange(page);
                                                },
                                                onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                                preventScroll: true, // Prevent auto-scroll to top
                                            }}
                                            emptyStateMessage={t.noUnitsFound}
                                            selectable={true}
                                            showPagination={true}
                                            ActionMenuComponent={UnitActionMenuWrapper}
                                        />
                                    </>
                                )}
                                {viewMode === 'grid' && (
                                    <>
                                        {console.log('🔍 Units Grid Pagination Debug:', {
                                            currentPage: filtersHook.currentPage,
                                            totalPages: dataHook.totalPages,
                                            totalRecords: dataHook.totalRecords,
                                            recordsPerPage: filtersHook.recordsPerPage,
                                            showPagination: true
                                        })}
                                        <GenericGridView
                                            data={dataHook.properties}
                                            loading={dataHook.loading}
                                            error={dataHook.error}
                                            onSelectionChange={handleGridSelectionChange}
                                            bulkActions={[
                                                {
                                                    id: 'bulk-edit',
                                                    label: t.bulkEdit,
                                                    icon: Edit,
                                                    onClick: (selectedItems: Property[]) => {
                                                        console.log('Toplu düzenleme:', selectedItems.map(item => item.id));
                                                        // TODO: Toplu düzenleme modal'ı açılacak
                                                    }
                                                },
                                                {
                                                    id: 'bulk-export',
                                                    label: t.bulkExport,
                                                    icon: Download,
                                                    onClick: (selectedItems: Property[]) => {
                                                        console.log('Seçili konutları dışa aktar:', selectedItems.map(item => item.id));
                                                        // TODO: Seçili konutları Excel/PDF olarak dışa aktar
                                                    }
                                                },
                                                {
                                                    id: 'bulk-delete',
                                                    label: t.bulkDelete,
                                                    icon: Trash2,
                                                    variant: 'danger' as const,
                                                    onClick: (selectedItems: Property[]) => {
                                                        console.log('Toplu silme:', selectedItems.map(item => item.id));
                                                        // TODO: Toplu silme onayı ve işlemi
                                                    }
                                                }
                                            ]}
                                            onAction={handleUnitAction}
                                            selectedItems={selectedUnits.map(u => u.id)}
                                            pagination={{
                                                currentPage: filtersHook.currentPage,
                                                totalPages: Math.max(dataHook.totalPages, 5), // Force multiple pages for testing
                                                totalRecords: Math.max(dataHook.totalRecords, 50), // Force more records for testing
                                                recordsPerPage: filtersHook.recordsPerPage,
                                                onPageChange: (page) => {
                                                    filtersHook.handlePageChange(page);
                                                },
                                                onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                                preventScroll: true, // Prevent auto-scroll to top
                                            }}
                                            emptyStateMessage={t.noUnitsFound}
                                            ui={gridUI}
                                            ActionMenu={UnitActionMenuWrapper}
                                            renderCard={renderUnitCard}
                                            getItemId={getItemId}
                                            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                        />
                                    </>
                                )}
                                
                            </div>
                        </div>
                    </main>
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationDialog.isOpen}
                    onClose={hideConfirmation}
                    onConfirm={confirmDelete}
                    title={t.deleteUnit}
                    description={
                        confirmationDialog.unit 
                            ? `"${confirmationDialog.unit.propertyNumber || confirmationDialog.unit.name || t.unit}" ${t.deleteWarning}`
                            : t.deleteConfirm
                    }
                    confirmText={t.delete}
                    cancelText={t.cancel}
                    variant="danger"
                    loading={isDeleting}
                    itemName={confirmationDialog.unit?.propertyNumber || confirmationDialog.unit?.name}
                    itemType={t.unit}
                />
            </div>
        </ProtectedRoute>
    );
}