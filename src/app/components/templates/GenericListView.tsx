import React from 'react';
import DataTable from '@/app/components/ui/DataTable';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';

export interface GenericListViewProps<T> {
  data: T[];
  loading: boolean;
  error?: string | null;
  columns: any[];
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    onPageChange: (page: number) => void;
    onRecordsPerPageChange: (records: number) => void;
    recordsPerPageOptions?: number[];
    preventScroll?: boolean; // Add preventScroll prop
  };
  emptyStateMessage?: string;
  ActionMenuComponent?: React.ComponentType<{ row: T }>;
  showPagination?: boolean;
  loadingRowCount?: number;
}

function GenericListView<T>({
  data,
  loading,
  error,
  columns,
  sortConfig,
  onSortChange,
  onRowClick,
  pagination,
  emptyStateMessage = 'Kayıt bulunamadı.',
  ActionMenuComponent,
  showPagination = true,
  loadingRowCount = 6,
}: GenericListViewProps<T>) {
  // Error state
  if (error) {
    return (
      <EmptyState
        title="Hata"
        description={error}
        
      />
    );
  }

  // Empty state - only show when not loading and no data
  if (!loading && (!data || data.length === 0)) {
    return (
      <EmptyState
        title="Kayıt Bulunamadı"
        description={emptyStateMessage}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowActions={[]}
      sortConfig={sortConfig}
      onSortChange={onSortChange}
      onRowClick={onRowClick}
      pagination={showPagination ? pagination : undefined}
      emptyStateMessage={emptyStateMessage}
      ActionMenuComponent={ActionMenuComponent}
    />
  );
}

export default GenericListView;