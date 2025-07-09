'use client';

import React from 'react';
import Card, { CardTitle } from '@/app/components/ui/Card';
import {
    Home,
    Users,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    TrendingDown
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
}

const defaultMetrics: MetricData[] = [
    {
        title: 'Toplam Konut',
        value: '2,500',
        icon: Home,
        color: 'primary',
        trend: null
    },
    {
        title: 'Dolu Konutlar',
        value: '2,350',
        subtitle: '%94 doluluk',
        icon: Users,
        color: 'gold',
        trend: null
    },
    {
        title: 'Bu Ay Tahsilat',
        value: '₺4.2M',
        subtitle: '↑ %12',
        icon: DollarSign,
        color: 'primary',
        trend: 'up'
    },
    {
        title: 'Açık Talepler',
        value: '47',
        subtitle: '↓ %8',
        icon: AlertTriangle,
        color: 'red',
        trend: 'down'
    }
];

export default function TopMetricsGrid({ metrics = defaultMetrics }: TopMetricsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
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