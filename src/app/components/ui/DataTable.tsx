import React, { useState, useMemo } from 'react';
import { LucideIcon, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from './Card';
import Button from './Button';
import TablePagination from './TablePagination';
import BulkActionsBar from './BulkActionsBar';
import Checkbox from './Checkbox';

export interface ColumnAction {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: (row: any) => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    disabled?: (row: any) => boolean;
    visible?: (row: any) => boolean;
}

export interface Column {
    id: string;
    header: string;
    accessor: string | ((row: any) => any);
    sortable?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: any) => React.ReactNode;
    headerRender?: () => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface DataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
    selectable?: boolean;
    expandable?: boolean;
    onRowClick?: (row: any) => void;
    onRowDoubleClick?: (row: any) => void;
    onSelectionChange?: (selectedRows: any[]) => void;
    bulkActions?: Array<{
        id: string;
        label: string;
        icon: LucideIcon;
        onClick: (selectedRows: any[]) => void;
        variant?: 'default' | 'danger' | 'success' | 'warning';
    }>;
    rowActions?: ColumnAction[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        onPageChange: (page: number) => void;
        onRecordsPerPageChange?: (recordsPerPage: number) => void;
    };
    sortConfig?: {
        key: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal' | 'bordered';
    emptyStateMessage?: string;
    rowClassName?: (row: any) => string;
    expandedContent?: (row: any) => React.ReactNode;
    stickyHeader?: boolean;
    maxHeight?: string;
    ActionMenuComponent?: React.ComponentType<{ row: any }>;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    loading = false,
    selectable = false,
    expandable = false,
    onRowClick,
    onRowDoubleClick,
    onSelectionChange,
    bulkActions = [],
    rowActions = [],
    pagination,
    sortConfig,
    onSortChange,
    className,
    size = 'md',
    variant = 'default',
    emptyStateMessage = 'Veri bulunamadı',
    rowClassName,
    expandedContent,
    stickyHeader = false,
    maxHeight,
    ActionMenuComponent,
}) => {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const paddingClasses = {
        sm: 'px-2 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
    };

    const variantClasses = {
        default: 'border border-gray-200 dark:border-gray-700',
        minimal: 'border-0 shadow-none',
        bordered: 'border-2 border-primary-gold/30',
    };

    // Selection logic
    const isAllSelected = useMemo(() => {
        return data.length > 0 && selectedRows.length === data.length;
    }, [data, selectedRows]);

    const isIndeterminate = useMemo(() => {
        return selectedRows.length > 0 && selectedRows.length < data.length;
    }, [data, selectedRows]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows([...data]);
        }
    };

    const handleSelectRow = (row: any) => {
        const isSelected = selectedRows.some(selected => selected.id === row.id);
        if (isSelected) {
            setSelectedRows(selectedRows.filter(selected => selected.id !== row.id));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    // Expand logic
    const handleExpandRow = (row: any) => {
        const newExpanded = new Set(expandedRows);
        const rowId = row.id || row.key;
        
        if (expandedRows.has(rowId)) {
            newExpanded.delete(rowId);
        } else {
            newExpanded.add(rowId);
        }
        
        setExpandedRows(newExpanded);
    };

    const isRowExpanded = (row: any) => {
        const rowId = row.id || row.key;
        return expandedRows.has(rowId);
    };

    // Update selection change callback
    React.useEffect(() => {
        onSelectionChange?.(selectedRows);
    }, [selectedRows, onSelectionChange]);

    // Get cell value
    const getCellValue = (row: any, column: Column) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }
        return row[column.accessor];
    };

    // Sort handler
    const handleSort = (columnId: string) => {
        if (!onSortChange) return;
        
        const column = columns.find(col => col.id === columnId);
        if (!column?.sortable) return;

        const newDirection = sortConfig?.key === columnId && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
        onSortChange(columnId, newDirection);
    };

    // Render sort icon
    const renderSortIcon = (column: Column) => {
        if (!column.sortable) return null;
        
        const isActive = sortConfig?.key === column.id;
        const direction = sortConfig?.direction;
        
        if (isActive && direction === 'asc') {
            return <ArrowUp size={14} className="text-primary-gold" />;
        }
        if (isActive && direction === 'desc') {
            return <ArrowDown size={14} className="text-primary-gold" />;
        }
        
        return <ArrowUpDown size={14} className="text-text-light-muted dark:text-text-muted" />;
    };

    // Render row actions
    const renderRowActions = (row: any) => {
        if (ActionMenuComponent) {
            return <ActionMenuComponent row={row} />;
        }
        if (rowActions.length === 0) return null;
        const visibleActions = rowActions.filter(action => action.visible?.(row) ?? true);
        return (
            <div className="flex items-center gap-1">
                {visibleActions.map((action) => (
                    <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        icon={action.icon}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                        }}
                        disabled={action.disabled?.(row)}
                        className={cn(
                            'h-8 w-8 p-1',
                            action.variant === 'danger' && 'hover:text-primary-red',
                            action.variant === 'success' && 'hover:text-semantic-success-600',
                            action.variant === 'warning' && 'hover:text-semantic-warning-600'
                        )}
                        title={action.label}
                    />
                ))}
            </div>
        );
    };

    // Loading row
    const renderLoadingRow = () => (
        <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-gold border-t-transparent" />
                    <span className="ml-2 text-text-light-secondary dark:text-text-secondary">Yükleniyor...</span>
                </div>
            </td>
        </tr>
    );

    // Empty state row
    const renderEmptyRow = () => (
        <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}>
                <div className="flex items-center justify-center py-8 text-text-light-secondary dark:text-text-secondary">
                    {emptyStateMessage}
                </div>
            </td>
        </tr>
    );

    // Render table header
    const renderTableHeader = () => (
        <thead className={cn(
            'bg-background-light-secondary dark:bg-background-secondary',
            stickyHeader && 'sticky top-0'
        )}>
            <tr>
                {selectable && (
                    <th className={cn('w-10', paddingClasses[size])}>
                        <Checkbox
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onChange={handleSelectAll}
                            checkboxSize={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                        />
                    </th>
                )}
                {expandable && <th className={cn('w-10', paddingClasses[size])} />}
                {columns.map((column, columnIndex) => (
                    <th
                        key={column.id || `column-${columnIndex}`}
                        className={cn(
                            'text-left font-medium text-text-light-secondary dark:text-text-secondary',
                            paddingClasses[size],
                            sizeClasses[size],
                            column.headerClassName,
                            column.sortable && 'cursor-pointer hover:bg-background-light-soft dark:hover:bg-background-soft'
                        )}
                        style={{
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            textAlign: column.align || 'left'
                        }}
                        onClick={() => column.sortable && handleSort(column.id)}
                    >
                        <div className="flex items-center gap-2">
                            {column.headerRender ? column.headerRender() : column.header}
                            {renderSortIcon(column)}
                        </div>
                    </th>
                ))}
                {/* Actions column */}
                {(rowActions.length > 0 || ActionMenuComponent) && (
                    <th className={cn('w-20', paddingClasses[size])} />
                )}
            </tr>
        </thead>
    );

    // Render table body
    const renderTableBody = () => (
        <tbody>
            {loading ? (
                renderLoadingRow()
            ) : data.length === 0 ? (
                renderEmptyRow()
            ) : (
                data.map((row, rowIndex) => (
                    <React.Fragment key={row.id || rowIndex}>
                        <tr
                            className={cn(
                                'border-b border-gray-200 dark:border-gray-700 hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors',
                                rowClassName?.(row),
                                (onRowClick || onRowDoubleClick) && 'cursor-pointer'
                            )}
                            onClick={(e) => onRowClick?.(row)}
                            onDoubleClick={(e) => onRowDoubleClick?.(row)}
                        >
                            {selectable && (
                                <td className={paddingClasses[size]} onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedRows.some(selected => selected.id === row.id)}
                                        onChange={() => handleSelectRow(row)}
                                        checkboxSize={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                                    />
                                </td>
                            )}
                            {expandable && (
                                <td className={paddingClasses[size]} onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleExpandRow(row)}
                                        className="p-1"
                                    >
                                        {isRowExpanded(row) ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </Button>
                                </td>
                            )}
                            {columns.map((column, columnIndex) => {
                                const value = getCellValue(row, column);
                                return (
                                    <td
                                        key={column.id || `cell-${columnIndex}`}
                                        className={cn(
                                            'text-text-on-light dark:text-text-on-dark',
                                            paddingClasses[size],
                                            sizeClasses[size],
                                            column.className
                                        )}
                                        style={{
                                            textAlign: column.align || 'left'
                                        }}
                                    >
                                        {column.render ? column.render(value, row) : value}
                                    </td>
                                );
                            })}
                            {/* Actions column */}
                            {(rowActions.length > 0 || ActionMenuComponent) && (
                                <td className={paddingClasses[size]}>
                                    {renderRowActions(row)}
                                </td>
                            )}
                        </tr>
                        {expandable && isRowExpanded(row) && expandedContent && (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + ((rowActions.length > 0 || ActionMenuComponent) ? 1 : 0)}>
                                    <div className="bg-background-light-soft dark:bg-background-soft p-4 border-t border-gray-200 dark:border-gray-700">
                                        {expandedContent(row)}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))
            )}
        </tbody>
    );

    const tableContent = (
        <div className={cn(
            'overflow-x-auto',
            maxHeight && 'overflow-y-auto',
            maxHeight && `max-h-[${maxHeight}]`
        )}>
            <table className="w-full">
                {renderTableHeader()}
                {renderTableBody()}
            </table>
        </div>
    );

    return (
        <div className={cn('space-y-4', className)}>
            {/* Bulk Actions */}
            {bulkActions.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedRows.length}
                    actions={bulkActions.map(action => ({
                        ...action,
                        onClick: () => action.onClick(selectedRows)
                    }))}
                    onClearSelection={() => setSelectedRows([])}
                />
            )}

            {/* Table */}
            <Card className={cn(variantClasses[variant], 'overflow-hidden')}>
                {tableContent}
            </Card>

            {/* Pagination */}
            {pagination && (
                <TablePagination {...pagination} />
            )}
        </div>
    );
};

export default DataTable;