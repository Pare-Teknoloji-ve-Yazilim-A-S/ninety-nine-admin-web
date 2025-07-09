'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import ProgressBar from '@/app/components/ui/ProgressBar';

interface OccupancyData {
    blockName: string;
    occupied: number;
    total: number;
    percentage: number;
}

interface OccupancyStatusProps {
    occupancyData?: OccupancyData[];
    title?: string;
    subtitle?: string;
}

const defaultOccupancyData: OccupancyData[] = [
    { blockName: 'A Blok', occupied: 48, total: 50, percentage: 96 },
    { blockName: 'B Blok', occupied: 45, total: 50, percentage: 90 },
    { blockName: 'C Blok', occupied: 42, total: 50, percentage: 84 },
];

export default function OccupancyStatus({
    occupancyData = defaultOccupancyData,
    title = "Doluluk Durumu",
    subtitle = "Bloklar bazında"
}: OccupancyStatusProps) {
    return (
        <Card title={title} subtitle={subtitle}>
            <div className="space-y-4">
                {occupancyData.map((block, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{block.blockName}</span>
                            <span className="font-medium">{block.occupied}/{block.total}</span>
                        </div>
                        <ProgressBar value={block.percentage} className="h-2" />
                    </div>
                ))}
            </div>
        </Card>
    );
} 