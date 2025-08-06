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

    const handleFilterChange = (key: keyof RequestsListFilters, value: string) => {
    // Handle empty value - convert to undefined
    const stringValue = value === '' ? undefined : value;
    
    console.log(`Filter change - ${key}:`, value, 'Processed value:', stringValue);

    setLocalFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: stringValue
      };
      console.log('Updated localFilters:', newFilters);
      return newFilters;
    });
  };

  const handleApply = () => {
    console.log('=== APPLYING FILTERS ===');
    console.log('localFilters state:', localFilters);
    
    // Process each filter value - remove undefined, null, and empty values
    const processedFilters: any = {};
    
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        processedFilters[key] = value;
      }
    });
    
    console.log('Processed filters to apply:', processedFilters);
    onApplyFilters(processedFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onResetFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.keys(localFilters).filter(key => {
      const value = localFilters[key as keyof RequestsListFilters];
      return value !== undefined && value !== null && value !== '';
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
              value={localFilters.status || ''}
              onChange={(e: any) => {
                console.log('Status select change event:', e);
                handleFilterChange('status', e.target.value);
              }}
              options={[
                { value: '', label: 'Tüm durumlar' },
                ...(filters.status.options?.map(opt => ({
                  value: opt.value,
                  label: opt.count ? `${opt.label} (${opt.count})` : opt.label
                })) || [])
              ]}
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
              value={localFilters.priority || ''}
              onChange={(e: any) => {
                console.log('Priority select change event:', e);
                handleFilterChange('priority', e.target.value);
              }}
              options={[
                { value: '', label: 'Tüm öncelikler' },
                ...(filters.priority.options?.map(opt => ({
                  value: opt.value,
                  label: opt.count ? `${opt.icon || ''} ${opt.label} (${opt.count})` : `${opt.icon || ''} ${opt.label}`
                })) || [])
              ]}
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
              value={localFilters.category || ''}
              onChange={(e: any) => {
                console.log('Category select change event:', e);
                handleFilterChange('category', e.target.value);
              }}
              options={[
                { value: '', label: 'Tüm kategoriler' },
                ...(filters.category.options?.map(opt => ({
                  value: opt.value,
                  label: opt.count ? `${opt.icon || ''} ${opt.label} (${opt.count})` : `${opt.icon || ''} ${opt.label}`
                })) || [])
              ]}
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
              value={localFilters.assignee || ''}
              onChange={(e: any) => {
                console.log('Assignee select change event:', e);
                handleFilterChange('assignee', e.target.value);
              }}
              options={[
                { value: '', label: 'Tüm atananlar' },
                ...(filters.assignee.options?.map(opt => ({
                  value: opt.value,
                  label: opt.count 
                    ? `${opt.label}${opt.company ? ` (${opt.company})` : ''} (${opt.count})`
                    : `${opt.label}${opt.company ? ` (${opt.company})` : ''}`
                })) || [])
              ]}
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
              value={localFilters.building || ''}
              onChange={(e: any) => {
                console.log('Building select change event:', e);
                handleFilterChange('building', e.target.value);
              }}
              options={[
                { value: '', label: 'Tüm binalar' },
                ...(filters.building.options?.map(opt => ({
                  value: opt.value,
                  label: opt.count ? `${opt.label} (${opt.count})` : opt.label
                })) || [])
              ]}
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

      {/* Selected Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="px-6 py-4 border-t border-background-light-secondary dark:border-background-secondary">
          <h4 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-3">
            Seçilen Filtreler
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === '') return null;
              
              // Get the label for the selected value
              let label = '';
              let filterOptions: any[] = [];
              
              switch (key) {
                case 'status':
                  filterOptions = filters.status?.options || [];
                  break;
                case 'priority':
                  filterOptions = filters.priority?.options || [];
                  break;
                case 'category':
                  filterOptions = filters.category?.options || [];
                  break;
                case 'assignee':
                  filterOptions = filters.assignee?.options || [];
                  break;
                case 'building':
                  filterOptions = filters.building?.options || [];
                  break;
              }
              
              const selectedOption = filterOptions.find(opt => opt.value === value);
              label = selectedOption?.label || value;
              
              return (
                <Badge
                  key={key}
                  variant="soft"
                  color="primary"
                  className="text-xs"
                >
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

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