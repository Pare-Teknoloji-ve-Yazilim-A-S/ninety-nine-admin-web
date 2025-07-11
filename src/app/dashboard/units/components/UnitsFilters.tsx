import React from 'react';
import { PropertyFilterParams } from '@/services/types/property.types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import { Filter, Grid3X3, List, Building, Map } from 'lucide-react';

interface UnitsFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: PropertyFilterParams;
    onFiltersChange: (filters: PropertyFilterParams) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    viewMode: 'table' | 'grid' | 'block' | 'map';
    onViewModeChange: (mode: 'table' | 'grid' | 'block' | 'map') => void;
}

const viewModeOptions = [
    { id: 'table', value: 'table', label: 'Tablo', icon: List },
    { id: 'grid', value: 'grid', label: 'Kart', icon: Grid3X3 },
    { id: 'block', value: 'block', label: 'Blok', icon: Building },
    { id: 'map', value: 'map', label: 'Harita', icon: Map }
];

export const UnitsFilters: React.FC<UnitsFiltersProps> = ({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    showFilters,
    onToggleFilters,
    viewMode,
    onViewModeChange
}) => {
    const handleFilterChange = (key: keyof PropertyFilterParams, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value === 'all' ? undefined : value,
            page: 1 // Reset to first page when filter changes
        });
    };

    return (
        <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Blok, daire no, sakin adı, telefon veya özellik ile ara..."
                        value={searchQuery}
                        onChange={onSearchChange}
                    />
                </div>
                <div className="flex gap-3">
                    <Button
                        variant={showFilters ? "primary" : "secondary"}
                        size="sm"
                        icon={Filter}
                        onClick={onToggleFilters}
                    >
                        Filtrele
                    </Button>
                    <ViewToggle
                        activeView={viewMode}
                        onViewChange={onViewModeChange}
                        options={viewModeOptions}
                    />
                </div>
            </div>

            {showFilters && (
                <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Konut Tipi
                            </label>
                            <select
                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                value={filters.type || 'all'}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <option value="all">Tümü</option>
                                <option value="RESIDENCE">Daire</option>
                                <option value="VILLA">Villa</option>
                                <option value="COMMERCIAL">Ticari</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Durum
                            </label>
                            <select
                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                value={filters.status || 'all'}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="all">Tümü</option>
                                <option value="OCCUPIED">Dolu</option>
                                <option value="AVAILABLE">Boş</option>
                                <option value="UNDER_MAINTENANCE">Bakımda</option>
                                <option value="RESERVED">Rezerve</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Blok
                            </label>
                            <select
                                className="w-full px-3 py-2 bg-background-light-soft dark:bg-background-soft border border-border-light dark:border-border-dark rounded-lg text-text-on-light dark:text-text-on-dark"
                                value={filters.blockNumber || 'all'}
                                onChange={(e) => handleFilterChange('blockNumber', e.target.value)}
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
                                value={filters.rooms || 'all'}
                                onChange={(e) => handleFilterChange('rooms', e.target.value)}
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
                                value={filters.debtStatus || 'all'}
                                onChange={(e) => handleFilterChange('debtStatus', e.target.value)}
                            >
                                <option value="all">Tümü</option>
                                <option value="clean">Temiz Hesap</option>
                                <option value="indebted">Borçlu</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};