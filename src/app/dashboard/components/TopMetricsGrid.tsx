'use client';

import React, { useEffect, useState } from 'react';
import Card, { CardTitle } from '@/app/components/ui/Card';
import {
    Home,
    Users,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Clock
} from 'lucide-react';

interface MetricData {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: 'primary' | 'gold' | 'red';
    trend?: 'up' | 'down' | null;
}

interface TopMetricsGridProps {
    metrics?: MetricData[];
    totalProperties?: number;
    assignedProperties?: number;
    loading?: boolean;
    ticketStats?: {
        currentMonthCount: number;
        percentageChange: number;
        changeDirection: 'increase' | 'decrease';
    } | null;
    ticketStatsLoading?: boolean;
    expiringAnnouncementsCount?: number;
    expiringAnnouncementsLoading?: boolean;
}

// Dil çevirileri
const translations = {
    tr: {
        totalProperties: 'Toplam Konut',
        occupiedProperties: 'Dolu Konutlar',
        occupancy: 'doluluk',
        openRequests: 'Açık Talepler',
        expiringAnnouncements: 'Süresi Dolacak Duyurular',
        within1Day: '1 gün içinde'
    },
    en: {
        totalProperties: 'Total Properties',
        occupiedProperties: 'Occupied Properties',
        occupancy: 'occupancy',
        openRequests: 'Open Requests',
        expiringAnnouncements: 'Expiring Announcements',
        within1Day: 'within 1 day'
    },
    ar: {
        totalProperties: 'إجمالي العقارات',
        occupiedProperties: 'العقارات المشغولة',
        occupancy: 'معدل الإشغال',
        openRequests: 'الطلبات المفتوحة',
        expiringAnnouncements: 'الإعلانات المنتهية الصلاحية',
        within1Day: 'خلال يوم واحد'
    }
};

export default function TopMetricsGrid({ 
    metrics = [], 
    totalProperties, 
    assignedProperties, 
    loading = false,
    ticketStats,
    ticketStatsLoading = false,
    expiringAnnouncementsCount,
    expiringAnnouncementsLoading = false
}: TopMetricsGridProps) {
    const [currentLanguage, setCurrentLanguage] = useState('tr');

    // Dil tercihini localStorage'dan al
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];

    // Create dynamic metrics based on real data
    const dynamicMetrics: MetricData[] = [
        {
            title: t.totalProperties,
            value: loading ? '...' : totalProperties?.toLocaleString() || '0',
            icon: Home,
            color: 'primary',
            trend: null
        },
        {
            title: t.occupiedProperties,
            value: loading ? '...' : assignedProperties?.toLocaleString() || '0',
            subtitle: (totalProperties && assignedProperties) ? 
                `%${Math.round((assignedProperties / totalProperties) * 100)} ${t.occupancy}` : undefined,
            icon: Users,
            color: 'gold',
            trend: null
        },
        {
            title: t.openRequests,
            value: ticketStatsLoading ? '...' : ticketStats?.currentMonthCount?.toString() || '0',
            subtitle: ticketStats ? 
                `${ticketStats.changeDirection === 'increase' ? '↑' : '↓'} %${ticketStats.percentageChange}` : 
                undefined,
            icon: AlertTriangle,
            color: 'red',
            trend: ticketStats?.changeDirection === 'increase' ? 'up' : 'down'
        },
        {
            title: t.expiringAnnouncements,
            value: expiringAnnouncementsLoading ? '...' : (expiringAnnouncementsCount ?? 0).toString(),
            subtitle: t.within1Day,
            icon: Clock,
            color: 'gold',
            trend: null
        }
    ];

    const displayMetrics = totalProperties !== undefined || assignedProperties !== undefined ? dynamicMetrics : metrics;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayMetrics.map((metric, index) => (
                <Card
                    key={index}
                    variant="elevated"
                    hover={true}
                    className="relative overflow-hidden"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                {metric.title}
                            </CardTitle>
                            <div className="mt-2">
                                <div className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                    {metric.value}
                                </div>
                                {metric.subtitle && (
                                    <div className="flex items-center mt-1">
                                        {metric.trend === 'up' && (
                                            <TrendingUp className="w-4 h-4 text-semantic-success-500 mr-1" />
                                        )}
                                        {metric.trend === 'down' && (
                                            <TrendingDown className="w-4 h-4 text-primary-red mr-1" />
                                        )}
                                        <span className={`text-sm ${metric.trend === 'up' ? 'text-semantic-success-600' :
                                            metric.trend === 'down' ? 'text-primary-red' :
                                                'text-text-light-secondary dark:text-text-secondary'
                                            }`}>
                                            {metric.subtitle}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${metric.color === 'primary' ? 'bg-primary-blue-light/50 dark:bg-blue-900/30' :
                            metric.color === 'gold' ? 'bg-primary-gold-light/30 dark:bg-primary-gold/20' :
                                'bg-primary-red-light/50 dark:bg-red-900/30'
                            }`}>
                            <metric.icon className={`w-6 h-6 ${metric.color === 'primary' ? 'text-primary-blue' :
                                metric.color === 'gold' ? 'text-primary-gold' :
                                    'text-primary-red'
                                }`} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
} 