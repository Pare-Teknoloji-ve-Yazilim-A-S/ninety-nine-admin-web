'use client';

import React from 'react';
import DataTable from '@/app/components/ui/DataTable';
import { Resident } from '@/app/components/ui/ResidentRow';
import { BulkAction, TableColumn } from '../types';

interface ResidentListViewProps {
    residents: Resident[];
    loading: boolean;
    onSelectionChange: (residents: Resident[]) => void;
    bulkActions: BulkAction[];
    columns: TableColumn[];
    sortConfig?: { key: string; direction: 'asc' | 'desc' };
    onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
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

const ResidentListView: React.FC<ResidentListViewProps> = ({
    residents,
    loading,
    onSelectionChange,
    bulkActions,
    columns,
    sortConfig,
    onSortChange,
    pagination,
    emptyStateMessage,
}) => {
    return (
        <DataTable
            columns={columns}
            data={residents}
            loading={loading}
            selectable={true}
            onSelectionChange={onSelectionChange}
            bulkActions={bulkActions}
            rowActions={[]}
            sortConfig={sortConfig}
            onSortChange={onSortChange}
            pagination={pagination}
            emptyStateMessage={emptyStateMessage}
        />
    );
};

export default ResidentListView; 