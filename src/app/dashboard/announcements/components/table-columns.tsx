// Table Columns Configuration for Announcements
import React from 'react';
import Badge from '@/app/components/ui/Badge';
import { 
    getAnnouncementTypeLabel,
    getAnnouncementStatusLabel,
    getAnnouncementTypeColor,
    getAnnouncementStatusColor,
    isAnnouncementExpired,
    isAnnouncementExpiringSoon,
    getDaysUntilExpiry
} from '@/services/types/announcement.types';
import type { Announcement } from '@/services/types/announcement.types';
import { Calendar, AlertTriangle, Pin, User } from 'lucide-react';

interface TableActionHandlers {
    handleViewAnnouncement: (announcement: Announcement) => void;
}

export function getTableColumns(
    actionHandlers: TableActionHandlers,
    ActionMenuComponent?: React.ComponentType<{ row: Announcement }>
) {
    const colorToTextClass = (color: string): string => {
        switch (color) {
            case 'gold':
                return 'text-primary-gold';
            case 'red':
                return 'text-primary-red';
            case 'primary':
                return 'text-text-accent';
            case 'secondary':
                return 'text-text-light-secondary dark:text-text-secondary';
            case 'accent':
                return 'text-text-accent';
            default:
                return 'text-text-on-light dark:text-text-on-dark';
        }
    };
    return [
        {
            id: 'title',
            header: 'Başlık',
            accessor: 'title',
            sortable: true,
            render: (_value: any, announcement: Announcement) => {
                if (!announcement) return null;
                const safeTitle = typeof announcement.title === 'string' ? announcement.title : '';

                return (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span 
                            className="font-medium text-text-on-light dark:text-text-on-dark cursor-pointer hover:text-primary-gold"
                            onClick={() => actionHandlers.handleViewAnnouncement(announcement)}
                        >
                            {safeTitle}
                        </span>
                        {announcement.isPinned && (
                            <Pin className="w-4 h-4 text-primary-gold" />
                        )}
                        {announcement.isEmergency && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                </div>
                );
            },
        },
        {
            id: 'type',
            header: 'Tip',
            accessor: 'type',
            sortable: true,
            render: (_value: any, announcement: Announcement) => {
                const color = getAnnouncementTypeColor(announcement?.type as any) as string;
                const cls = colorToTextClass(color);
                return (
                    <span className={`text-sm font-medium ${cls}`}>
                        {announcement?.type ? getAnnouncementTypeLabel(announcement.type) : '-'}
                    </span>
                );
            },
        },
        {
            id: 'status',
            header: 'Durum',
            accessor: 'status',
            sortable: true,
            render: (_value: any, announcement: Announcement) => {
                const isExpired = isAnnouncementExpired(announcement);
                const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
                
                let statusColor = getAnnouncementStatusColor(announcement.status);
                let statusLabel = getAnnouncementStatusLabel(announcement.status);
                
                if (isExpired) {
                    statusColor = 'red';
                    statusLabel += ' (Süresi Dolmuş)';
                } else if (isExpiringSoon) {
                    // Only adjust color for expiring soon; do not append text
                    statusColor = 'gold';
                }
                const cls = colorToTextClass(statusColor);
                return <span className={`text-sm font-medium ${cls}`}>{statusLabel}</span>;
            },
        },
        {
            id: 'createdBy',
            header: 'Oluşturan',
            accessor: 'createdBy',
            sortable: false,
            render: (_value: any, announcement: Announcement) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
                    <span className="text-sm">
                        {announcement.createdBy 
                            ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`
                            : 'Bilinmiyor'
                        }
                    </span>
                </div>
            ),
        },
        {
            id: 'publishDate',
            header: 'Yayın Tarihi',
            accessor: 'publishDate',
            sortable: true,
            render: (_value: any, announcement: Announcement) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
                    <span className="text-sm">
                        {announcement.publishDate 
                            ? new Date(announcement.publishDate).toLocaleDateString('tr-TR')
                            : '-'
                        }
                    </span>
                </div>
            ),
        },
        {
            id: 'expiryDate',
            header: 'Bitiş Tarihi',
            accessor: 'expiryDate',
            sortable: true,
            render: (_value: any, announcement: Announcement) => {
                if (!announcement.expiryDate) {
                    return <span className="text-sm text-text-light-secondary dark:text-text-secondary">-</span>;
                }
                
                const daysUntilExpiry = getDaysUntilExpiry(announcement);
                const isExpired = isAnnouncementExpired(announcement);
                const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
                
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
                            <span className="text-sm">
                                {new Date(announcement.expiryDate).toLocaleDateString('tr-TR')}
                            </span>
                        </div>
                        {daysUntilExpiry !== undefined && (
                            <span className={`text-xs ${
                                isExpired ? 'text-red-500' : 
                                isExpiringSoon ? 'text-yellow-500' : 
                                'text-text-light-secondary dark:text-text-secondary'
                            }`}>
                                {isExpired 
                                    ? `${Math.abs(daysUntilExpiry)} gün geçti`
                                    : `${daysUntilExpiry} gün kaldı`
                                }
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'properties',
            header: 'Hedef Özellikler',
            accessor: 'properties',
            sortable: false,
            render: (_value: any, announcement: Announcement) => (
                <span className="text-sm">
                    {announcement.properties && announcement.properties.length > 0
                        ? `${announcement.properties.length} özellik`
                        : 'Tüm özellikler'
                    }
                </span>
            ),
        },
        {
            id: 'createdAt',
            header: 'Oluşturma Tarihi',
            accessor: 'createdAt',
            sortable: true,
            render: (_value: any, announcement: Announcement) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
                    <span className="text-sm">
                        {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                </div>
            ),
        },
    ];
}