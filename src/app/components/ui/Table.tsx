"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
    columns: TableColumn[];
    data: any[];
    striped?: boolean;
    hoverable?: boolean;
    bordered?: boolean;
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    onRowClick?: (row: any) => void;
    className?: string;
}

const Table: React.FC<TableProps> = ({
    columns,
    data,
    striped = false,
    hoverable = true,
    bordered = true,
    size = 'md',
    loading = false,
    onRowClick,
    className,
}) => {
    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const cellPadding = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
    };

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className={cn(
                'min-w-full bg-background-card',
                bordered && 'border border-primary-dark-gray/20',
                sizeClasses[size]
            )}>
                <thead className="bg-background-secondary">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    'font-semibold text-text-primary border-b border-primary-dark-gray/20',
                                    cellPadding[size],
                                    column.align === 'center' && 'text-center',
                                    column.align === 'right' && 'text-right',
                                    column.align === 'left' && 'text-left'
                                )}
                                style={{ width: column.width }}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className={cn('text-center text-text-secondary', cellPadding[size])}>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-gold"></div>
                                    <span>Yükleniyor...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={cn('text-center text-text-secondary', cellPadding[size])}>
                                Veri bulunamadı
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                className={cn(
                                    'border-b border-primary-dark-gray/10',
                                    striped && index % 2 === 1 && 'bg-background-secondary/30',
                                    hoverable && 'hover:bg-background-secondary/50 transition-colors',
                                    onRowClick && 'cursor-pointer'
                                )}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'text-text-primary',
                                            cellPadding[size],
                                            column.align === 'center' && 'text-center',
                                            column.align === 'right' && 'text-right',
                                            column.align === 'left' && 'text-left'
                                        )}
                                    >
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table; 