import { 
    Grid, 
    Layers, 
    Mail, 
    MessageSquare, 
    FileText, 
    Tag, 
    Trash2, 
    UserCheck, 
    UserX, 
    Users, 
    Home, 
    CreditCard, 
    List
} from 'lucide-react';
import { StatusConfig, MembershipConfig, ViewOption } from '../types';

// Status Configuration
export const STATUS_CONFIG: Record<string, StatusConfig> = {
    'ACTIVE': { label: 'Aktif', color: 'green' },
    'INACTIVE': { label: 'Pasif', color: 'gray' },
    'PENDING': { label: 'Beklemede', color: 'yellow' },
    'BANNED': { label: 'Yasaklı', color: 'red' },
    'SUSPENDED': { label: 'Askıya Alınmış', color: 'red' },
    'default': { label: 'Bilinmeyen', color: 'gray' }
};

// Membership Configuration
export const MEMBERSHIP_CONFIG: Record<string, MembershipConfig> = {
    'GOLD': { label: 'Altın', color: 'gold' },
    'SILVER': { label: 'Gümüş', color: 'gray' },
    'STANDARD': { label: 'Standart', color: 'blue' },
    'default': { label: 'Standart', color: 'blue' }
};

// Verification Configuration
export const VERIFICATION_CONFIG: Record<string, StatusConfig> = {
    'APPROVED': { label: 'Onaylandı', color: 'green' },
    'REJECTED': { label: 'Reddedildi', color: 'red' },
    'PENDING': { label: 'İnceleniyor', color: 'yellow' },
    'UNDER_REVIEW': { label: 'İnceleniyor', color: 'yellow' },
    'default': { label: 'İnceleniyor', color: 'yellow' }
};

// View Options
export const VIEW_OPTIONS: ViewOption[] = [
    { id: 'grid', label: 'Kart Görünümü', icon: Grid },
    { id: 'table', label: 'Tablo Görünümü', icon: List },
];

// Breadcrumb Items
export const BREADCRUMB_ITEMS = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Sakinler', href: '/dashboard/residents' },
    { label: 'Sakin Listesi', active: true }
];

// Stats Configuration
export const STATS_CONFIG = {
    colors: {
        PRIMARY: 'primary' as const,
        SUCCESS: 'success' as const,
        INFO: 'info' as const,
        DANGER: 'danger' as const,
        GOLD: 'gold' as const,
    },
    icons: {
        USERS: Users,
        HOME: Home,
        CREDIT_CARD: CreditCard,
    }
};

// Bulk Action IDs
export const BULK_ACTION_IDS = {
    MAIL: 'mail',
    SMS: 'sms',
    PDF: 'pdf',
    TAG: 'tag',
    ACTIVATE: 'activate',
    DEACTIVATE: 'deactivate',
    DELETE: 'delete',
} as const;

// Table Column IDs
export const TABLE_COLUMN_IDS = {
    PHOTO: 'photo',
    NAME: 'firstName',
    LOCATION: 'location',
    TYPE: 'type',
    CONTACT: 'contact',
    MEMBERSHIP: 'membership',
    VERIFICATION: 'verification',
    STATUS: 'status',
    ACTIONS: 'actions',
} as const;

// Filter Group Names
export const FILTER_GROUPS = {
    RESIDENT_STATUS: 'residentStatus',
    RESIDENT_TYPE: 'residentType',
    BUILDING: 'building',
    DEBT_RANGE: 'debtRange',
    REGISTRATION_DATE: 'registrationDate',
} as const;

// Export Formats
export const EXPORT_FORMATS = {
    PDF: 'pdf',
    EXCEL: 'excel',
    CSV: 'csv',
    JSON: 'json',
} as const;

// Default Values
export const DEFAULT_VALUES = {
    RECORDS_PER_PAGE: 25,
    CURRENT_PAGE: 1,
    SELECTED_VIEW: 'table',
    SEARCH_DEBOUNCE_MS: 500,
    NATIONAL_ID_MASK_LENGTH: 3,
} as const;

// API Configuration
export const API_CONFIG = {
    DEFAULT_ORDER_COLUMN: 'firstName',
    DEFAULT_ORDER_DIRECTION: 'ASC' as const,
    SORT_FIELD_MAPPING: {
        fullName: 'firstName',
        debt: 'createdAt',
        default: 'firstName'
    }
} as const; 