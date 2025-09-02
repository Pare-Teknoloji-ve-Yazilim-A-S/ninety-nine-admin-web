import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '@/services/types/request-list.types';
import Badge from '@/app/components/ui/Badge';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { 
    Eye, 
    MoreVertical,
    AlertCircle,
    Clock,
    CheckCircle,
    Wrench,
    MapPin,
    User,
    Phone,
    Calendar
} from 'lucide-react';

// Ticket action menu için permission
const TICKET_ACTION_MENU_PERMISSION_ID = '0b1f9132-b494-4780-8644-ead57df5d523';

// Dil çevirileri
const translations = {
  tr: {
    // Table headers
    title: 'Başlık',
    apartment: 'Daire',
    category: 'Kategori',
    priority: 'Öncelik',
    status: 'Durum',
    technician: 'Teknisyen',
    createdDate: 'Oluşturulma',
    dueDate: 'Vade',
    
    // Badges and labels
    urgentLabel: 'Acil',
    block: 'Blok',
    unassigned: 'Atanmamış',
    overdue: 'Gecikmiş',
    
    // Action menu
    detail: 'Detay',
    
    // Backend status translations
    resolved: 'Çözüldü',
    closed: 'Kapalı',
    cancelled: 'İptal Edildi',
    open: 'Açık',
    inProgress: 'İşlemde',
    waiting: 'Bekliyor',
    completed: 'Tamamlandı',
    
    // Backend category translations
    request: 'İstek',
    complaint: 'Şikayet',
    faultRepair: 'Arıza/Tamir',
    maintenance: 'Bakım',
    cleaning: 'Temizlik',
    security: 'Güvenlik',
    other: 'Diğer',
    
    // Backend priority translations
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    urgent: 'Acil',
    emergency: 'Acil'
  },
  en: {
    // Table headers
    title: 'Title',
    apartment: 'Apartment',
    category: 'Category',
    priority: 'Priority',
    status: 'Status',
    technician: 'Technician',
    createdDate: 'Created',
    dueDate: 'Due Date',
    
    // Badges and labels
    urgentLabel: 'Urgent',
    block: 'Block',
    unassigned: 'Unassigned',
    overdue: 'Overdue',
    
    // Action menu
    detail: 'Detail',
    
    // Backend status translations
    resolved: 'Resolved',
    closed: 'Closed',
    cancelled: 'Cancelled',
    open: 'Open',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    completed: 'Completed',
    
    // Backend category translations
    request: 'Request',
    complaint: 'Complaint',
    faultRepair: 'Fault/Repair',
    maintenance: 'Maintenance',
    cleaning: 'Cleaning',
    security: 'Security',
    other: 'Other',
    
    // Backend priority translations
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    emergency: 'Emergency'
  },
  ar: {
    // Table headers
    title: 'العنوان',
    apartment: 'الشقة',
    category: 'الفئة',
    priority: 'الأولوية',
    status: 'الحالة',
    technician: 'الفني',
    createdDate: 'تاريخ الإنشاء',
    dueDate: 'تاريخ الاستحقاق',
    
    // Badges and labels
    urgentLabel: 'عاجل',
    block: 'البلوك',
    unassigned: 'غير محدد',
    overdue: 'متأخر',
    
    // Action menu
    detail: 'التفاصيل',
    
    // Backend status translations
    resolved: 'تم الحل',
    closed: 'مغلق',
    cancelled: 'ملغي',
    open: 'مفتوح',
    inProgress: 'قيد التنفيذ',
    waiting: 'في الانتظار',
    completed: 'مكتمل',
    
    // Backend category translations
    request: 'طلب',
    complaint: 'شكوى',
    faultRepair: 'عطل/إصلاح',
    maintenance: 'صيانة',
    cleaning: 'تنظيف',
    security: 'أمان',
    other: 'أخرى',
    
    // Backend priority translations
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    urgent: 'عاجل',
    emergency: 'طارئ'
  }
};

/**
 * Action menu component for table rows
 */
