'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { Calendar } from 'lucide-react';

interface AgendaItem {
    time: string;
    event: string;
    type: 'meeting' | 'maintenance';
}

interface TodaysAgendaProps {
    agendaItems?: AgendaItem[];
    title?: string;
    subtitle?: string;
}

const defaultAgendaItems: AgendaItem[] = [
    { time: '09:00', event: 'Yönetim Kurulu Toplantısı', type: 'meeting' },
    { time: '11:30', event: 'A Blok Genel Temizlik', type: 'maintenance' },
    { time: '14:00', event: 'Asansör Bakım Kontrolü', type: 'maintenance' },
    { time: '16:00', event: 'Yeni Sakin Görüşmesi', type: 'meeting' },
];

export default function TodaysAgenda({
    agendaItems = defaultAgendaItems,
    title = "Bugünün Ajandası",
    subtitle = "Planlanan etkinlikler"
}: TodaysAgendaProps) {
    return (
        <Card title={title} subtitle={subtitle} icon={Calendar}>
            <div className="space-y-3">
                {agendaItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className="w-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {item.time}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.event}
                            </p>
                            <Badge
                                variant="soft"
                                color={item.type === 'meeting' ? 'primary' : 'gold'}
                                size="sm"
                            >
                                {item.type === 'meeting' ? 'Toplantı' : 'Bakım'}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
} 