import React from 'react';
import DataTable from '@/app/components/ui/DataTable';

export interface ListViewProps<T> {
  data: T[];
  loading: boolean;
  onSelectionChange: (selected: T[]) => void;
  bulkActions: any[]; // Kullanıcı kendi tipini geçebilir
  columns: any[]; // Kullanıcı kendi tipini geçebilir
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

function ListView<T>({
  data,
  loading,
  onSelectionChange,
  bulkActions,
  columns,
  sortConfig,
  onSortChange,
  pagination,
  emptyStateMessage,
}: ListViewProps<T>) {
  return (
    <DataTable
      columns={columns}
      data={data}
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
}

export default ListView; 