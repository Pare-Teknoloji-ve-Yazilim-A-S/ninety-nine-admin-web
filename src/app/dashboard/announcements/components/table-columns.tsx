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
    return [
        {
            id: 'title',
            label: 'Başlık',
            key: 'title' as keyof Announcement,
            sortable: true,
            render: (announcement: Announcement) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span 
                            className="font-medium text-text-on-light dark:text-text-on-dark cursor-pointer hover:text-primary-gold"
                            onClick={() => actionHandlers.handleViewAnnouncement(announcement)}
                        >
                            {announcement.title}
                        </span>
                        {announcement.isPinned && (
                            <Pin className="w-4 h-4 text-primary-gold" />
                        )}
                        {announcement.isEmergency && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                    <span className="text-sm text-text-light-secondary dark:text-text-secondary line-clamp-2">
                        {announcement.content.substring(0, 100)}
                        {announcement.content.length > 100 && '...'}
                    </span>
                </div>
            ),
        },
        {
            id: 'type',
            label: 'Tip',
            key: 'type' as keyof Announcement,
            sortable: true,
            render: (announcement: Announcement) => (
                <Badge
                    variant="soft"
                    color={getAnnouncementTypeColor(announcement.type) as any}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                >
                    {getAnnouncementTypeLabel(announcement.type)}
                </Badge>
            ),
        },
        {
            id: 'status',
            label: 'Durum',
            key: 'status' as keyof Announcement,
            sortable: true,
            render: (announcement: Announcement) => {
                const isExpired = isAnnouncementExpired(announcement);
                const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
                
                let statusColor = getAnnouncementStatusColor(announcement.status);
                let statusLabel = getAnnouncementStatusLabel(announcement.status);
                
                if (isExpired) {
                    statusColor = 'red';
                    statusLabel += ' (Süresi Dolmuş)';
                } else if (isExpiringSoon) {
                    statusColor = 'gold';
                    statusLabel += ' (Yakında)';
                }
                
                return (
                    <Badge
                        variant="soft"
                        color={statusColor as any}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                        {statusLabel}
                    </Badge>
                );
            },
        },
        {
            id: 'createdBy',
            label: 'Oluşturan',
            key: 'createdBy' as keyof Announcement,
            sortable: false,
            render: (announcement: Announcement) => (
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
            label: 'Yayın Tarihi',
            key: 'publishDate' as keyof Announcement,
            sortable: true,
            render: (announcement: Announcement) => (
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
            label: 'Bitiş Tarihi',
            key: 'expiryDate' as keyof Announcement,
            sortable: true,
            render: (announcement: Announcement) => {
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
            label: 'Hedef Özellikler',
            key: 'properties' as keyof Announcement,
            sortable: false,
            render: (announcement: Announcement) => (
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
            label: 'Oluşturma Tarihi',
            key: 'createdAt' as keyof Announcement,
            sortable: true,
            render: (announcement: Announcement) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
                    <span className="text-sm">
                        {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                </div>
            ),
        },
        ...(ActionMenuComponent ? [{
            id: 'actions',
            label: '',
            key: 'actions' as keyof Announcement,
            sortable: false,
            render: (announcement: Announcement) => <ActionMenuComponent row={announcement} />,
        }] : []),
    ];
}