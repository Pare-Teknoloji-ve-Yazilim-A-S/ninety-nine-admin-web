'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Checkbox from '@/app/components/ui/Checkbox';
import TablePagination from '@/app/components/ui/TablePagination';
import { Resident } from '@/app/components/ui/ResidentRow';
import { 
    MoreVertical, 
    Phone, 
    Mail, 
    Eye, 
    Edit, 
    Trash2, 
    MessageSquare, 
    QrCode, 
    StickyNote, 
    History, 
    CreditCard as PaymentHistory 
} from 'lucide-react';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import { LucideIcon } from 'lucide-react';
import Badge from '@/app/components/ui/Badge';

interface BulkAction {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
}

interface ResidentGridViewProps {
    residents: Resident[];
    loading: boolean;
    onSelectionChange: (selectedIds: Array<string | number>) => void;
    bulkActions: Array<{
        id: string;
        label: string;
        icon: LucideIcon;
        onClick: (residents: Resident[]) => void;
        variant?: 'default' | 'danger' | 'success' | 'warning';
        disabled?: boolean;
        loading?: boolean;
    }>;
    onAction: (action: string, resident: Resident) => void;
    selectedResidents: Array<string | number>;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        onPageChange: (page: number) => void;
        onRecordsPerPageChange: (recordsPerPage: number) => void;
    };
    emptyStateMessage?: string;
}

