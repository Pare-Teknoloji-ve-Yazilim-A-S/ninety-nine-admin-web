import React from 'react';
import { QuickStats } from '@/services/types/property.types';
import Card from '@/app/components/ui/Card';
import { Building, Home, Store, Car } from 'lucide-react';

interface UnitsQuickStatsProps {
    quickStats: QuickStats | null;
    loading: boolean;
}

export const UnitsQuickStats: React.FC<UnitsQuickStatsProps> = ({
    quickStats,
    loading
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="p-6">
                        <div className="animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    const apartmentUnits = quickStats?.apartmentUnits.total || 0;
    const villaUnits = quickStats?.villaUnits.total || 0;
    const commercialUnits = quickStats?.commercialUnits.total || 0;
    const parkingSpaces = quickStats?.parkingSpaces.total || 0;

    const statCards = [
        {
            title: 'Apartman Dairesi',
            value: apartmentUnits,
            icon: Building,
            color: 'primary-gold',
            bgColor: 'primary-gold/10 dark:bg-primary-gold/20'
        },
        {
            title: 'Villa',
            value: villaUnits,
            icon: Home,
            color: 'semantic-success-500',
            bgColor: 'semantic-success-500/10 dark:bg-semantic-success-500/20'
        },
        {
            title: 'Ticari Alan',
            value: commercialUnits,
            icon: Store,
            color: 'primary-blue',
            bgColor: 'primary-blue/10 dark:bg-primary-blue/20'
        },
        {
            title: 'Otopark Alanı',
            value: parkingSpaces,
            icon: Car,
            color: 'primary-red',
            bgColor: 'primary-red/10 dark:bg-primary-red/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                
                return (
                    <Card key={index} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                <IconComponent className={`h-6 w-6 text-${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                    {stat.value.toLocaleString()}
                                </p>
                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    {stat.title}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};