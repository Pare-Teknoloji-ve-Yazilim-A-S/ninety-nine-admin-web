// Announcements Constants
import { Users, AlertTriangle, Calendar, Settings, BookOpen, MessageSquare, Hash, LayoutGrid, Table } from 'lucide-react';

// i18n support for view options
export const getViewOptions = (language: string = 'tr') => {
  const translations = {
    tr: {
      table: 'Tablo',
      grid: 'Kart'
    },
    en: {
      table: 'Table',
      grid: 'Grid'
    },
    ar: {
      table: 'جدول',
      grid: 'شبكة'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  return [
    { id: 'table', label: t.table, icon: Table },
    { id: 'grid', label: t.grid, icon: LayoutGrid }
  ];
};

// i18n support for breadcrumb items
export const getBreadcrumbItems = (language: string = 'tr') => {
  const translations = {
    tr: {
      dashboard: 'Dashboard',
      announcements: 'Duyurular'
    },
    en: {
      dashboard: 'Dashboard',
      announcements: 'Announcements'
    },
    ar: {
      dashboard: 'لوحة التحكم',
      announcements: 'الإعلانات'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  return [
    { label: t.dashboard, href: '/dashboard' },
    { label: t.announcements, href: '/dashboard/announcements' }
  ];
};

export const DEFAULT_VALUES = {
    recordsPerPage: 10,
    currentPage: 1,
    selectedView: 'table' as const,
    sortConfig: {
        key: 'createdAt' as const,
        direction: 'desc' as const
    }
} as const;

// i18n support for filter groups
export const getAnnouncementFilterGroups = (language: string = 'tr') => {
  const translations = {
    tr: {
      status: 'Durum',
      type: 'Tip',
      emergency: 'Acil Durumlar',
      pinned: 'Sabitlenmiş',
      draft: 'Taslak',
      published: 'Yayında',
      archived: 'Arşiv',
      general: 'Genel',
      maintenance: 'Bakım',
      emergencyType: 'Acil Durum',
      event: 'Etkinlik',
      rule: 'Kural',
      meeting: 'Toplantı',
      other: 'Diğer',
      onlyEmergency: 'Sadece Acil Duyurular',
      onlyPinned: 'Sadece Sabitlenmiş'
    },
    en: {
      status: 'Status',
      type: 'Type',
      emergency: 'Emergency',
      pinned: 'Pinned',
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
      general: 'General',
      maintenance: 'Maintenance',
      emergencyType: 'Emergency',
      event: 'Event',
      rule: 'Rule',
      meeting: 'Meeting',
      other: 'Other',
      onlyEmergency: 'Only Emergency',
      onlyPinned: 'Only Pinned'
    },
    ar: {
      status: 'الحالة',
      type: 'النوع',
      emergency: 'الطوارئ',
      pinned: 'مثبت',
      draft: 'مسودة',
      published: 'منشور',
      archived: 'مؤرشف',
      general: 'عام',
      maintenance: 'صيانة',
      emergencyType: 'طوارئ',
      event: 'حدث',
      rule: 'قاعدة',
      meeting: 'اجتماع',
      other: 'آخر',
      onlyEmergency: 'الطوارئ فقط',
      onlyPinned: 'المثبت فقط'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  return [
    {
        id: 'status',
        label: t.status,
        type: 'multiselect' as const,
        icon: Settings,
        options: [
            { id: 'DRAFT', label: t.draft, value: 'DRAFT' },
            { id: 'PUBLISHED', label: t.published, value: 'PUBLISHED' },
            { id: 'ARCHIVED', label: t.archived, value: 'ARCHIVED' },
        ],
    },
    {
        id: 'type',
        label: t.type,
        type: 'multiselect' as const,
        icon: Hash,
        options: [
            { id: 'GENERAL', label: t.general, value: 'GENERAL' },
            { id: 'MAINTENANCE', label: t.maintenance, value: 'MAINTENANCE' },
            { id: 'EMERGENCY', label: t.emergencyType, value: 'EMERGENCY' },
            { id: 'EVENT', label: t.event, value: 'EVENT' },
            { id: 'RULE', label: t.rule, value: 'RULE' },
            { id: 'MEETING', label: t.meeting, value: 'MEETING' },
            { id: 'OTHER', label: t.other, value: 'OTHER' },
        ],
    },
    {
        id: 'emergency',
        label: t.emergency,
        type: 'checkbox' as const,
        icon: AlertTriangle,
        options: [
            { id: 'emergency', label: t.onlyEmergency, value: 'true' },
        ],
    },
    {
        id: 'pinned',
        label: t.pinned,
        type: 'checkbox' as const,
        icon: BookOpen,
        options: [
            { id: 'pinned', label: t.onlyPinned, value: 'true' },
        ],
    },
  ];
};

// i18n support for bulk actions
export const getAnnouncementBulkActions = (language: string = 'tr') => {
  const translations = {
    tr: {
      publish: 'Yayınla',
      archive: 'Arşivle',
      pin: 'Sabitle',
      unpin: 'Sabitlemeyi Kaldır',
      markEmergency: 'Acil Olarak İşaretle',
      unmarkEmergency: 'Acil İşaretini Kaldır',
      delete: 'Sil'
    },
    en: {
      publish: 'Publish',
      archive: 'Archive',
      pin: 'Pin',
      unpin: 'Unpin',
      markEmergency: 'Mark as Emergency',
      unmarkEmergency: 'Unmark Emergency',
      delete: 'Delete'
    },
    ar: {
      publish: 'نشر',
      archive: 'أرشفة',
      pin: 'تثبيت',
      unpin: 'إلغاء التثبيت',
      markEmergency: 'تحديد كطوارئ',
      unmarkEmergency: 'إلغاء تحديد الطوارئ',
      delete: 'حذف'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  return [
    { id: 'publish', label: t.publish, icon: MessageSquare, variant: 'primary' as const },
    { id: 'archive', label: t.archive, icon: BookOpen, variant: 'secondary' as const },
    { id: 'pin', label: t.pin, icon: BookOpen, variant: 'secondary' as const },
    { id: 'unpin', label: t.unpin, icon: BookOpen, variant: 'secondary' as const },
    { id: 'mark_emergency', label: t.markEmergency, icon: AlertTriangle, variant: 'gold' as const },
    { id: 'unmark_emergency', label: t.unmarkEmergency, icon: AlertTriangle, variant: 'secondary' as const },
    { id: 'delete', label: t.delete, icon: Users, variant: 'danger' as const },
  ];
};

// i18n support for stats config
export const getStatsConfig = (language: string = 'tr') => {
  const translations = {
    tr: {
      total: 'Toplam',
      published: 'Yayında',
      emergency: 'Acil',
      expiringSoon: 'Yakında Sona Erecek'
    },
    en: {
      total: 'Total',
      published: 'Published',
      emergency: 'Emergency',
      expiringSoon: 'Expiring Soon'
    },
    ar: {
      total: 'إجمالي',
      published: 'منشور',
      emergency: 'طوارئ',
      expiringSoon: 'ينتهي قريباً'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  return [
    {
        key: 'total',
        title: t.total,
        color: 'primary' as const,
        icon: MessageSquare,
    },
    {
        key: 'published',
        title: t.published,
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
        title: t.emergency,
        color: 'red' as const,
        icon: AlertTriangle,
    },
    {
        key: 'expiringSoon',
        title: t.expiringSoon,
        color: 'gold' as const,
        icon: Calendar,
    },
  ];
};

// Legacy exports for backward compatibility
export const VIEW_OPTIONS = getViewOptions();
export const BREADCRUMB_ITEMS = getBreadcrumbItems();
export const ANNOUNCEMENT_FILTER_GROUPS = getAnnouncementFilterGroups();
export const ANNOUNCEMENT_BULK_ACTIONS = getAnnouncementBulkActions();
export const STATS_CONFIG = getStatsConfig();