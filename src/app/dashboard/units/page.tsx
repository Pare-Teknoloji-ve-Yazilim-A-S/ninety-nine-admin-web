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
    Grid3X3
} from 'lucide-react';
import { UnitsQuickStats } from './components/UnitsQuickStats';
import { UnitsFilters } from './components/UnitsFilters';
import { UnitsTableView } from './components/UnitsTableView';
import { UnitsGridView } from './components/UnitsGridView';
import { UnitsAnalytics } from './components/UnitsAnalytics';
import { ExportDropdown } from '@/app/components/ui';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';


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

            const response = await unitsService.getAllUnits(filters);
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

    const handleUnitAction = (unit: Property, action: string) => {
        console.log('Unit action:', action, unit);
        // Handle unit actions here
    };

    const handleQuickAction = (action: string) => {
        console.log('Quick action:', action);
        // Handle quick actions here
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

    // Export action handlers (placeholder functions)
    const exportActionHandlers = {
        handleExportPDF: () => { console.log('Export PDF'); },
        handleExportExcel: () => { console.log('Export Excel'); },
        handleExportCSV: () => { console.log('Export CSV'); },
        handleExportJSON: () => { console.log('Export JSON'); },
    };


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
                                            value={searchQuery}
                                            onChange={setSearchQuery}
                                        />
                                    </div>
                                    {/* Filter and View Toggle */}
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            variant={showFilters ? "primary" : "secondary"}
                                            size="md"
                                            icon={Filter}
                                            onClick={() => setShowFilters(!showFilters)}
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
                        {/* Only filter controls (dropdowns) */}
                        <UnitsFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            showFilters={showFilters}
                            onToggleFilters={() => setShowFilters(!showFilters)}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        {/* Quick Stats Cards */}
                        <div className="mb-8">
                            <UnitsQuickStats
                                quickStats={quickStats}
                                loading={loading}
                            />
                        </div>
                        {/* Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                {viewMode === 'table' && (
                                    <UnitsTableView
                                        units={properties}
                                        loading={loading}
                                        error={error}
                                        totalCount={pagination.total || properties.length}
                                        onUnitAction={handleUnitAction}
                                        onExport={handleExport}
                                    />
                                )}
                                {viewMode === 'grid' && (
                                    <UnitsGridView
                                        units={properties}
                                        loading={loading}
                                        error={error}
                                        onUnitAction={handleUnitAction}
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

                            {/* Analytics Sidebar */}
                            <div>
                                <UnitsAnalytics
                                    units={properties}
                                    quickStats={quickStats}
                                    onQuickAction={handleQuickAction}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 