'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Checkbox from '@/app/components/ui/Checkbox';
import TablePagination from '@/app/components/ui/TablePagination';
import { Resident } from '@/app/components/ui/ResidentRow';
import { MoreHorizontal, Phone, Mail } from 'lucide-react';
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
                    <Card key={resident.id} className="p-4">
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
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={MoreHorizontal}
                                onClick={() => onAction('more', resident)}
                            />
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
                                icon={Mail}
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