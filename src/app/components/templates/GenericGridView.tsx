import React from 'react';
import type { LucideIcon } from 'lucide-react';

// UI components interface for dependency injection
export interface GenericGridViewUI {
  Card: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  Checkbox: React.ComponentType<any>;
  TablePagination: React.ComponentType<any>;
  Badge: React.ComponentType<any>;
  EmptyState: React.ComponentType<any>;
  Skeleton: React.ComponentType<any>;
  BulkActionsBar: React.ComponentType<any>;
}

export interface GenericGridViewProps<T> {
  data: T[];
  loading: boolean;
  error?: string | null;
  onSelectionChange?: (selectedIds: Array<string | number>) => void;
  bulkActions?: Array<{
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: (items: T[]) => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
  }>;
  onAction?: (action: string, item: T) => void;
  selectedItems?: Array<string | number>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    onPageChange: (page: number) => void;
    onRecordsPerPageChange: (recordsPerPage: number) => void;
    preventScroll?: boolean; // Add preventScroll prop
  };
  emptyStateMessage?: string;
  ui: GenericGridViewUI;
  ActionMenu?: React.ComponentType<{ row: T }>;
  renderCard: (item: T, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: GenericGridViewUI, ActionMenu?: React.ComponentType<{ row: T }>) => React.ReactNode;
  getItemId: (item: T) => string | number;
  selectable?: boolean;
  showBulkActions?: boolean;
  showPagination?: boolean;
  showSelectAll?: boolean;
  loadingCardCount?: number;
  gridCols?: string;
}

function GenericGridView<T>({
  data,
  loading,
  error,
  onSelectionChange,
  bulkActions = [],
  onAction,
  selectedItems = [],
  pagination,
  emptyStateMessage = 'Kayıt bulunamadı.',
  ui,
  ActionMenu,
  renderCard,
  getItemId,
  selectable = true,
  showBulkActions = true,
  showPagination = true,
  showSelectAll = true,
  loadingCardCount = 6,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}: GenericGridViewProps<T>) {
  // Selection handlers
  const handleSelect = (itemId: string | number) => {
    if (loading || !onSelectionChange) return;
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (loading || !onSelectionChange) return;
    const allIds = data.map(item => getItemId(item));
    onSelectionChange(selectedItems.length === data.length ? [] : allIds);
  };

  // Bulk actions adapter
  const convertedBulkActions = bulkActions.map(action => ({
    ...action,
    onClick: () => action.onClick(data.filter(item => selectedItems.includes(getItemId(item))))
  }));

  // Error state
  if (error) {
    return (
      <ui.EmptyState
        title="Hata"
        description={error}
        variant="error"
      />
    );
  }

  // Empty state - only show when not loading and no data
  if (!loading && data.length === 0) {
    return (
      <ui.EmptyState
        title="Kayıt Bulunamadı"
        description={emptyStateMessage}
      />
    );
  }

  // Selection state calculations
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      {showBulkActions && selectable && selectedItems.length > 0 && (
        <ui.BulkActionsBar
          selectedCount={selectedItems.length}
          actions={convertedBulkActions}
          onClearSelection={() => onSelectionChange?.([])}
        />
      )}

      {/* Select All Checkbox */}
      {showSelectAll && selectable && (
        <div className="flex items-center mb-2 gap-2">
          <div className="flex items-center justify-center">
            <ui.Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              disabled={loading || data.length === 0}
              className="focus:ring-2 focus:ring-primary-gold/30"
            />
          </div>
          <span className="text-sm text-text-light-secondary dark:text-text-secondary select-none leading-none">
            Tümünü Seç
          </span>
        </div>
      )}

      {/* Grid Layout */}
      <div className={`grid ${gridCols} gap-6`}>
        {loading ? (
          // Show skeleton cards when loading
          Array.from({ length: loadingCardCount }).map((_, i) => (
            <ui.Skeleton key={`skeleton-${i}`} className="h-56 rounded-2xl" />
          ))
        ) : (
          data.map((item) => 
            renderCard(item, selectedItems, handleSelect, ui, ActionMenu)
          )
        )}
      </div>

      {/* Pagination */}
      {showPagination && pagination && (
        <div className="mt-6">
          <ui.TablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalRecords}
            recordsPerPage={pagination.recordsPerPage}
            onPageChange={pagination.onPageChange}
            onRecordsPerPageChange={pagination.onRecordsPerPageChange}
            showRecordsPerPage={true}
          />
        </div>
      )}
    </div>
  );
}

export default GenericGridView;