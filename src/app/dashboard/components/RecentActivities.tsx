'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import { Activity } from 'lucide-react';

interface ActivityItem {
    time: string;
    activity: string;
    type: 'user' | 'payment' | 'maintenance' | 'announcement';
}

interface RecentActivitiesProps {
    activities?: ActivityItem[];
    title?: string;
    subtitle?: string;
}

const defaultActivities: ActivityItem[] = [
    { time: '5 dk önce', activity: 'Yeni sakin başvurusu alındı (A-505)', type: 'user' },
    { time: '1 saat önce', activity: 'Aidat ödemesi yapıldı (B-201)', type: 'payment' },
    { time: '2 saat önce', activity: 'Bakım talebi tamamlandı (C-301)', type: 'maintenance' },
    { time: '3 saat önce', activity: 'Yeni duyuru yayınlandı', type: 'announcement' },
];

export default function RecentActivities({
    activities = defaultActivities,
    title = "Son Aktiviteler",
    subtitle = "Sistem günlüğü"
}: RecentActivitiesProps) {
    return (
        <Card title={title} subtitle={subtitle} icon={Activity}>
            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                                {activity.activity}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
} 