'use client';

import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import { Activity, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuditLog } from '@/services/logging.service';
import Button from '@/app/components/ui/Button';

interface RecentActivitiesProps {
    logs?: AuditLog[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    error?: string | null;
}

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} saniye önce`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} dakika önce`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} saat önce`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} gün önce`;
    }
};

// Helper function to get activity description
const getActivityDescription = (log: AuditLog): string => {
    console.log('=== RECENT ACTIVITIES - Processing log ===');
    console.log('Log data:', {
        id: log.id,
        entityType: log.entityType,
        action: log.action,
        newValue: log.newValue,
        metadata: log.metadata
    });

    // Ticket specific actions
    if (log.entityType === 'ticket' && log.action === 'update') {
        console.log('Processing ticket update');
        
        // Check metadata for specific actions
        if (log.metadata?.action) {
            console.log('Found metadata action:', log.metadata.action);
            const actionMap: Record<string, string> = {
                'resolve': 'Bakım talebi çözüldü',
                'start-progress': 'İşleme alındı',
                'mark-waiting': 'Beklemeye alındı',
                'close': 'Bakım talebi kapatıldı',
                'cancel': 'Bakım talebi iptal edildi'
            };

            const specificAction = actionMap[log.metadata.action];
            if (specificAction) {
                console.log('Returning specific action:', specificAction);
                return specificAction;
            }
        }

        // Check for status changes
        if (log.newValue?.status) {
            console.log('Found status in newValue:', log.newValue.status);
            const statusMap: Record<string, string> = {
                'OPEN': 'Açık',
                'IN_PROGRESS': 'İşlemde',
                'WAITING': 'Beklemede',
                'RESOLVED': 'Çözüldü',
                'CLOSED': 'Kapalı',
                'CANCELLED': 'İptal Edildi'
            };

            const status = statusMap[log.newValue.status] || log.newValue.status;
            console.log('Returning status update:', `Status '${status}' e güncellendi`);
            return `Status '${status}' e güncellendi`;
        }

        // Check for title changes
        if (log.newValue?.title) {
            console.log('Found title in newValue:', log.newValue.title);
            return `Title '${log.newValue.title}' e güncellendi`;
        }

        // Check for priority changes
        if (log.newValue?.priority) {
            console.log('Found priority in newValue:', log.newValue.priority);
            const priorityMap: Record<string, string> = {
                'LOW': 'Düşük',
                'MEDIUM': 'Orta',
                'HIGH': 'Yüksek',
                'URGENT': 'Acil'
            };
            const priority = priorityMap[log.newValue.priority] || log.newValue.priority;
            return `Priority '${priority}' e güncellendi`;
        }

        console.log('Falling back to generic ticket update');
        return 'Bakım talebi güncellendi';
    }

    // Ticket comments
    if (log.entityType === 'ticket_comment' && log.action === 'create') {
        console.log('Processing ticket comment');
        const commentText = log.newValue?.content || log.newValue?.text || log.newValue?.comment || 'Yorum eklendi';
        return `Yorum eklendi: "${commentText.length > 50 ? commentText.substring(0, 50) + '...' : commentText}"`;
    }

    // Generic fallback
    const actionMap: Record<string, string> = {
        'create': 'oluşturuldu',
        'update': 'güncellendi',
        'delete': 'silindi',
        'login': 'giriş yaptı',
        'logout': 'çıkış yaptı',
        'view': 'görüntülendi'
    };

    const entityMap: Record<string, string> = {
        'user': 'Kullanıcı',
        'property': 'Konut',
        'ticket': 'Bakım talebi',
        'payment': 'Ödeme',
        'announcement': 'Duyuru',
        'family-member': 'Aile üyesi',
        'staff': 'Personel'
    };

    const action = actionMap[log.action] || log.action;
    const entity = entityMap[log.entityType] || log.entityType;
    
    if (log.action === 'login' || log.action === 'logout') {
        return `${log.username} ${action}`;
    }
    
    console.log('Returning generic description:', `${entity} ${action}`);
    return `${entity} ${action}`;
};

// Helper function to get activity type color
const getActivityTypeColor = (log: AuditLog): string => {
    switch (log.action) {
        case 'create':
            return 'bg-green-500';
        case 'update':
            return 'bg-blue-500';
        case 'delete':
            return 'bg-red-500';
        case 'login':
            return 'bg-purple-500';
        case 'logout':
            return 'bg-gray-500';
        case 'view':
            return 'bg-yellow-500';
        default:
            return 'bg-blue-500';
    }
};

export default function RecentActivities({
    logs = [],
    title = "Son Aktiviteler",
    subtitle = "Sistem günlüğü",
    loading = false,
    error = null
}: RecentActivitiesProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination
    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLogs = logs.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <Card title={title} subtitle={subtitle} icon={Activity}>
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start space-x-3 animate-pulse">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-32 mb-1" />
                                <div className="h-3 bg-gray-300 rounded w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && logs.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Henüz aktivite bulunmuyor.</p>
                </div>
            )}

            {!loading && !error && logs.length > 0 && (
                <div className="space-y-3">
                    {currentLogs.map((log) => (
                        <div key={log.id} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActivityTypeColor(log)}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white truncate">
                                    {getActivityDescription(log)}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeAgo(log.createdAt)}
                                    </p>
                                    {log.username && (
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            • {log.username}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Sayfa {currentPage} / {totalPages} ({logs.length} toplam)
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="p-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
} 