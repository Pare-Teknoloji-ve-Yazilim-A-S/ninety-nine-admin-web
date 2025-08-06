import React from 'react';
import { ServiceRequest } from '@/services/types/request-list.types';
import Badge from '@/app/components/ui/Badge';
import { 
    Eye, 
    Edit, 
    Trash2, 
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

/**
 * Action menu component for table rows
 */
interface ActionMenuProps {
    request: ServiceRequest;
    onViewRequest: (request: ServiceRequest) => void;
    onEditRequest: (request: ServiceRequest) => void;
    onDeleteRequest: (request: ServiceRequest) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    request,
    onViewRequest,
    onEditRequest,
    onDeleteRequest,
}) => {
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewRequest(request);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEditRequest(request);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteRequest(request);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors">
                    <MoreVertical size={16} className="text-text-light-secondary dark:text-text-secondary" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-background-card border border-background-light-secondary dark:border-background-secondary rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                        onClick={handleView}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-background-light-soft dark:hover:bg-background-soft flex items-center gap-3 text-text-on-light dark:text-text-on-dark"
                    >
                        <Eye size={16} />
                        Detay
                    </button>
                    <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-background-light-soft dark:hover:bg-background-soft flex items-center gap-3 text-text-on-light dark:text-text-on-dark"
                    >
                        <Edit size={16} />
                        Düzenle
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-background-light-soft dark:hover:bg-background-soft flex items-center gap-3 text-primary-red"
                    >
                        <Trash2 size={16} />
                        Sil
                    </button>
                </div>
            </div>
        </div>
    );
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
        handleEditRequest: (request: ServiceRequest) => void;
        handleDeleteRequest: (request: ServiceRequest) => void;
    },
    ActionMenuComponent?: React.ComponentType<{ row: ServiceRequest }>
) => {
    const columns = [
        {
            id: 'title',
            header: 'Başlık',
            accessor: 'title',
            sortable: true,
            render: (value: string, row: ServiceRequest) => (
                <div className="max-w-xs">
                    <p className="font-medium text-text-on-light dark:text-text-on-dark truncate">
                        {value}
                    </p>
                    {row.isUrgent && (
                        <Badge variant="solid" color="red" className="text-xs mt-1">
                            Acil
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'apartment',
            header: 'Daire',
            accessor: 'apartment',
            render: (value: any, row: ServiceRequest) => (
                <div className="text-sm">
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                        {row.apartment.number}
                    </p>
                    <p className="text-text-light-muted dark:text-text-muted">
                        {row.apartment.block} Blok
                    </p>
                </div>
            ),
        },
        {
            id: 'category',
            header: 'Kategori',
            accessor: 'category',
            render: (value: any, row: ServiceRequest) => (
                <Badge
                    variant="soft"
                    color="secondary"
                    className="text-xs"
                >
                    <span className="mr-1">{row.category.icon}</span>
                    {row.category.label}
                </Badge>
            ),
        },
        {
            id: 'priority',
            header: 'Öncelik',
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
                    {row.priority.label}
                </Badge>
            ),
        },
        {
            id: 'status',
            header: 'Durum',
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
                            {row.status.label}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'assignee',
            header: 'Teknisyen',
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
                        Atanmamış
                    </Badge>
                )
            ),
        },
        {
            id: 'createdDate',
            header: 'Oluşturulma',
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
            header: 'Vade',
            accessor: 'dueDate',
            sortable: true,
            render: (value: string, row: ServiceRequest) => (
                <div className="text-sm">
                    <p className={`${row.isOverdue ? 'text-primary-red font-medium' : 'text-text-light-secondary dark:text-text-secondary'}`}>
                        {formatDate(row.dueDate)}
                    </p>
                    {row.isOverdue && (
                        <Badge variant="soft" color="red" className="text-xs mt-1">
                            Gecikmiş
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
            width: '60px',
            render: (_: any, row: ServiceRequest) => (
                <ActionMenu
                    request={row}
                    onViewRequest={actionHandlers.handleViewRequest}
                    onEditRequest={actionHandlers.handleEditRequest}
                    onDeleteRequest={actionHandlers.handleDeleteRequest}
                />
            ),
        });
    }

    return columns;
}; 