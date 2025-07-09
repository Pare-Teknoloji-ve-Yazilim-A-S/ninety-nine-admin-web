import React, { useState } from 'react';
import { X, Filter, RotateCcw, Search, Calendar, DollarSign, Users, Home, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Badge from './Badge';

export interface FilterOption {
    id: string;
    label: string;
    value: any;
    count?: number;
}

export interface FilterGroup {
    id: string;
    label: string;
    type: 'select' | 'multiselect' | 'daterange' | 'numberrange' | 'search' | 'checkbox' | 'radio';
    options?: FilterOption[];
    placeholder?: string;
    defaultValue?: any;
    icon?: React.ComponentType<{ size?: string | number; className?: string }>;
    collapsible?: boolean;
    collapsed?: boolean;
}

interface AppliedFilter {
    groupId: string;
    groupLabel: string;
    optionId: string;
    optionLabel: string;
    value: any;
}

interface FilterPanelProps {
    filterGroups: FilterGroup[];
    onApplyFilters: (filters: Record<string, any>) => void;
    onResetFilters: () => void;
    appliedFilters?: AppliedFilter[];
    isOpen?: boolean;
    onClose?: () => void;
    className?: string;
    variant?: 'sidebar' | 'dropdown' | 'modal';
    showAppliedFilters?: boolean;
    showFilterCount?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    filterGroups,
    onApplyFilters,
    onResetFilters,
    appliedFilters = [],
    isOpen = true,
    onClose,
    className,
    variant = 'sidebar',
    showAppliedFilters = true,
    showFilterCount = true,
}) => {
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

    const variantClasses = {
        sidebar: 'h-full overflow-y-auto',
        dropdown: 'w-96 max-h-96 overflow-y-auto',
        modal: 'w-full max-w-2xl max-h-[80vh] overflow-y-auto',
    };

    const updateFilter = (groupId: string, value: any) => {
        const newFilters = { ...filters };
        if (value === undefined || value === null || value === '') {
            delete newFilters[groupId];
        } else {
            newFilters[groupId] = value;
        }
        setFilters(newFilters);
    };

    const toggleCollapse = (groupId: string) => {
        const newCollapsed = new Set(collapsedGroups);
        if (newCollapsed.has(groupId)) {
            newCollapsed.delete(groupId);
        } else {
            newCollapsed.add(groupId);
        }
        setCollapsedGroups(newCollapsed);
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
        if (variant === 'dropdown' || variant === 'modal') {
            onClose?.();
        }
    };

    const handleResetFilters = () => {
        setFilters({});
        onResetFilters();
    };

    const removeAppliedFilter = (groupId: string) => {
        const newFilters = { ...filters };
        delete newFilters[groupId];
        setFilters(newFilters);
        onApplyFilters(newFilters);
    };

    const getFilterCount = () => {
        return Object.keys(filters).length;
    };

    const renderFilterGroup = (group: FilterGroup) => {
        const isCollapsed = collapsedGroups.has(group.id);
        const currentValue = filters[group.id];

        const renderFilterContent = () => {
            switch (group.type) {
                case 'search':
                    return (
                        <Input
                            placeholder={group.placeholder || 'Ara...'}
                            value={currentValue || ''}
                            onChange={(e) => updateFilter(group.id, e.target.value)}
                            icon={Search}
                        />
                    );

                case 'select':
                    return (
                        <Select
                            value={currentValue || ''}
                            onChange={(value) => updateFilter(group.id, value)}
                            placeholder={group.placeholder || 'Seçiniz...'}
                        >
                            <option value="">Tümü</option>
                            {group.options?.map((option) => (
                                <option key={option.id} value={option.value}>
                                    {option.label}
                                    {showFilterCount && option.count && ` (${option.count})`}
                                </option>
                            ))}
                        </Select>
                    );

                case 'multiselect':
                    return (
                        <div className="space-y-2">
                            {group.options?.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentValue?.includes(option.value) || false}
                                        onChange={(e) => {
                                            const current = currentValue || [];
                                            if (e.target.checked) {
                                                updateFilter(group.id, [...current, option.value]);
                                            } else {
                                                updateFilter(group.id, current.filter((v: any) => v !== option.value));
                                            }
                                        }}
                                        className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold/50"
                                    />
                                    <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                        {option.label}
                                        {showFilterCount && option.count && (
                                            <span className="text-text-light-muted dark:text-text-muted ml-1">
                                                ({option.count})
                                            </span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    );

                case 'radio':
                    return (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={group.id}
                                    checked={!currentValue}
                                    onChange={() => updateFilter(group.id, undefined)}
                                    className="border-gray-300 text-primary-gold focus:ring-primary-gold/50"
                                />
                                <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                    Tümü
                                </span>
                            </label>
                            {group.options?.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={group.id}
                                        checked={currentValue === option.value}
                                        onChange={() => updateFilter(group.id, option.value)}
                                        className="border-gray-300 text-primary-gold focus:ring-primary-gold/50"
                                    />
                                    <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                        {option.label}
                                        {showFilterCount && option.count && (
                                            <span className="text-text-light-muted dark:text-text-muted ml-1">
                                                ({option.count})
                                            </span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    );

                case 'daterange':
                    return (
                        <div className="space-y-2">
                            <Input
                                type="date"
                                label="Başlangıç"
                                value={currentValue?.start || ''}
                                onChange={(e) => updateFilter(group.id, {
                                    ...currentValue,
                                    start: e.target.value
                                })}
                            />
                            <Input
                                type="date"
                                label="Bitiş"
                                value={currentValue?.end || ''}
                                onChange={(e) => updateFilter(group.id, {
                                    ...currentValue,
                                    end: e.target.value
                                })}
                            />
                        </div>
                    );

                case 'numberrange':
                    return (
                        <div className="space-y-2">
                            <Input
                                type="number"
                                label="Minimum"
                                value={currentValue?.min || ''}
                                onChange={(e) => updateFilter(group.id, {
                                    ...currentValue,
                                    min: Number(e.target.value)
                                })}
                            />
                            <Input
                                type="number"
                                label="Maksimum"
                                value={currentValue?.max || ''}
                                onChange={(e) => updateFilter(group.id, {
                                    ...currentValue,
                                    max: Number(e.target.value)
                                })}
                            />
                        </div>
                    );

                case 'checkbox':
                    return (
                        <div className="space-y-2">
                            {group.options?.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentValue?.[option.id] || false}
                                        onChange={(e) => updateFilter(group.id, {
                                            ...currentValue,
                                            [option.id]: e.target.checked
                                        })}
                                        className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold/50"
                                    />
                                    <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    );

                default:
                    return null;
            }
        };

        return (
            <div key={group.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="p-4">
                    {/* Group Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {group.icon && <group.icon size={16} className="text-primary-gold" />}
                            <h3 className="font-medium text-text-on-light dark:text-text-on-dark">
                                {group.label}
                            </h3>
                        </div>
                        {group.collapsible && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCollapse(group.id)}
                                className="h-6 w-6 p-0"
                            >
                                {isCollapsed ? '+' : '−'}
                            </Button>
                        )}
                    </div>

                    {/* Group Content */}
                    {(!group.collapsible || !isCollapsed) && renderFilterContent()}
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <Card className={cn(variantClasses[variant], className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-primary-gold" />
                    <h2 className="font-semibold text-text-on-light dark:text-text-on-dark">
                        Filtreler
                    </h2>
                    {getFilterCount() > 0 && (
                        <Badge variant="solid" color="gold" size="sm">
                            {getFilterCount()}
                        </Badge>
                    )}
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size='sm'
                        icon={X}
                        onClick={onClose}
                    />
                )}
            </div>

            {/* Applied Filters */}
            {showAppliedFilters && appliedFilters.length > 0 && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Uygulanan Filtreler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {appliedFilters.map((filter) => (
                            <Badge
                                key={`${filter.groupId}-${filter.optionId}`}
                                variant="outline"
                                color="primary"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                {filter.optionLabel}
                                <button
                                    onClick={() => removeAppliedFilter(filter.groupId)}
                                    className="hover:text-primary-red"
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Groups */}
            <div className="flex-1 overflow-y-auto">
                {filterGroups.map(renderFilterGroup)}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="md"
                        icon={RotateCcw}
                        onClick={handleResetFilters}
                        className="flex-1"
                    >
                        Temizle
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleApplyFilters}
                        className="flex-1"
                    >
                        Uygula ({getFilterCount()})
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default FilterPanel;

// Predefined filter groups for common use cases
export const commonFilterGroups = {
    residentStatus: {
        id: 'status',
        label: 'Durum',
        type: 'multiselect' as const,
        icon: CheckCircle,
        options: [
            { id: 'active', label: 'Aktif', value: 'active', count: 1856 },
            { id: 'pending', label: 'Beklemede', value: 'pending', count: 234 },
            { id: 'inactive', label: 'Pasif', value: 'inactive', count: 123 },
            { id: 'suspended', label: 'Askıya Alınmış', value: 'suspended', count: 12 },
        ],
    },
    residentType: {
        id: 'type',
        label: 'Sakin Tipi',
        type: 'radio' as const,
        icon: Users,
        options: [
            { id: 'owner', label: 'Malik', value: 'owner', count: 1856 },
            { id: 'tenant', label: 'Kiracı', value: 'tenant', count: 492 },
            { id: 'guest', label: 'Misafir', value: 'guest', count: 45 },
        ],
    },
    building: {
        id: 'building',
        label: 'Blok',
        type: 'select' as const,
        icon: Home,
        placeholder: 'Blok seçiniz...',
        options: [
            { id: 'a', label: 'A Blok', value: 'A', count: 234 },
            { id: 'b', label: 'B Blok', value: 'B', count: 198 },
            { id: 'c', label: 'C Blok', value: 'C', count: 167 },
        ],
    },
    debtRange: {
        id: 'debt',
        label: 'Borç Miktarı',
        type: 'numberrange' as const,
        icon: DollarSign,
    },
    registrationDate: {
        id: 'registrationDate',
        label: 'Kayıt Tarihi',
        type: 'daterange' as const,
        icon: Calendar,
    },
};