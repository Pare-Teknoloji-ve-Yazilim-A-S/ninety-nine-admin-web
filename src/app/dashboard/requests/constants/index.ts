// Request Types - Synchronized with CreateTicketModal
export const TICKET_TYPES = [
    { value: 'FAULT_REPAIR', label: 'Arıza Tamiri' },
    { value: 'MAINTENANCE', label: 'Bakım' },
    { value: 'CLEANING', label: 'Temizlik' },
    { value: 'SECURITY', label: 'Güvenlik' },
    { value: 'COMPLAINT', label: 'Şikayet' },
    { value: 'SUGGESTION', label: 'Öneri' },
    { value: 'OTHER', label: 'Diğer' }
] as const;

// Request Status - Complete status list as requested
export const TICKET_STATUS = [
    { value: 'OPEN', label: 'Açık' },
    { value: 'IN_PROGRESS', label: 'İşlemde' },
    { value: 'WAITING', label: 'Beklemede' },
    { value: 'RESOLVED', label: 'Çözümlendi' },
    { value: 'CLOSED', label: 'Kapatıldı' },
    { value: 'CANCELLED', label: 'İptal Edildi' }
] as const;

// Priority levels
export const TICKET_PRIORITIES = [
    { value: 'LOW', label: 'Düşük' },
    { value: 'MEDIUM', label: 'Orta' },
    { value: 'HIGH', label: 'Yüksek' },
    { value: 'URGENT', label: 'Acil' }
] as const;

// Filter configuration factory - SOLID: Single Responsibility
export const createTicketFilterGroups = (includeAllStatuses: boolean = true) => {
    const statusOptions = includeAllStatuses
        ? [{ id: 'all', label: 'Tümü', value: '' }, ...TICKET_STATUS.map(status => ({
            id: status.value,
            label: status.label,
            value: status.value
        }))]
        : [{ id: 'all', label: 'Tümü', value: '' }, ...TICKET_STATUS.map(status => ({
            id: status.value,
            label: status.label,
            value: status.value
        }))];

    return [
        {
            id: 'type',
            label: 'Talep Tipi',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                ...TICKET_TYPES.map(type => ({
                    id: type.value,
                    label: type.label,
                    value: type.value
                }))
            ],
        },
        {
            id: 'status',
            label: 'Durum',
            type: 'select' as const,
            options: statusOptions,
        },
        {
            id: 'priority',
            label: 'Öncelik',
            type: 'select' as const,
            options: [
                { id: 'all', label: 'Tümü', value: '' },
                ...TICKET_PRIORITIES.map(priority => ({
                    id: priority.value,
                    label: priority.label,
                    value: priority.value
                }))
            ],
        }
    ];
};

// Status configuration with icons and colors - SOLID: Open/Closed
export const STATUS_CONFIG = {
    OPEN: { label: 'Açık', color: 'info', icon: 'AlertCircle' },
    IN_PROGRESS: { label: 'İşlemde', color: 'warning', icon: 'RotateCcw' },
    WAITING: { label: 'Beklemede', color: 'warning', icon: 'PauseCircle' },
    RESOLVED: { label: 'Çözümlendi', color: 'success', icon: 'CheckCircle' },
    CLOSED: { label: 'Kapatıldı', color: 'success', icon: 'CheckCircle' },
    CANCELLED: { label: 'İptal Edildi', color: 'red', icon: 'XCircle' },
    // Legacy support
    COMPLETED: { label: 'Tamamlandı', color: 'success', icon: 'CheckCircle' },
    SCHEDULED: { label: 'Planlandı', color: 'primary', icon: 'Calendar' }
} as const;

// Type color mapping - SOLID: Interface Segregation
export const TYPE_COLOR_MAP: Record<string, "primary" | "secondary" | "gold" | "red"> = {
    FAULT_REPAIR: 'gold',
    COMPLAINT: 'red',
    REQUEST: 'primary',
    SUGGESTION: 'primary',
    QUESTION: 'secondary',
    MAINTENANCE: 'primary',
    SECURITY: 'red',
    CLEANING: 'primary',
    OTHER: 'secondary',
} as const;

// Filter interface for type safety - SOLID: Dependency Inversion
export interface TicketFilters {
    search?: string;
    type?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
    orderColumn?: string;
    orderBy?: 'ASC' | 'DESC';
}

// Filter state management helper - SOLID: Single Responsibility
export class FilterStateManager {
    private filters: TicketFilters = {};

    setFilter(key: keyof TicketFilters, value: any) {
        console.log(`🔄 FilterStateManager.setFilter: key=${key}, value=${value}, type=${typeof value}`);
        if (value === '' || value === null || value === undefined) {
            delete this.filters[key];
            console.log(`❌ Deleted filter key: ${key}`);
        } else {
            this.filters[key] = value;
            console.log(`✅ Set filter: ${key} = ${value}`);
        }
        console.log(`📊 Current filters:`, { ...this.filters });
    }

    getFilters(): TicketFilters {
        return { ...this.filters };
    }

    resetFilters() {
        this.filters = {};
    }

    hasActiveFilters(): boolean {
        return Object.keys(this.filters).length > 0;
    }
} 