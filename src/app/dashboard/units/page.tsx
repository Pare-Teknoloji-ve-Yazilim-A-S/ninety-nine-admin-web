'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import ViewToggle from '@/app/components/ui/ViewToggle';
import SearchBar from '@/app/components/ui/SearchBar';
import {
    propertyService,
    Property,
    PropertyFilterParams,
    PropertyStatistics,
    QuickStats,
    PropertyActivity,
} from '@/services';
import {
    Building,
    Home,
    Store,
    Car,
    Users,
    Search,
    Filter,
    Download,
    Plus,
    MoreVertical,
    Edit,
    Eye,
    UserPlus,
    DollarSign,
    FileText,
    MapPin,
    Grid3X3,
    Map,
    List,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    Calendar,
    CheckCircle,
    AlertCircle,
    User
} from 'lucide-react';

const statusConfig = {
    OCCUPIED: { label: 'Dolu', color: 'green', icon: CheckCircle },
    AVAILABLE: { label: 'Boş', color: 'blue', icon: AlertCircle },
    UNDER_MAINTENANCE: { label: 'Bakım', color: 'orange', icon: RotateCcw },
    RESERVED: { label: 'Rezerve', color: 'purple', icon: Calendar }
};

export default function UnitsListPage() {
    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'block' | 'map'>('table');
    const [showFilters, setShowFilters] = useState(false);
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

            const response = await propertyService.getAllProperties(filters);
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
            const response = await propertyService.getQuickStats();
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
            const response = await propertyService.getRecentActivities(10, 7);
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

    const viewModeOptions = [
        { value: 'table', label: 'Tablo', icon: List },
        { value: 'grid', label: 'Kart', icon: Grid3X3 },
        { value: 'block', label: 'Blok', icon: Building },
        { value: 'map', label: 'Harita', icon: Map }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const renderTableView = () => (
        <Card>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                        Konut Listesi ({pagination.total || properties.length})
                    </h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" icon={Search}>
                            Ara
                        </Button>
                        <Button variant="ghost" size="sm" icon={Download}>
                            İndir
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark">
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Konut
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Tip
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    m²
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Sakin
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Durum
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Borç
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Son Ödeme
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-gold"></div>
                                            <span className="text-text-light-secondary dark:text-text-secondary">
                                                Konutlar yükleniyor...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center">
                                        <div className="text-primary-red">{error}</div>
                                    </td>
                                </tr>
                            ) : properties.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center">
                                        <div className="text-text-light-secondary dark:text-text-secondary">
                                            Henüz konut bulunamadı
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                properties.map((property) => {
                                    const statusInfo = statusConfig[property.status as keyof typeof statusConfig];
                                    const StatusIcon = statusInfo.icon;
                                    const typeInfo = propertyService.getTypeInfo(property.type);

                                    return (
                                        <tr key={property.id} className="border-b border-border-light dark:border-border-dark hover:bg-background-light-soft dark:hover:bg-background-soft">
                                            <td className="py-4 px-4">
                                                <div>
                                                    <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                                        {property.propertyNumber || property.name}
                                                    </div>
                                                    <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        {property.blockNumber && `Blok ${property.blockNumber}`}
                                                        {property.floor && ` • ${property.floor}. kat`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant="soft" color="secondary">
                                                    {typeInfo.label}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-text-on-light dark:text-text-on-dark">
                                                {property.area || '--'}
                                            </td>
                                            <td className="py-4 px-4">
                                                {property.tenant ? (
                                                    <div>
                                                        <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            {property.tenant.firstName} {property.tenant.lastName}
                                                        </div>
                                                        <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                            Kiracı
                                                        </div>
                                                    </div>
                                                ) : property.owner ? (
                                                    <div>
                                                        <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            {property.owner.firstName} {property.owner.lastName}
                                                        </div>
                                                        <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                            Malik
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-text-light-muted dark:text-text-muted">
                                                        Boş
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className={`h-4 w-4 text-semantic-${statusInfo.color}-500`} />
                                                    <Badge variant="soft" color={statusInfo.color as any}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {property.bills && property.bills.length > 0 ? (
                                                    <span className="text-primary-red font-medium">
                                                        Var
                                                    </span>
                                                ) : (
                                                    <span className="text-semantic-success-500">
                                                        Temiz
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-text-light-secondary dark:text-text-secondary">
                                                --
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" icon={Eye}>
                                                        Detay
                                                    </Button>
                                                    <Button variant="ghost" size="sm" icon={MoreVertical} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );

    const renderGridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index} variant="elevated">
                        <div className="p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </Card>
                ))
            ) : error ? (
                <div className="col-span-full text-center py-8">
                    <div className="text-primary-red">{error}</div>
                </div>
            ) : properties.length === 0 ? (
                <div className="col-span-full text-center py-8">
                    <div className="text-text-light-secondary dark:text-text-secondary">
                        Henüz konut bulunamadı
                    </div>
                </div>
            ) : (
                properties.map((property) => {
                    const statusInfo = statusConfig[property.status as keyof typeof statusConfig];
                    const StatusIcon = statusInfo.icon;
                    const typeInfo = propertyService.getTypeInfo(property.type);
                    const currentResident = property.tenant || property.owner;

                    return (
                        <Card key={property.id} variant="elevated" hover={true}>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-text-on-light dark:text-text-on-dark">
                                        {property.propertyNumber || property.name}
                                    </h4>
                                    <Badge variant="soft" color={statusInfo.color as any}>
                                        {statusInfo.label}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                        <Home className="h-4 w-4" />
                                        <span>{typeInfo.label}</span>
                                    </div>
                                    {property.area && (
                                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                            <MapPin className="h-4 w-4" />
                                            <span>{property.area} m²</span>
                                        </div>
                                    )}
                                    {property.blockNumber && (
                                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                            <Building className="h-4 w-4" />
                                            <span>Blok {property.blockNumber}</span>
                                        </div>
                                    )}
                                    {currentResident && (
                                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                            <User className="h-4 w-4" />
                                            <span>{currentResident.firstName} {currentResident.lastName}</span>
                                        </div>
                                    )}
                                </div>

                                {property.bills && property.bills.length > 0 && (
                                    <div className="mb-4 p-2 bg-primary-red/10 dark:bg-primary-red/20 rounded-lg">
                                        <div className="text-sm text-primary-red font-medium">
                                            Ödenmemiş Faturalar Var
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="flex-1" icon={Eye}>
                                        Detay
                                    </Button>
                                    <Button variant="ghost" size="sm" icon={MoreVertical} />
                                </div>
                            </div>
                        </Card>
                    );
                })
            )}
        </div>
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
                        title="Daire/Villa Listesi"
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Summary */}
                        <div className="bg-background-light-card dark:bg-background-card rounded-xl p-6 mb-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                                        Konut Listesi ({totalUnits.toLocaleString()} toplam)
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary">
                                        Dolu: {occupiedUnits} ({occupancyRate}%) | Boş: {vacantUnits} | Bakımda: {maintenanceUnits}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="secondary" size="sm" icon={Plus}>
                                        Yeni Konut
                                    </Button>
                                    <Button variant="secondary" size="sm" icon={Download}>
                                        İndir
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-gold/10 dark:bg-primary-gold/20 rounded-xl flex items-center justify-center">
                                        <Building className="h-6 w-6 text-primary-gold" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                            {apartmentUnits}
                                        </p>
                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                            Apartman Dairesi
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-semantic-success-500/10 dark:bg-semantic-success-500/20 rounded-xl flex items-center justify-center">
                                        <Home className="h-6 w-6 text-semantic-success-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                            {villaUnits}
                                        </p>
                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                            Villa
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-blue/10 dark:bg-primary-blue/20 rounded-xl flex items-center justify-center">
                                        <Store className="h-6 w-6 text-primary-blue" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                            {commercialUnits}
                                        </p>
                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                            Ticari Alan
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-red/10 dark:bg-primary-red/20 rounded-xl flex items-center justify-center">
                                        <Car className="h-6 w-6 text-primary-red" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                            1,800
                                        </p>
                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                            Otopark Alanı
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-background-light-card dark:bg-background-card rounded-xl p-6 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <SearchBar
                                        placeholder="Blok, daire no, sakin adı, telefon veya özellik ile ara..."
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant={showFilters ? "primary" : "secondary"}
                                        size="sm"
                                        icon={Filter}
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        Filtrele
                                    </Button>
                                    <ViewToggle
                                        value={viewMode}
                                        onChange={setViewMode}
                                        options={viewModeOptions}
                                    />
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                Konut Tipi
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                                value={filters.unitType}
                                                onChange={(e) => setFilters({ ...filters, unitType: e.target.value })}
                                            >
                                                <option value="all">Tümü</option>
                                                <option value="apartment">Daire</option>
                                                <option value="villa">Villa</option>
                                                <option value="commercial">Ticari</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                Durum
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                                value={filters.status}
                                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                            >
                                                <option value="all">Tümü</option>
                                                <option value="occupied">Dolu</option>
                                                <option value="vacant">Boş</option>
                                                <option value="maintenance">Bakımda</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                Blok
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                                value={filters.block}
                                                onChange={(e) => setFilters({ ...filters, block: e.target.value })}
                                            >
                                                <option value="all">Tümü</option>
                                                <option value="A">A Blok</option>
                                                <option value="B">B Blok</option>
                                                <option value="C">C Blok</option>
                                                <option value="D">D Blok</option>
                                                <option value="Villa">Villa</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                Oda Sayısı
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                                value={filters.rooms}
                                                onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                                            >
                                                <option value="all">Tümü</option>
                                                <option value="1+1">1+1</option>
                                                <option value="2+1">2+1</option>
                                                <option value="3+1">3+1</option>
                                                <option value="4+1">4+1</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                Borç Durumu
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                                value={filters.debtStatus}
                                                onChange={(e) => setFilters({ ...filters, debtStatus: e.target.value })}
                                            >
                                                <option value="all">Tümü</option>
                                                <option value="clean">Temiz Hesap</option>
                                                <option value="indebted">Borçlu</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                {viewMode === 'table' && renderTableView()}
                                {viewMode === 'grid' && renderGridView()}
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

                            {/* Analytics Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Analysis */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            📊 Hızlı Analiz
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        Doluluk Oranı
                                                    </span>
                                                    <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                        %{occupancyRate}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-background-light-soft dark:bg-background-soft rounded-full h-2">
                                                    <div
                                                        className="bg-primary-gold h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${occupancyRate}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                    Konut Tipi Dağılımı
                                                </h4>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-text-light-secondary dark:text-text-secondary">1+1:</span>
                                                        <span className="text-text-on-light dark:text-text-on-dark">420 (%17)</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-text-light-secondary dark:text-text-secondary">2+1:</span>
                                                        <span className="text-text-on-light dark:text-text-on-dark">840 (%34)</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-text-light-secondary dark:text-text-secondary">3+1:</span>
                                                        <span className="text-text-on-light dark:text-text-on-dark">840 (%34)</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-text-light-secondary dark:text-text-secondary">4+1:</span>
                                                        <span className="text-text-on-light dark:text-text-on-dark">250 (%10)</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-text-light-secondary dark:text-text-secondary">Villa:</span>
                                                        <span className="text-text-on-light dark:text-text-on-dark">150 (%5)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark">
                                                <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                    Borç Durumu
                                                </h4>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-text-light-secondary dark:text-text-secondary">Temiz:</span>
                                                    <span className="text-semantic-success-500">2,100</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-text-light-secondary dark:text-text-secondary">Borçlu:</span>
                                                    <span className="text-primary-red">248</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-text-light-secondary dark:text-text-secondary">Toplam:</span>
                                                    <span className="text-text-on-light dark:text-text-on-dark">4.2M ₺</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Recent Activity */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Son 30 Gün
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-semantic-success-500" />
                                                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        Yeni dolu
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                    12
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="h-4 w-4 text-primary-red" />
                                                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        Boşalan
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                    8
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <RotateCcw className="h-4 w-4 text-semantic-warning-500" />
                                                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        Bakıma giren
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                    3
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Hızlı İşlemler
                                        </h3>
                                        <div className="space-y-3">
                                            <Button variant="ghost" className="w-full justify-start" icon={Plus}>
                                                Yeni Konut Ekle
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start" icon={UserPlus}>
                                                Toplu Sakin Ata
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start" icon={DollarSign}>
                                                Borç Analizi
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start" icon={FileText}>
                                                Doluluk Raporu
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 