interface ActionMenuProps {
    request: ServiceRequest;
    onViewRequest: (request: ServiceRequest) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    request,
    onViewRequest,
}) => {
    // Dil tercihini localStorage'dan al
    const [currentLanguage, setCurrentLanguage] = useState('tr');
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Permission kontrolü
    const { hasPermission } = usePermissionCheck();
    const hasTicketActionMenuPermission = hasPermission(TICKET_ACTION_MENU_PERMISSION_ID);

    // Debug log
    console.log('Ticket Action Menu - TICKET_ACTION_MENU_PERMISSION_ID:', TICKET_ACTION_MENU_PERMISSION_ID);
    console.log('Ticket Action Menu - hasTicketActionMenuPermission:', hasTicketActionMenuPermission);

    // Permission yoksa hiçbir şey gösterme
    if (!hasTicketActionMenuPermission) {
        return null;
    }

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewRequest(request);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors">
                    <MoreVertical size={16} className="text-text-light-secondary dark:text-text-secondary" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-background-card border border-background-light-secondary dark:border-background-secondary rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                        onClick={handleView}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-background-light-soft dark:hover:bg-background-soft flex items-center gap-3 text-text-on-light dark:text-text-on-dark"
                    >
                        <Eye size={16} />
                        {t.detail}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Helper function to translate backend status values
 */
const getTranslatedStatus = (status: any, t: any) => {
    if (!status || !status.label) return '';
    
    const statusLabel = status.label.toLowerCase();
    
    // Handle both enum values and direct Turkish strings
    if (statusLabel === 'resolved' || statusLabel === 'çözüldü') {
        return t.resolved;
    } else if (statusLabel === 'closed' || statusLabel === 'kapalı') {
        return t.closed;
    } else if (statusLabel === 'cancelled' || statusLabel === 'iptal edildi') {
        return t.cancelled;
    } else if (statusLabel === 'open' || statusLabel === 'açık') {
        return t.open;
    } else if (statusLabel === 'in_progress' || statusLabel === 'işlemde') {
        return t.inProgress;
    } else if (statusLabel === 'waiting' || statusLabel === 'bekliyor') {
        return t.waiting;
    } else if (statusLabel === 'completed' || statusLabel === 'tamamlandı') {
        return t.completed;
    }
    
    return status.label; // Return original if no match
};

/**
 * Helper function to translate backend category values
 */
const getTranslatedCategory = (category: any, t: any) => {
    if (!category || !category.label) return '';
    
    const categoryLabel = category.label.toLowerCase();
    
    // Handle both enum values and direct Turkish strings
    if (categoryLabel === 'request' || categoryLabel === 'istek') {
        return t.request;
    } else if (categoryLabel === 'complaint' || categoryLabel === 'şikayet') {
        return t.complaint;
    } else if (categoryLabel === 'fault_repair' || categoryLabel === 'arıza/tamir') {
        return t.faultRepair;
    } else if (categoryLabel === 'maintenance' || categoryLabel === 'bakım') {
        return t.maintenance;
    } else if (categoryLabel === 'cleaning' || categoryLabel === 'temizlik') {
        return t.cleaning;
    } else if (categoryLabel === 'security' || categoryLabel === 'güvenlik') {
        return t.security;
    } else if (categoryLabel === 'other' || categoryLabel === 'diğer') {
        return t.other;
    }
    
    return category.label; // Return original if no match
};

/**
 * Helper function to translate backend priority values
 */
const getTranslatedPriority = (priority: any, t: any) => {
    if (!priority || !priority.label) return '';
    
    const priorityLabel = priority.label.toLowerCase();
    
    // Handle both enum values and direct Turkish strings
    if (priorityLabel === 'low' || priorityLabel === 'düşük') {
        return t.low;
    } else if (priorityLabel === 'medium' || priorityLabel === 'orta') {
        return t.medium;
    } else if (priorityLabel === 'high' || priorityLabel === 'yüksek') {
        return t.high;
    } else if (priorityLabel === 'urgent' || priorityLabel === 'acil') {
        return t.urgent;
    } else if (priorityLabel === 'emergency' || priorityLabel === 'acil') {
        return t.emergency;
    }
    
    return priority.label; // Return original if no match
};

/**
 * Get status icon based on status
 */
const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'open':
        case 'new':
            return AlertCircle;
        case 'in_progress':
        case 'assigned':
            return Clock;
        case 'completed':
        case 'resolved':
            return CheckCircle;
        default:
            return AlertCircle;
    }
};

/**
 * Format date for display
 */
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Get table columns configuration
 */
