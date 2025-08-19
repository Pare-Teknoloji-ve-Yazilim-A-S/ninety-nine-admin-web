'use client';

import React, { useState, useEffect } from 'react';
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

// Dil çevirileri
const translations = {
    tr: {
        title: 'Son Aktiviteler',
        subtitle: 'Sistem günlüğü',
        justNow: 'Az önce',
        secondsAgo: 'saniye önce',
        minutesAgo: 'dakika önce',
        hoursAgo: 'saat önce',
        daysAgo: 'gün önce',
        ticketResolved: 'Bakım talebi çözüldü',
        inProgress: 'İşleme alındı',
        markedWaiting: 'Beklemeye alındı',
        ticketClosed: 'Bakım talebi kapatıldı',
        ticketCancelled: 'Bakım talebi iptal edildi',
        statusUpdated: 'Status \'{status}\' e güncellendi',
        titleUpdated: 'Title \'{title}\' e güncellendi',
        priorityUpdated: 'Priority \'{priority}\' e güncellendi',
        open: 'Açık',
        inProgressStatus: 'İşlemde',
        waiting: 'Beklemede',
        resolved: 'Çözüldü',
        closed: 'Kapalı',
        cancelled: 'İptal Edildi',
        page: 'Sayfa',
        total: 'toplam',
        noActivities: 'Henüz aktivite bulunmuyor.',
        commentAdded: 'Bakım talebine yorum eklendi',
        activityRecorded: 'Aktivite kaydedildi',
        maintenanceUpdated: 'Bakım talebi güncellendi'
    },
    en: {
        title: 'Recent Activities',
        subtitle: 'System log',
        justNow: 'Just now',
        secondsAgo: 'seconds ago',
        minutesAgo: 'minutes ago',
        hoursAgo: 'hours ago',
        daysAgo: 'days ago',
        ticketResolved: 'Maintenance request resolved',
        inProgress: 'Started processing',
        markedWaiting: 'Marked as waiting',
        ticketClosed: 'Maintenance request closed',
        ticketCancelled: 'Maintenance request cancelled',
        statusUpdated: 'Status updated to \'{status}\'',
        titleUpdated: 'Title updated to \'{title}\'',
        priorityUpdated: 'Priority updated to \'{priority}\'',
        open: 'Open',
        inProgressStatus: 'In Progress',
        waiting: 'Waiting',
        resolved: 'Resolved',
        closed: 'Closed',
        cancelled: 'Cancelled',
        page: 'Page',
        total: 'total',
        noActivities: 'No activities found yet.',
        commentAdded: 'Comment added to maintenance request',
        activityRecorded: 'Activity recorded',
        maintenanceUpdated: 'Maintenance request updated'
    },
    ar: {
        title: 'الأنشطة الأخيرة',
        subtitle: 'سجل النظام',
        justNow: 'الآن',
        secondsAgo: 'ثانية مضت',
        minutesAgo: 'دقيقة مضت',
        hoursAgo: 'ساعة مضت',
        daysAgo: 'يوم مضى',
        ticketResolved: 'تم حل طلب الصيانة',
        inProgress: 'بدأ المعالجة',
        markedWaiting: 'تم تحديده كقيد الانتظار',
        ticketClosed: 'تم إغلاق طلب الصيانة',
        ticketCancelled: 'تم إلغاء طلب الصيانة',
        statusUpdated: 'تم تحديث الحالة إلى \'{status}\'',
        titleUpdated: 'تم تحديث العنوان إلى \'{title}\'',
        priorityUpdated: 'تم تحديث الأولوية إلى \'{priority}\'',
        open: 'مفتوح',
        inProgressStatus: 'قيد التنفيذ',
        waiting: 'في الانتظار',
        resolved: 'تم الحل',
        closed: 'مغلق',
        cancelled: 'ملغي',
        page: 'صفحة',
        total: 'إجمالي',
        noActivities: 'لم يتم العثور على أنشطة بعد.',
        commentAdded: 'تم إضافة تعليق إلى طلب الصيانة',
        activityRecorded: 'تم تسجيل النشاط',
        maintenanceUpdated: 'تم تحديث طلب الصيانة'
    }
};

export default function RecentActivities({
    logs = [],
    title,
    subtitle,
    loading = false,
    error = null
}: RecentActivitiesProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLanguage, setCurrentLanguage] = useState('tr');
    const itemsPerPage = 5;

    // Dil tercihini localStorage'dan al
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];

    // Helper function to format time ago
    const formatTimeAgo = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        // Handle negative values (future dates or invalid dates)
        if (diffInSeconds < 0) {
            return t.justNow;
        }

        if (diffInSeconds < 60) {
            return diffInSeconds <= 0 ? t.justNow : `${diffInSeconds} ${t.secondsAgo}`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${t.minutesAgo}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${t.hoursAgo}`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ${t.daysAgo}`;
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
                    'resolve': t.ticketResolved,
                    'start-progress': t.inProgress,
                    'mark-waiting': t.markedWaiting,
                    'close': t.ticketClosed,
                    'cancel': t.ticketCancelled
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
                    'OPEN': t.open,
                    'IN_PROGRESS': t.inProgressStatus,
                    'WAITING': t.waiting,
                    'RESOLVED': t.resolved,
                    'CLOSED': t.closed,
                    'CANCELLED': t.cancelled
                };

                const status = statusMap[log.newValue.status] || log.newValue.status;
                console.log('Returning status update:', t.statusUpdated.replace('{status}', status));
                return t.statusUpdated.replace('{status}', status);
            }

            // Check for title changes
            if (log.newValue?.title) {
                console.log('Found title in newValue:', log.newValue.title);
                return t.titleUpdated.replace('{title}', log.newValue.title);
            }

            // Check for priority changes
            if (log.newValue?.priority) {
                console.log('Found priority in newValue:', log.newValue.priority);
                const priorityMap: Record<string, string> = {
                    'LOW': currentLanguage === 'tr' ? 'Düşük' : 'Low',
                    'MEDIUM': currentLanguage === 'tr' ? 'Orta' : 'Medium',
                    'HIGH': currentLanguage === 'tr' ? 'Yüksek' : 'High',
                    'URGENT': currentLanguage === 'tr' ? 'Acil' : 'Urgent'
                };
                const priority = priorityMap[log.newValue.priority] || log.newValue.priority;
                return t.priorityUpdated.replace('{priority}', priority);
            }

            console.log('Falling back to generic ticket update');
            return t.maintenanceUpdated;
        }

        // Ticket comments
        if (log.entityType === 'ticket_comment' && log.action === 'create') {
            console.log('Processing ticket comment');
            return t.commentAdded;
        }

        // Generic fallback
        return t.activityRecorded;
    };

    // Helper function to get activity type color
    const getActivityTypeColor = (log: AuditLog): string => {
        if (log.entityType === 'ticket') {
            return 'bg-blue-500';
        } else if (log.entityType === 'ticket_comment') {
            return 'bg-green-500';
        } else {
            return 'bg-gray-500';
        }
    };

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
        <Card title={title || t.title} subtitle={subtitle || t.subtitle} icon={Activity}>
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
                    <p className="text-sm">{t.noActivities}</p>
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
                                {t.page} {currentPage} / {totalPages} ({logs.length} {t.total})
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