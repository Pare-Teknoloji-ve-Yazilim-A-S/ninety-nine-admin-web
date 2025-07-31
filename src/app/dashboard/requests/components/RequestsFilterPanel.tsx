import React, { useState } from 'react';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import Input from '@/app/components/ui/Input';
import Badge from '@/app/components/ui/Badge';
import { RequestsFilterPanelProps, RequestsListFilters } from '@/services/types/request-list.types';
import { X, Filter, RotateCcw, Check } from 'lucide-react';

export default function RequestsFilterPanel({
  filters,
  activeFilters,
  onApplyFilters,
  onResetFilters,
  onClose,
  isOpen
}: RequestsFilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<RequestsListFilters>(activeFilters);

  const handleFilterChange = (key: keyof RequestsListFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onResetFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.keys(localFilters).filter(key => {
      const value = localFilters[key as keyof RequestsListFilters];
      return value !== undefined && value !== null && value !== '' && value !== 'all';
    }).length;
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-background-light-card dark:bg-background-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-background-light-secondary dark:border-background-secondary">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-gold/10 rounded-lg flex items-center justify-center">
            <Filter className="h-4 w-4 text-primary-gold" />
          </div>
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Filtreler
          </h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="soft" color="primary" className="text-xs">
              {getActiveFiltersCount()} aktif
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={onClose}
          className="text-text-light-muted hover:text-text-on-light dark:text-text-muted dark:hover:text-text-on-dark"
        />
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Status Filter */}
        {filters.status && (
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
              {filters.status.label}
            </label>
            <Select
              value={localFilters.status || 'all'}
              onChange={(e: any) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
              options={filters.status.options?.map(opt => ({
                value: opt.value,
                label: opt.count ? `${opt.label} (${opt.count})` : opt.label
              })) || []}
            />
          </div>
        )}

        {/* Priority Filter */}
        {filters.priority && (
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
              {filters.priority.label}
            </label>
            <Select
              value={localFilters.priority || 'all'}
              onChange={(e: any) => handleFilterChange('priority', e.target.value === 'all' ? undefined : e.target.value)}
              options={filters.priority.options?.map(opt => ({
                value: opt.value,
                label: opt.count ? `${opt.icon || ''} ${opt.label} (${opt.count})` : `${opt.icon || ''} ${opt.label}`
              })) || []}
            />
          </div>
        )}

        {/* Category Filter */}
        {filters.category && (
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
              {filters.category.label}
            </label>
            <Select
              value={localFilters.category || 'all'}
              onChange={(e: any) => handleFilterChange('category', e.target.value === 'all' ? undefined : e.target.value)}
              options={filters.category.options?.map(opt => ({
                value: opt.value,
                label: opt.count ? `${opt.icon || ''} ${opt.label} (${opt.count})` : `${opt.icon || ''} ${opt.label}`
              })) || []}
            />
          </div>
        )}

        {/* Assignee Filter */}
        {filters.assignee && (
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
              {filters.assignee.label}
            </label>
            <Select
              value={localFilters.assignee || 'all'}
              onChange={(e: any) => handleFilterChange('assignee', e.target.value === 'all' ? undefined : e.target.value)}
              options={filters.assignee.options?.map(opt => ({
                value: opt.value,
                label: opt.count 
                  ? `${opt.label}${opt.company ? ` (${opt.company})` : ''} (${opt.count})`
                  : `${opt.label}${opt.company ? ` (${opt.company})` : ''}`
              })) || []}
            />
          </div>
        )}

        {/* Building Filter */}
        {filters.building && (
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
              {filters.building.label}
            </label>
            <Select
              value={localFilters.building || 'all'}
              onChange={(e: any) => handleFilterChange('building', e.target.value === 'all' ? undefined : e.target.value)}
              options={filters.building.options?.map(opt => ({
                value: opt.value,
                label: opt.count ? `${opt.label} (${opt.count})` : opt.label
              })) || []}
            />
          </div>
        )}

        {/* Date Range Filter */}
        {filters.dateRange && (
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
              {filters.dateRange.label}
            </label>
            
            {/* Quick Presets */}
            {filters.dateRange.presets && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {filters.dateRange.presets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Handle preset selection
                        console.log('Preset selected:', preset.value);
                      }}
                      className="text-left justify-start"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Date Range */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-light-muted dark:text-text-muted mb-1">
                  Başlangıç Tarihi
                </label>
                <Input
                  type="date"
                  value={localFilters.startDate || ''}
                  onChange={(e: any) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-text-light-muted dark:text-text-muted mb-1">
                  Bitiş Tarihi
                </label>
                <Input
                  type="date"
                  value={localFilters.endDate || ''}
                  onChange={(e: any) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-background-light-secondary dark:border-background-secondary">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={RotateCcw}
            onClick={handleReset}
            className="flex-1"
          >
            Sıfırla
          </Button>
          <Button
            variant="primary"
            icon={Check}
            onClick={handleApply}
            className="flex-1"
          >
            Uygula ({getActiveFiltersCount()})
          </Button>
        </div>
      </div>
    </div>
  );
}