export const getTableColumns = (
    actionHandlers: {
        handleViewRequest: (request: ServiceRequest) => void;
    },
    ActionMenuComponent?: React.ComponentType<{ row: ServiceRequest }>
) => {
    // Dil tercihini localStorage'dan al
    const currentLanguage = typeof window !== 'undefined' ? localStorage.getItem('preferredLanguage') || 'tr' : 'tr';
    
    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations] || translations.tr;

    const columns = [
        {
            id: 'title',
            header: t.title,
            accessor: 'title',
            sortable: true,
            render: (value: string, row: ServiceRequest) => (
                <div className="max-w-xs">
                    <p className="font-medium text-text-on-light dark:text-text-on-dark truncate">
                        {value}
                    </p>
                    {row.isUrgent && (
                        <Badge variant="solid" color="red" className="text-xs mt-1">
                            {t.urgentLabel}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'apartment',
            header: t.apartment,
            accessor: 'apartment',
            render: (value: any, row: ServiceRequest) => (
                <div className="text-sm">
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                        {row.apartment.number}
                    </p>
                    <p className="text-text-light-muted dark:text-text-muted">
                        {row.apartment.block} {t.block}
                    </p>
                </div>
            ),
        },
        {
            id: 'category',
            header: t.category,
            accessor: 'category',
            render: (value: any, row: ServiceRequest) => (
                <Badge
                    variant="soft"
                    color="secondary"
                    className="text-xs"
                >
                    <span className="mr-1">{row.category.icon}</span>
                    {getTranslatedCategory(row.category, t)}
                </Badge>
            ),
        },
        {
            id: 'priority',
            header: t.priority,
            accessor: 'priority',
            sortable: true,
            render: (value: any, row: ServiceRequest) => (
                <Badge
                    variant="soft"
                    color={
                        row.priority.level === 4 ? 'red' :
                        row.priority.level === 3 ? 'gold' :
                        row.priority.level === 2 ? 'secondary' : 'primary'
                    }
                    className="text-xs"
                >
                    <span className="mr-1">{row.priority.icon}</span>
                    {getTranslatedPriority(row.priority, t)}
                </Badge>
            ),
        },
        {
            id: 'status',
            header: t.status,
            accessor: 'status',
            sortable: true,
            render: (value: any, row: ServiceRequest) => {
                const StatusIcon = getStatusIcon(row.status.id);
                return (
                    <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" style={{ color: row.status.color }} />
                        <Badge
                            variant="soft"
                            color="secondary"
                            className="text-xs"
                        >
                            {getTranslatedStatus(row.status, t)}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'assignee',
            header: t.technician,
            accessor: 'assignee',
            render: (value: any, row: ServiceRequest) => (
                row.assignee ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-primary-gold">
                            {row.assignee.avatar}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                {row.assignee.name}
                            </p>
                            <p className="text-text-light-muted dark:text-text-muted text-xs">
                                {row.assignee.company}
                            </p>
                        </div>
                    </div>
                ) : (
                    <Badge variant="soft" color="secondary" className="text-xs">
                        {t.unassigned}
                    </Badge>
                )
            ),
        },
        {
            id: 'createdDate',
            header: t.createdDate,
            accessor: 'createdDate',
            sortable: true,
            render: (value: string, row: ServiceRequest) => (
                <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {formatDate(row.createdDate)}
                </div>
            ),
        },
        {
            id: 'dueDate',
            header: t.dueDate,
            accessor: 'dueDate',
            sortable: true,
            render: (value: string, row: ServiceRequest) => (
                <div className="text-sm">
                    <p className={`${row.isOverdue ? 'text-primary-red font-medium' : 'text-text-light-secondary dark:text-text-secondary'}`}>
                        {formatDate(row.dueDate)}
                    </p>
                    {row.isOverdue && (
                        <Badge variant="soft" color="red" className="text-xs mt-1">
                            {t.overdue}
                        </Badge>
                    )}
                </div>
            ),
        },
    ];

    // Add action column if no custom ActionMenuComponent is provided
    if (!ActionMenuComponent) {
        columns.push({
            id: 'actions',
            header: '',
            accessor: '',
            render: (_: any, row: ServiceRequest) => (
                <ActionMenu
                    request={row}
                    onViewRequest={actionHandlers.handleViewRequest}
                />
            ),
        });
    }

    return columns;
}; 