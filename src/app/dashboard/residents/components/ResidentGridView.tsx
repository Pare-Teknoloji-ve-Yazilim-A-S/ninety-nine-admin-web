'use client';

import React from 'react';
import { 
    Eye, 
    Edit, 
    MessageSquare, 
    Phone, 
    MoreVertical, 
    User, 
    Home, 
    CreditCard, 
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import { Resident } from '@/app/components/ui/ResidentRow';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import Pagination from '@/app/components/ui/Pagination';
import Skeleton from '@/app/components/ui/Skeleton';
import { BulkAction } from '../types';

interface ResidentGridViewProps {
    residents: Resident[];
    loading: boolean;
    onSelectionChange: (residents: Resident[]) => void;
    bulkActions: BulkAction[];
    onAction: (action: string, resident: Resident) => void;
    selectedResidents?: Resident[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        onPageChange: (page: number) => void;
        onRecordsPerPageChange: (records: number) => void;
    };
    emptyStateMessage?: string;
}

const ResidentGridView: React.FC<ResidentGridViewProps> = ({
    residents,
    loading,
    onSelectionChange,
    bulkActions,
    onAction,
    selectedResidents = [],
    pagination,
    emptyStateMessage,
}) => {
    const selectedResidentIds = selectedResidents.map(r => r.id);

    const handleResidentSelection = (resident: Resident) => {
        const isSelected = selectedResidentIds.includes(resident.id);
        let newSelection: Resident[];
        
        if (isSelected) {
            newSelection = selectedResidents.filter(r => r.id !== resident.id);
        } else {
            newSelection = [...selectedResidents, resident];
        }
        
        onSelectionChange(newSelection);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectionChange(residents);
        } else {
            onSelectionChange([]);
        }
    };

    const getStatusColor = (status: Resident['status']) => {
        switch (status.color) {
            case 'green':
                return 'success';
            case 'yellow':
                return 'warning';
            case 'red':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getTypeColor = (type: Resident['residentType']) => {
        switch (type.color) {
            case 'blue':
                return 'primary';
            case 'green':
                return 'success';
            case 'purple':
                return 'accent';
            default:
                return 'secondary';
        }
    };

    const getStatusIcon = (status: Resident['status']) => {
        switch (status.type) {
            case 'active':
                return <CheckCircle size={14} className="text-semantic-success-600" />;
            case 'pending':
                return <Clock size={14} className="text-semantic-warning-600" />;
            case 'inactive':
            case 'suspended':
                return <AlertCircle size={14} className="text-primary-red" />;
            default:
                return null;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    const maskNationalId = (nationalId?: string) => {
        if (!nationalId) return '';
        return `****${nationalId.slice(-3)}`;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const handleActionClick = (action: string, resident: Resident, e: React.MouseEvent) => {
        e.stopPropagation();
        onAction(action, resident);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="w-24 h-4" />
                                        <Skeleton className="w-16 h-3" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="w-full h-3" />
                                    <Skeleton className="w-3/4 h-3" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (residents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                    <User size={48} className="text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Sakin Bulunamadı
                    </h3>
                    <p className="text-text-light-secondary dark:text-text-secondary">
                        {emptyStateMessage || 'Henüz sakin kaydı bulunmuyor.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Bulk Actions Bar */}
            {selectedResidents.length > 0 && bulkActions.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedResidents.length}
                    actions={bulkActions.map(action => ({
                        ...action,
                        onClick: () => action.onClick(selectedResidents)
                    }))}
                    onClearSelection={() => handleSelectAll(false)}
                />
            )}

            {/* Selection Info */}
            {selectedResidents.length > 0 && bulkActions.length === 0 && (
                <div className="bg-primary-gold/10 border border-primary-gold/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-on-light dark:text-text-on-dark">
                            {selectedResidents.length} sakin seçildi
                        </span>
                        <button
                            onClick={() => handleSelectAll(false)}
                            className="text-sm text-primary-gold hover:text-primary-gold/80"
                        >
                            Seçimi Temizle
                        </button>
                    </div>
                </div>
            )}

            {/* Grid Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                                                    <Checkbox
                                    checked={selectedResidents.length === residents.length}
                                    indeterminate={selectedResidents.length > 0 && selectedResidents.length < residents.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {selectedResidents.length > 0 ? `${selectedResidents.length} seçili` : 'Tümünü seç'}
                    </span>
                </div>
                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {residents.length} sakin
                </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {residents.map((resident) => {
                    const isSelected = selectedResidentIds.includes(resident.id);
                    const hasDebt = resident.financial.totalDebt > 0;

                    return (
                        <Card
                            key={resident.id}
                            className={cn(
                                'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
                                isSelected && 'ring-2 ring-primary-gold bg-primary-gold/10'
                            )}
                            onClick={() => handleResidentSelection(resident)}
                        >
                            {/* Selection Checkbox */}
                            <div className="flex items-start justify-between mb-3">
                                <Checkbox
                                    checked={isSelected}
                                    onChange={() => handleResidentSelection(resident)}
                                    className="mt-1"
                                />
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={Eye}
                                        onClick={(e) => handleActionClick('view', resident, e)}
                                        className="h-6 w-6 p-1"
                                        title="Görüntüle"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={Edit}
                                        onClick={(e) => handleActionClick('edit', resident, e)}
                                        className="h-6 w-6 p-1"
                                        title="Düzenle"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={MoreVertical}
                                        onClick={(e) => handleActionClick('more', resident, e)}
                                        className="h-6 w-6 p-1"
                                        title="Daha Fazla"
                                    />
                                </div>
                            </div>

                            {/* Profile Section */}
                            <div className="flex items-center space-x-3 mb-4">
                                {resident.profileImage ? (
                                    <img
                                        src={resident.profileImage}
                                        alt={resident.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className={cn(
                                        'w-12 h-12 rounded-full flex items-center justify-center font-medium text-white',
                                        resident.isGoldMember ? 'bg-primary-gold' : 'bg-primary-gray-blue'
                                    )}>
                                        {getInitials(resident.firstName, resident.lastName)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-text-on-light dark:text-text-on-dark truncate">
                                            {resident.fullName}
                                        </p>
                                        {resident.isGoldMember && (
                                            <Badge variant="solid" color="gold" size="sm">
                                                Gold
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={12} className="text-text-light-muted dark:text-text-muted" />
                                        <p className="text-xs text-text-light-muted dark:text-text-muted">
                                            TC: {maskNationalId(resident.nationalId)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Home size={14} className="text-text-light-muted dark:text-text-muted" />
                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                        {resident.address.building} - {resident.address.apartment}
                                    </p>
                                </div>
                                <p className="text-xs text-text-light-secondary dark:text-text-secondary pl-5">
                                    {resident.address.roomType}
                                </p>
                            </div>

                            {/* Type and Status */}
                            <div className="flex items-center justify-between mb-3">
                                <Badge
                                    variant="soft"
                                    color={getTypeColor(resident.residentType) as any}
                                    size="sm"
                                >
                                    {resident.residentType.label}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    {getStatusIcon(resident.status)}
                                    <Badge
                                        variant="soft"
                                        color={getStatusColor(resident.status) as any}
                                        size="sm"
                                    >
                                        {resident.status.label}
                                    </Badge>
                                </div>
                            </div>

                            {/* Financial */}
                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCard size={14} className="text-text-light-muted dark:text-text-muted" />
                                    <span className={cn(
                                        'text-sm font-medium',
                                        hasDebt ? 'text-primary-red' : 'text-semantic-success-600'
                                    )}>
                                        {formatCurrency(resident.financial.totalDebt)}
                                    </span>
                                </div>
                                {resident.financial.lastPaymentDate && (
                                    <p className="text-xs text-text-light-secondary dark:text-text-secondary pl-5">
                                        Son: {formatDate(resident.financial.lastPaymentDate)}
                                    </p>
                                )}
                            </div>

                            {/* Contact Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={Phone}
                                    onClick={(e) => handleActionClick('call', resident, e)}
                                    className="flex-1"
                                >
                                    Ara
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={MessageSquare}
                                    onClick={(e) => handleActionClick('message', resident, e)}
                                    className="flex-1"
                                >
                                    Mesaj
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ResidentGridView; 