interface ActionMenuProps {
    resident: Resident;
    onAction: (action: string, resident: Resident) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ resident, onAction }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                buttonRef.current && 
                !dropdownRef.current.contains(event.target as Node) && 
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleAction = (action: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        onAction(action, resident);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative group">
                <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="sm"
                    icon={MoreVertical}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleDropdownToggle}
                />

                {/* Dropdown Menu */}
                <div 
                    ref={dropdownRef}
                    className={`absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${isOpen ? '' : 'hidden'}`}
                >
                    <div className="py-1">
                        {/* Primary Actions */}
                        <button
                            onClick={handleAction('view')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <Eye className="w-5 h-5" />
                            Görüntüle
                        </button>

                        <button
                            onClick={handleAction('edit')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <Edit className="w-5 h-5" />
                            Düzenle
                        </button>

                        <hr className="border-gray-200 dark:border-gray-600 my-1" />

                        {/* Communication Actions */}
                        <button
                            onClick={handleAction('call')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <Phone className="w-5 h-5" />
                            Ara
                        </button>

                        <button
                            onClick={handleAction('message')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Mesaj
                        </button>

                        <hr className="border-gray-200 dark:border-gray-600 my-1" />

                        {/* Utility Actions */}
                        <button
                            onClick={handleAction('qr')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <QrCode className="w-5 h-5" />
                            QR Kod
                        </button>

                        <button
                            onClick={handleAction('notes')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <StickyNote className="w-5 h-5" />
                            Notlar
                        </button>

                        <button
                            onClick={handleAction('history')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <History className="w-5 h-5" />
                            Geçmiş
                        </button>

                        <button
                            onClick={handleAction('payment-history')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <PaymentHistory className="w-5 h-5" />
                            Ödeme Geçmişi
                        </button>

                        <hr className="border-gray-200 dark:border-gray-600 my-1" />

                        {/* Danger Actions */}
                        <button
                            onClick={handleAction('delete')}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                        >
                            <Trash2 className="w-5 h-5" />
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions for badge color mapping
const getStatusColor = (status: Resident['status']): 'primary' | 'gold' | 'red' | 'secondary' | 'accent' => {
    switch (status.color) {
        case 'green':
            return 'primary'; // Use primary for active/green
        case 'yellow':
            return 'gold'; // Use gold for warning/yellow
        case 'red':
            return 'red';
        case 'blue':
            return 'accent';
        default:
            return 'secondary';
    }
};
const getTypeColor = (type: Resident['residentType']): 'primary' | 'gold' | 'red' | 'secondary' | 'accent' => {
    switch (type.color) {
        case 'blue':
            return 'primary';
        case 'green':
            return 'accent';
        case 'purple':
            return 'accent';
        default:
            return 'secondary';
    }
};

export default function ResidentGridView({
    residents,
    loading,
    onSelectionChange,
    bulkActions,
    onAction,
    selectedResidents,
    pagination,
    emptyStateMessage = 'Kayıt bulunamadı.'
}: ResidentGridViewProps) {
    // Handle checkbox selection
    const handleSelect = (residentId: string | number) => {
        const newSelection = selectedResidents.includes(residentId)
            ? selectedResidents.filter(id => id !== residentId)
            : [...selectedResidents, residentId];
        onSelectionChange(newSelection);
    };

    // Handle select all
    const handleSelectAll = () => {
        const allIds = residents.map(resident => resident.id);
        onSelectionChange(selectedResidents.length === residents.length ? [] : allIds);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-56 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!loading && residents.length === 0) {
        return <EmptyState title="Kayıt Bulunamadı" description={emptyStateMessage} />;
    }

    // Convert bulk actions to the format expected by BulkActionsBar
    const convertedBulkActions: BulkAction[] = bulkActions.map(action => ({
        ...action,
        onClick: () => action.onClick(residents.filter(r => selectedResidents.includes(r.id)))
    }));

    return (
        <div className="space-y-6">
            {/* Bulk Actions Bar */}
            {selectedResidents.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedResidents.length}
                    actions={convertedBulkActions}
                    onClearSelection={() => onSelectionChange([])}
                />
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {residents.map((resident) => {
                    return (
                        <Card
                            key={resident.id}
                            className="p-6 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg group"
                        >
                            {/* Üst Alan: Checkbox + İsim + Menü */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={selectedResidents.includes(resident.id)}
                                        onChange={() => handleSelect(resident.id)}
                                        className="focus:ring-2 focus:ring-primary-gold/30" // remove mt-1 for vertical centering
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-on-dark tracking-tight">
                                            {resident.firstName} {resident.lastName}
                                        </h3>
                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary font-medium mt-1">
                                            {resident.address.apartment}
                                        </p>
                                    </div>
                                </div>
                                <ActionMenu resident={resident} onAction={onAction} />
                            </div>

                            {/* Orta Alan: Durum ve Tip Badge'leri */}
                            <div className="mt-4 flex flex-wrap gap-2 items-center">
                                <Badge variant="soft" color={getStatusColor(resident.status)} className="text-xs px-3 py-1 rounded-full font-medium">
                                    {resident.status.label}
                                </Badge>
                                <Badge variant="soft" color={getTypeColor(resident.residentType)} className="text-xs px-3 py-1 rounded-full font-semibold text-on-dark">
                                    {resident.residentType.label}
                                </Badge>
                            </div>

                            {/* İletişim Bilgileri */}
                            <div className="mt-4 flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-secondary">
                                {resident.contact.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-primary-gold" />
                                        <span>{resident.contact.phone}</span>
                                    </div>
                                )}
                                {resident.contact.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary-gold" />
                                        <span>{resident.contact.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Alt Alan: Aksiyon Butonları */}
                            <div className="mt-6 flex gap-3">
                                {resident.contact.phone && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        icon={Phone}
                                        onClick={() => onAction('call', resident)}
                                        className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                                    >
                                        Ara
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={MessageSquare}
                                    onClick={() => onAction('message', resident)}
                                    className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                                >
                                    Mesaj
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <TablePagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalRecords={pagination.totalRecords}
                    recordsPerPage={pagination.recordsPerPage}
                    onPageChange={pagination.onPageChange}
                    onRecordsPerPageChange={pagination.onRecordsPerPageChange}
                    showRecordsPerPage={true}
                />
            </div>
        </div>
    );
} 