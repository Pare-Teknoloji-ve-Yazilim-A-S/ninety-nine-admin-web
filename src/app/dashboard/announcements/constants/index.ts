// Announcements Constants
import { Users, AlertTriangle, Calendar, Settings, BookOpen, MessageSquare, Hash } from 'lucide-react';

export const VIEW_OPTIONS = [
    { id: 'table', label: 'Tablo', icon: Users },
    { id: 'grid', label: 'Kart', icon: Users }
];

export const BREADCRUMB_ITEMS = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Duyurular', href: '/dashboard/announcements' }
];

export const DEFAULT_VALUES = {
    recordsPerPage: 10,
    currentPage: 1,
    selectedView: 'table' as const,
    sortConfig: {
        key: 'createdAt' as const,
        direction: 'desc' as const
    }
} as const;

export const ANNOUNCEMENT_FILTER_GROUPS = [
    {
        id: 'status',
        label: 'Durum',
        type: 'multiselect' as const,
        icon: Settings,
        options: [
            { id: 'DRAFT', label: 'Taslak', value: 'DRAFT' },
            { id: 'PUBLISHED', label: 'Yayında', value: 'PUBLISHED' },
            { id: 'ARCHIVED', label: 'Arşiv', value: 'ARCHIVED' },
        ],
    },
    {
        id: 'type',
        label: 'Tip',
        type: 'multiselect' as const,
        icon: Hash,
        options: [
            { id: 'GENERAL', label: 'Genel', value: 'GENERAL' },
            { id: 'MAINTENANCE', label: 'Bakım', value: 'MAINTENANCE' },
            { id: 'EMERGENCY', label: 'Acil Durum', value: 'EMERGENCY' },
            { id: 'EVENT', label: 'Etkinlik', value: 'EVENT' },
            { id: 'RULE', label: 'Kural', value: 'RULE' },
            { id: 'MEETING', label: 'Toplantı', value: 'MEETING' },
            { id: 'OTHER', label: 'Diğer', value: 'OTHER' },
        ],
    },
    {
        id: 'emergency',
        label: 'Acil Durumlar',
        type: 'checkbox' as const,
        icon: AlertTriangle,
        options: [
            { id: 'emergency', label: 'Sadece Acil Duyurular', value: 'true' },
        ],
    },
    {
        id: 'pinned',
        label: 'Sabitlenmiş',
        type: 'checkbox' as const,
        icon: BookOpen,
        options: [
            { id: 'pinned', label: 'Sadece Sabitlenmiş', value: 'true' },
        ],
    },
];

export const ANNOUNCEMENT_BULK_ACTIONS = [
    { id: 'publish', label: 'Yayınla', icon: MessageSquare, variant: 'primary' as const },
    { id: 'archive', label: 'Arşivle', icon: BookOpen, variant: 'secondary' as const },
    { id: 'pin', label: 'Sabitle', icon: BookOpen, variant: 'secondary' as const },
    { id: 'unpin', label: 'Sabitlemeyi Kaldır', icon: BookOpen, variant: 'secondary' as const },
    { id: 'mark_emergency', label: 'Acil Olarak İşaretle', icon: AlertTriangle, variant: 'gold' as const },
    { id: 'unmark_emergency', label: 'Acil İşaretini Kaldır', icon: AlertTriangle, variant: 'secondary' as const },
    { id: 'delete', label: 'Sil', icon: Users, variant: 'danger' as const },
];

export const STATS_CONFIG = [
    {
        key: 'total',
        title: 'Toplam',
        color: 'primary' as const,
        icon: MessageSquare,
    },
    {
        key: 'published',
        title: 'Yayında',
        color: 'primary' as const,
        icon: MessageSquare,
    },
    {
        // draft card removed per request
        key: '__removed_draft__',
        title: '',
        color: 'secondary' as const,
        icon: MessageSquare,
    },
    {
        key: 'emergency',
        title: 'Acil',
        color: 'red' as const,
        icon: AlertTriangle,
    },
    {
        key: 'expiringSoon',
        title: 'Yakında Sona Erecek',
        color: 'gold' as const,
        icon: Calendar,
    },
];