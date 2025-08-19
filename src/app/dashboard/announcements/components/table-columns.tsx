// Table Columns Configuration for Announcements
import React, { useState, useEffect } from 'react';
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

// Dil çevirileri
const translations = {
  tr: {
    // Table headers
    title: 'Başlık',
    type: 'Tip',
    status: 'Durum',
    createdBy: 'Oluşturan',
    publishDate: 'Yayın Tarihi',
    expiryDate: 'Bitiş Tarihi',
    properties: 'Hedef Özellikler',
    createdAt: 'Oluşturma Tarihi',
    
    // Status labels
    expired: 'Süresi Dolmuş',
    daysLeft: 'gün kaldı',
    daysPassed: 'gün geçti',
    
    // Property labels
    propertyLabel: 'özellik',
    allProperties: 'Tüm özellikler',
    
    // User labels
    unknown: 'Bilinmiyor'
  },
  en: {
    // Table headers
    title: 'Title',
    type: 'Type',
    status: 'Status',
    createdBy: 'Created By',
    publishDate: 'Publish Date',
    expiryDate: 'Expiry Date',
    properties: 'Target Properties',
    createdAt: 'Created At',
    
    // Status labels
    expired: 'Expired',
    daysLeft: 'days left',
    daysPassed: 'days passed',
    
    // Property labels
    propertyLabel: 'property',
    allProperties: 'All Properties',
    
    // User labels
    unknown: 'Unknown'
  },
  ar: {
    // Table headers
    title: 'العنوان',
    type: 'النوع',
    status: 'الحالة',
    createdBy: 'أنشأ بواسطة',
    publishDate: 'تاريخ النشر',
    expiryDate: 'تاريخ الانتهاء',
    properties: 'الخصائص المستهدفة',
    createdAt: 'تاريخ الإنشاء',
    
    // Status labels
    expired: 'منتهي الصلاحية',
    daysLeft: 'أيام متبقية',
    daysPassed: 'أيام مرت',
    
    // Property labels
    propertyLabel: 'خاصية',
    allProperties: 'جميع الخصائص',
    
    // User labels
    unknown: 'غير معروف'
  }
};

interface TableActionHandlers {
    handleViewAnnouncement: (announcement: Announcement) => void;
}

export function getTableColumns(
    actionHandlers: TableActionHandlers,
    ActionMenuComponent?: React.ComponentType<{ row: Announcement }>
) {
    // Dil tercihini localStorage'dan al
    const currentLanguage = typeof window !== 'undefined' ? localStorage.getItem('preferredLanguage') || 'tr' : 'tr';
    const t = translations[currentLanguage as keyof typeof translations];

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
            header: t.title,
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
            header: t.type,
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
            header: t.status,
            accessor: 'status',
            sortable: true,
            render: (_value: any, announcement: Announcement) => {
                const isExpired = isAnnouncementExpired(announcement);
                const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
                
                let statusColor = getAnnouncementStatusColor(announcement.status);
                let statusLabel = getAnnouncementStatusLabel(announcement.status);
                
                if (isExpired) {
                    statusColor = 'red';
                    statusLabel += ` (${t.expired})`;
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
            header: t.createdBy,
            accessor: 'createdBy',
            sortable: false,
            render: (_value: any, announcement: Announcement) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
                    <span className="text-sm">
                        {announcement.createdBy 
                            ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`
                            : t.unknown
                        }
                    </span>
                </div>
            ),
        },
        {
            id: 'publishDate',
            header: t.publishDate,
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
            header: t.expiryDate,
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
                                    ? `${Math.abs(daysUntilExpiry)} ${t.daysPassed}`
                                    : `${daysUntilExpiry} ${t.daysLeft}`
                                }
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'properties',
            header: t.properties,
            accessor: 'properties',
            sortable: false,
            render: (_value: any, announcement: Announcement) => (
                <span className="text-sm">
                    {announcement.properties && announcement.properties.length > 0
                        ? `${announcement.properties.length} ${t.propertyLabel}`
                        : t.allProperties
                    }
                </span>
            ),
        },
        {
            id: 'createdAt',
            header: t.createdAt,
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