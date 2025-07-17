'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { Building, Map, Plus, RefreshCw, Filter, List, Grid3X3, Home, Store, Car, RotateCcw } from 'lucide-react';
import StatsCard from '@/app/components/ui/StatsCard';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import FilterPanel from '@/app/components/ui/FilterPanel';
import Link from 'next/link';

// Mock data for maintenance units
const mockUnits = [];
const mockQuickStats = {
  apartmentUnits: { total: 1 },
  villaUnits: { total: 1 },
  commercialUnits: { total: 0 },
  parkingSpaces: { total: 0 }
};

export default function MaintenanceUnitsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Konutlar', href: '/dashboard/units' },
    { label: 'Bakım Durumu', active: true }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72">
          <DashboardHeader title="Bakım Durumu" breadcrumbItems={breadcrumbItems} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                  Bakımda Olan Konutlar <span className="text-primary-gold">({mockUnits.length} Konut)</span>
                </h2>
                <p className="text-text-light-secondary dark:text-text-secondary">
                  Sadece bakımda olan daire, villa ve ticari alanlar listelenir.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="md" icon={RefreshCw} onClick={() => {}}>
                  Yenile
                </Button>
                <Link href="/dashboard/units/add">
                  <Button variant="primary" size="md" icon={Plus}>
                    Yeni Konut
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar
                      placeholder="Blok, daire no, sakin adı, telefon veya özellik ile ara..."
                      value={searchInput}
                      onChange={setSearchInput}
                      onSearch={setSearchInput}
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
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
                <StatsCard title="Apartman Dairesi" value={mockQuickStats.apartmentUnits.total} icon={Building} color="primary" loading={false} size="md" />
                <StatsCard title="Villa" value={mockQuickStats.villaUnits.total} icon={Home} color="success" loading={false} size="md" />
                <StatsCard title="Ticari Alan" value={mockQuickStats.commercialUnits.total} icon={Store} color="info" loading={false} size="md" />
                <StatsCard title="Otopark Alanı" value={mockQuickStats.parkingSpaces.total} icon={Car} color="danger" loading={false} size="md" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <div className="p-8 text-center">
                    <EmptyState
                      icon={<RotateCcw />}
                      title="Bakımda Konut Bulunamadı"
                      description="Şu anda bakımda olan konut kaydı bulunmuyor."
                    />
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