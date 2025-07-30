import React from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import Badge from '@/app/components/ui/Badge';
import { RequestsFiltersBarProps } from '@/services/types/request-list.types';
import { Filter, List, Grid3X3, X } from 'lucide-react';

export default function RequestsFiltersBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeFiltersCount,
  onShowFilters,
  viewMode,
  onViewModeChange
}: RequestsFiltersBarProps) {
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Left side - Search Bar */}
          <div className="flex-1 max-w-lg">
            <SearchBar
              placeholder="Talep ID, açıklama veya daire numarası ile ara..."
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearchSubmit}
              debounceMs={500}
            />
          </div>

          {/* Right side - Filters and View Toggle */}
          <div className="flex items-center gap-3">
            {/* Active Filters Indicator */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="soft" color="primary" className="text-xs">
                  {activeFiltersCount} filtre aktif
                </Badge>
              </div>
            )}

            {/* Filters Button */}
            <Button
              variant={activeFiltersCount > 0 ? "primary" : "secondary"}
              size="md"
              icon={Filter}
              onClick={onShowFilters}
              className="relative"
            >
              Filtreler
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="solid" 
                  color="gold" 
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs px-1"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* View Toggle */}
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

        {/* Active Filters Tags (if any) */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-text-light-muted dark:text-text-muted">
                Aktif filtreler:
              </span>
              {/* This would be populated by the parent component with actual filter values */}
              <div className="flex gap-2 flex-wrap">
                {/* Filter tags would be rendered here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}