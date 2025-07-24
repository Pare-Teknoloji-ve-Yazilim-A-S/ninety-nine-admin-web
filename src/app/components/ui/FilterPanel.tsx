import React, { useState } from 'react';
import { X, Filter, RotateCcw, Search, Calendar, DollarSign, Users, Home, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Badge from './Badge';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';
import DatePicker from './DatePicker';

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
        console.log(`🔧 UpdateFilter called: groupId=${groupId}, value=${value}, type=${typeof value}`);
        const newFilters = { ...filters };
        if (value === undefined || value === null || value === '') {
            delete newFilters[groupId];
        } else {
            newFilters[groupId] = value;
        }
        console.log(`📝 New filters state:`, newFilters);
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
        console.log(`🎯 handleApplyFilters called with filters:`, filters);
        console.log(`📋 Filter entries:`, Object.entries(filters));
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
        
        console.log(`🔍 Rendering group: ${group.id}, type: ${group.type}, options count: ${group.options?.length || 0}`);
        if (group.type === 'select') {
            console.log(`📝 Select options for ${group.id}:`, group.options);
        }

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
                    const selectOptions = [
                        { value: '', label: 'Tümü' },
                        ...(group.options?.map((option) => ({
                            value: option.value,
                            label: `${option.label}${showFilterCount && option.count ? ` (${option.count})` : ''}`
                        })) || [])
                    ];
                    
                    return (
                        <Select
                            value={currentValue || ''}
                            onChange={(e) => updateFilter(group.id, e.target.value)}
                            placeholder={group.placeholder || 'Seçiniz...'}
                            options={selectOptions}
                        />
                    );

                case 'multiselect':
                    return (
                        <div className="space-y-2">
                            {group.options?.map((option) => (
                                <Checkbox
                                    key={option.id}
                                    id={`${group.id}-${option.id}`}
                                    checked={currentValue?.includes(option.value) || false}
                                    onChange={(e) => {
                                        const current = currentValue || [];
                                        if (e.target.checked) {
                                            updateFilter(group.id, [...current, option.value]);
                                        } else {
                                            updateFilter(group.id, current.filter((v: any) => v !== option.value));
                                        }
                                    }}
                                    label={
                                        <>
                                            {option.label}
                                            {showFilterCount && option.count && (
                                                <span className="text-text-light-muted dark:text-text-muted ml-1">
                                                    ({option.count})
                                                </span>
                                            )}
                                        </>
                                    }
                                    checkboxSize="sm"
                                />
                            ))}
                        </div>
                    );

                case 'radio':
                    return (
                        <RadioButton
                            name={group.id}
                            value={currentValue}
                            onChange={(e) => updateFilter(group.id, e.target.value)}
                            options={[
                                { value: '', label: 'Tümü' },
                                ...(group.options?.map(option => ({
                                    value: option.value,
                                    label: `${option.label}${showFilterCount && option.count ? ` (${option.count})` : ''}`
                                })) || [])
                            ]}
                            radioSize="sm"
                            direction="vertical"
                        />
                    );

                case 'daterange':
                    return (
                        <div className="space-y-2">
                            <DatePicker
                                label="Başlangıç"
                                value={currentValue?.start || ''}
                                onChange={(e) => updateFilter(group.id, {
                                    ...currentValue,
                                    start: e.target.value
                                })}
                                variant="default"
                                showIcon
                            />
                            <DatePicker
                                label="Bitiş"
                                value={currentValue?.end || ''}
                                onChange={(e) => updateFilter(group.id, {
                                    ...currentValue,
                                    end: e.target.value
                                })}
                                variant="default"
                                showIcon
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
                                <Checkbox
                                    key={option.id}
                                    id={`${group.id}-${option.id}`}
                                    checked={currentValue?.[option.id] || false}
                                    onChange={(e) => updateFilter(group.id, {
                                        ...currentValue,
                                        [option.id]: e.target.checked
                                    })}
                                    label={option.label}
                                    checkboxSize="sm"
                                />
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
            { id: 'active', label: 'Aktif', value: 'active',  },
            { id: 'pending', label: 'Beklemede', value: 'pending',  },
            { id: 'inactive', label: 'Pasif', value: 'inactive',  },
            { id: 'suspended', label: 'Askıya Alınmış', value: 'suspended',}
        ],
    },
    residentType: {
        id: 'type',
        label: 'Sakin Tipi',
        type: 'radio' as const,
        icon: Users,
        options: [
            { id: 'owner', label: 'Malik', value: 'owner',  },
            { id: 'tenant', label: 'Kiracı', value: 'tenant', },
            { id: 'guest', label: 'Misafir', value: 'guest',  },
        ],
    },
    building: {
        id: 'building',
        label: 'Blok',
        type: 'select' as const,
        icon: Home,
        placeholder: 'Blok seçiniz...',
        options: [
            { id: 'a', label: 'A Blok', value: 'A', },
            { id: 'b', label: 'B Blok', value: 'B', },
            { id: 'c', label: 'C Blok', value: 'C', },
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