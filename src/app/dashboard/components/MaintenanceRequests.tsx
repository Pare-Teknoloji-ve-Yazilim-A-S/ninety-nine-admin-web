'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';

interface MaintenanceRequest {
    id: number;
    type: string;
    unit: string;
    priority: 'Acil' | 'Normal' | 'Düşük';
    status: 'Bekliyor' | 'Devam Ediyor' | 'Tamamlandı';
}

interface MaintenanceRequestsProps {
    requests?: MaintenanceRequest[];
    title?: string;
    subtitle?: string;
}

const defaultRequests: MaintenanceRequest[] = [
    { id: 1, type: 'Tesisatçı', unit: 'A-201', priority: 'Acil', status: 'Bekliyor' },
    { id: 2, type: 'Elektrikçi', unit: 'C-105', priority: 'Normal', status: 'Devam Ediyor' },
    { id: 3, type: 'Boyacı', unit: 'B-301', priority: 'Düşük', status: 'Tamamlandı' },
    { id: 4, type: 'Kalorifer', unit: 'A-401', priority: 'Acil', status: 'Bekliyor' },
];

export default function MaintenanceRequests({
    requests = defaultRequests,
    title = "Bakım & Arıza Talepleri",
    subtitle = "Aktif servis talepleri"
}: MaintenanceRequestsProps) {
    return (
        <Card title={title} subtitle={subtitle}>
            <div className="space-y-3">
                {requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${request.priority === 'Acil' ? 'bg-red-500' :
                                    request.priority === 'Normal' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`} />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {request.type} - {request.unit}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {request.priority} öncelik
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="soft"
                            color={
                                request.status === 'Tamamlandı' ? 'primary' :
                                    request.status === 'Devam Ediyor' ? 'gold' :
                                        'red'
                            }
                            size="sm"
                        >
                            {request.status}
                        </Badge>
                    </div>
                ))}
            </div>
        </Card>
    );
} 