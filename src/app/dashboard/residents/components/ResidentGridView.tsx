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
    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            
            // Close dropdown when clicking outside
            const closeOnClickOutside = (event: MouseEvent) => {
                if (!event.target || !dropdown || !e.currentTarget) {
                    return;
                }

                const target = event.target as Node;
                if (!dropdown.contains(target) && !e.currentTarget.contains(target)) {
                    dropdown.classList.add('hidden');
                    document.removeEventListener('click', closeOnClickOutside);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', closeOnClickOutside);
            }, 0);
        }
    };

    const handleAction = (action: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.currentTarget.closest('.absolute')?.classList.add('hidden');
        onAction(action, resident);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative group">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={MoreVertical}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleDropdownToggle}
                />

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
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
        <div className="space-y-4">
            {/* Bulk Actions Bar */}
            {selectedResidents.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedResidents.length}
                    actions={convertedBulkActions}
                    onClearSelection={() => onSelectionChange([])}
                />
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {residents.map((resident) => (
                    <Card key={resident.id} className="p-4 bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={selectedResidents.includes(resident.id)}
                                    onChange={() => handleSelect(resident.id)}
                                />
                                <div>
                                    <h3 className="text-text-on-light dark:text-text-on-dark font-medium">
                                        {resident.firstName} {resident.lastName}
                                    </h3>
                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        {resident.address.apartment}
                                    </p>
                                </div>
                            </div>
                            <ActionMenu resident={resident} onAction={onAction} />
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                {resident.status.label}
                            </p>
                            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                {resident.residentType.label}
                            </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                            {resident.contact.phone && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={Phone}
                                    onClick={() => onAction('call', resident)}
                                >
                                    Ara
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={MessageSquare}
                                onClick={() => onAction('message', resident)}
                            >
                                Mesaj
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-4">
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