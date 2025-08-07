import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import Badge from '@/app/components/ui/Badge';
import Select from '@/app/components/ui/Select';
import { RequestsFiltersBarProps } from '@/services/types/request-list.types';
import { Filter, List, Grid3X3, X, Search } from 'lucide-react';

export default function RequestsFiltersBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeFiltersCount,
  viewMode,
  onViewModeChange,
  filters,
  onApplyFilters,
  onResetFilters
}: RequestsFiltersBarProps & {
  filters?: any;
  onApplyFilters?: (filters: any) => void;
  onResetFilters?: () => void;
}) {
  const [localFilters, setLocalFilters] = useState({
    category: '',
    priority: '',
    status: '',
    assignee: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Apply filters immediately
    if (onApplyFilters) {
      onApplyFilters(newFilters);
    }
  };

  const handleResetFilters = () => {
    setLocalFilters({
      category: '',
      priority: '',
      status: '',
      assignee: ''
    });
    
    if (onResetFilters) {
      onResetFilters();
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <Card className="mb-6 relative">
      <div className="p-6">
        {/* Search Bar and View Toggle */}
        <div className="flex items-center gap-64 mb-4">
          <div className="flex-1 max-w-[70%]">
            <SearchBar
              placeholder="Talep ID, açıklama veya daire numarası ile ara..."
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearchSubmit}
              debounceMs={500}
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex-shrink-0">
            <ViewToggle
              options={[
                { id: 'table', label: 'Tablo', icon: List },
                { id: 'grid', label: 'Kart', icon: Grid3X3 },
              ]}
              activeView={viewMode}
              onViewChange={(viewId) => onViewModeChange(viewId as 'table' | 'grid')}
              size="sm"
            />
          </div>
        </div>

        {/* Inline Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Kategori Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Kategori
            </label>
            <Select
              value={localFilters.category}
              onChange={(e: any) => handleFilterChange('category', e.target.value)}
              placeholder="Tüm kategoriler"
              options={[
                { value: '', label: 'Tüm kategoriler' },
                { value: 'plumbing', label: 'Su Tesisatı' },
                { value: 'electrical', label: 'Elektrik' },
                { value: 'heating', label: 'Isıtma' },
                { value: 'cleaning', label: 'Temizlik' },
                { value: 'security', label: 'Güvenlik' },
                { value: 'other', label: 'Diğer' }
              ]}
            />
          </div>

          {/* Öncelik Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Öncelik
            </label>
            <Select
              value={localFilters.priority}
              onChange={(e: any) => handleFilterChange('priority', e.target.value)}
              placeholder="Tüm öncelikler"
              options={[
                { value: '', label: 'Tüm öncelikler' },
                { value: 'low', label: 'Düşük' },
                { value: 'medium', label: 'Orta' },
                { value: 'high', label: 'Yüksek' },
                { value: 'urgent', label: 'Acil' }
              ]}
            />
          </div>

          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Durum
            </label>
            <Select
              value={localFilters.status}
              onChange={(e: any) => handleFilterChange('status', e.target.value)}
              placeholder="Tüm durumlar"
              options={[
                { value: '', label: 'Tüm durumlar' },
                { value: 'open', label: 'Açık' },
                { value: 'in_progress', label: 'İşlemde' },
                { value: 'waiting', label: 'Bekliyor' },
                { value: 'resolved', label: 'Çözüldü' },
                { value: 'closed', label: 'Kapalı' }
              ]}
            />
          </div>

          {/* Teknisyen Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Teknisyen
            </label>
            <Select
              value={localFilters.assignee}
              onChange={(e: any) => handleFilterChange('assignee', e.target.value)}
              placeholder="Tüm teknisyenler"
              options={[
                { value: '', label: 'Tüm teknisyenler' },
                { value: '', label: 'Atanmamış' },
                { value: 'tech1', label: 'Ahmet Yılmaz' },
                { value: 'tech2', label: 'Mehmet Demir' },
                { value: 'tech3', label: 'Ali Kaya' }
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar - Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-3 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
            <Badge variant="soft" color="primary" className="text-xs">
              {Object.values(localFilters).filter(v => v !== '').length} filtre aktif
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={handleResetFilters}
              className="text-text-light-muted dark:text-text-muted hover:text-primary-red"
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}