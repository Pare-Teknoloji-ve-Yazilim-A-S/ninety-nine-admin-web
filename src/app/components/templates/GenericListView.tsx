import React from 'react';
import DataTable from '@/app/components/ui/DataTable';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';

export interface GenericListViewProps<T> {
  data: T[];
  loading: boolean;
  error?: string | null;
  onSelectionChange?: (selected: T[]) => void;
  bulkActions?: any[];
  columns: any[];
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
  ActionMenuComponent?: React.ComponentType<{ row: T }>;
  selectable?: boolean;
  showPagination?: boolean;
  loadingRowCount?: number;
}

function GenericListView<T>({
  data,
  loading,
  error,
  onSelectionChange,
  bulkActions = [],
  columns,
  sortConfig,
  onSortChange,
  pagination,
  emptyStateMessage = 'Kayıt bulunamadı.',
  ActionMenuComponent,
  selectable = true,
  showPagination = true,
  loadingRowCount = 6,
}: GenericListViewProps<T>) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: loadingRowCount }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Hata"
        description={error}
        variant="error"
      />
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
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
      selectable={selectable}
      onSelectionChange={onSelectionChange}
      bulkActions={bulkActions}
      rowActions={[]}
      sortConfig={sortConfig}
      onSortChange={onSortChange}
      pagination={showPagination ? pagination : undefined}
      emptyStateMessage={emptyStateMessage}
      ActionMenuComponent={ActionMenuComponent}
    />
  );
}

export default GenericListView;