'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { Building, Map, Plus, RefreshCw, Filter, List, Grid3X3, Home, Store, Car, AlertCircle, CheckCircle, RotateCcw, Calendar } from 'lucide-react';
import StatsCard from '@/app/components/ui/StatsCard';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import FilterPanel from '@/app/components/ui/FilterPanel';
import Link from 'next/link';
import GenericListView from '@/app/components/templates/GenericListView';
import { unitsService, Property } from '@/services';

export default function EmptyUnitsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [units, setUnits] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Konutlar', href: '/dashboard/units' },
    { label: 'Boş Konutlar', active: true }
  ];

  // Status config for table
  const statusConfig = {
    AVAILABLE: { label: 'Boş', color: 'info', icon: AlertCircle },
    OCCUPIED: { label: 'Dolu', color: 'success', icon: CheckCircle },
    UNDER_MAINTENANCE: { label: 'Bakımda', color: 'warning', icon: RotateCcw },
    RESERVED: { label: 'Rezerve', color: 'primary', icon: Calendar }
  };

  // Table columns (sadeleştirilmiş)
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
  ];

  // API'den boş konutları çek
  const fetchUnits = async (page = 1, limit = 20, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { status: 'AVAILABLE', page, limit };
      if (search) filters.search = search;
      const response = await unitsService.getAllUnits(filters);
      setUnits(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError('Boş konutlar yüklenirken bir hata oluştu.');
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits(pagination.page, pagination.limit, searchInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, searchInput]);

  const handleRefresh = () => {
    fetchUnits(pagination.page, pagination.limit, searchInput);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72">
          <DashboardHeader title="Boş Konutlar" breadcrumbItems={breadcrumbItems} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                  Boş Konutlar <span className="text-primary-gold">({units.length} Konut)</span>
                </h2>
                <p className="text-text-light-secondary dark:text-text-secondary">
                  Sadece boş durumdaki daire, villa ve ticari alanlar listelenir.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleRefresh}>
                  Yenile
                </Button>
                {/* <Link href="/dashboard/units/add">
                  <Button variant="primary" size="md" icon={Plus}>
                    Yeni Konut
                  </Button>
                </Link> */}
              </div>
            </div>
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar
                      placeholder="Blok, daire no, sakin adı, telefon veya özellik ile ara..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      onSearch={handleSearchInputChange}
                      debounceMs={500}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* <Button
                      variant={showFilters ? "primary" : "secondary"}
                      size="md"
                      icon={Filter}
                      onClick={() => setShowFilters(true)}
                    >
                      Filtreler
                    </Button> */}
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
            <div className={`fixed inset-0 z-50 ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}> 
              <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${showFilters ? 'opacity-50' : 'opacity-0'}`}
                onClick={() => setShowFilters(false)}
              />
              <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background-light-card dark:bg-background-card shadow-2xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                <FilterPanel
                  filterGroups={[]}
                  onApplyFilters={() => setShowFilters(false)}
                  onResetFilters={() => {}}
                  onClose={() => setShowFilters(false)}
                  variant="sidebar"
                />
              </div>
            </div>
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                <StatsCard title="Apartman Dairesi" value={units.filter(u => u.type === 'RESIDENCE').length} icon={Building} color="primary" loading={loading} size="md" />
                <StatsCard title="Villa" value={units.filter(u => u.type === 'VILLA').length} icon={Home} color="success" loading={loading} size="md" />
                <StatsCard title="Ticari Alan" value={units.filter(u => u.type === 'COMMERCIAL').length} icon={Store} color="info" loading={loading} size="md" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="lg:col-span-1">
                {viewMode === 'table' && (
                  <GenericListView
                    data={units}
                    loading={loading}
                    error={error}
                    columns={getTableColumns()}
                    pagination={{
                      currentPage: pagination.page,
                      totalPages: pagination.totalPages,
                      totalRecords: pagination.total,
                      recordsPerPage: pagination.limit,
                      onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
                      onRecordsPerPageChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
                    }}
                    emptyStateMessage="Şu anda boş durumda olan konut kaydı bulunmuyor."
                    selectable={false}
                    showPagination={true}
                  />
                )}
                {/* Grid görünümü ileride eklenebilir */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 