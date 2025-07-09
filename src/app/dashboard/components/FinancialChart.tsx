'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import { TrendingUp, Activity } from 'lucide-react';

interface FinancialChartProps {
    title?: string;
    subtitle?: string;
}

export default function FinancialChart({
    title = "Aidat Tahsilat Trendi",
    subtitle = "Son 6 ay"
}: FinancialChartProps) {
    return (
        <Card title={title} subtitle={subtitle} icon={TrendingUp}>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Grafik bileşeni entegre edilecek
                    </p>
                </div>
            </div>
        </Card>
    );
} 