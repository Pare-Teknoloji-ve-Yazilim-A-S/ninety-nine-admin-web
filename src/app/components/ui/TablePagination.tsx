import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    onPageChange: (page: number) => void;
    onRecordsPerPageChange?: (recordsPerPage: number) => void;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    showRecordsPerPage?: boolean;
    recordsPerPageOptions?: number[];
    maxVisiblePages?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    itemName?: string;
    itemNamePlural?: string;
    showRecordInfo?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    totalRecords,
    recordsPerPage,
    onPageChange,
    onRecordsPerPageChange,
    showFirstLast = true,
    showPrevNext = true,
    showRecordsPerPage = true,
    recordsPerPageOptions = [10, 25, 50, 100],
    maxVisiblePages = 5,
    size = 'md',
    className,
    itemName = 'kayıt',
    itemNamePlural = 'kayıt',
    showRecordInfo = true,
}) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    // Calculate visible pages
    const getVisiblePages = () => {
        const pages = [];
        const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const end = Math.min(totalPages, start + maxVisiblePages - 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    const getItemName = (count: number) => {
        return count === 1 ? itemName : itemNamePlural;
    };

    const handleRecordsPerPageChange = (newRecordsPerPage: number) => {
        if (onRecordsPerPageChange) {
            onRecordsPerPageChange(newRecordsPerPage);
            // Reset to first page when changing records per page
            onPageChange(1);
        }
    };

    if (totalRecords === 0) {
        return null;
    }

    return (
        <div className={cn(
            'flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700',
            className
        )}>
            {/* Left side - Record info and records per page */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Record info */}
                {showRecordInfo && (
                    <p className={cn(
                        'text-text-light-secondary dark:text-text-secondary',
                        textSizes[size]
                    )}>
                        {recordsPerPage} {getItemName(recordsPerPage)}tan {startRecord}-{endRecord} arası gösteriliyor.
                        Toplam {totalRecords.toLocaleString('tr-TR')} {getItemName(totalRecords)}.
                    </p>
                )}

                {/* Records per page selector */}
                {showRecordsPerPage && onRecordsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'text-text-light-secondary dark:text-text-secondary',
                            textSizes[size]
                        )}>
                            Göster:
                        </span>
                        <select
                            value={recordsPerPage}
                            onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                            className={cn(
                                'border border-gray-200 dark:border-gray-700 rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark',
                                'focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold focus:outline-none',
                                sizeClasses[size]
                            )}
                        >
                            {recordsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right side - Pagination controls */}
            <div className="flex items-center gap-1">
                {/* First page */}
                {showFirstLast && !isFirstPage && (
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronsLeft}
                        onClick={() => onPageChange(1)}
                        className="h-8 w-8 p-0"
                        title="İlk sayfa"
                    />
                )}

                {/* Previous page */}
                {showPrevNext && !isFirstPage && (
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronLeft}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="h-8 w-8 p-0"
                        title="Önceki sayfa"
                    />
                )}

                {/* Page numbers */}
                {visiblePages.map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={cn(
                            'h-8 w-8 p-0 font-medium',
                            page === currentPage && 'bg-primary-gold text-primary-dark-gray'
                        )}
                    >
                        {page}
                    </Button>
                ))}

                {/* Next page */}
                {showPrevNext && !isLastPage && (
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronRight}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="h-8 w-8 p-0"
                        title="Sonraki sayfa"
                    />
                )}

                {/* Last page */}
                {showFirstLast && !isLastPage && (
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronsRight}
                        onClick={() => onPageChange(totalPages)}
                        className="h-8 w-8 p-0"
                        title="Son sayfa"
                    />
                )}
            </div>

            {/* Center - Page info for mobile */}
            <div className="sm:hidden flex items-center gap-2">
                <span className={cn(
                    'text-text-light-secondary dark:text-text-secondary',
                    textSizes[size]
                )}>
                    Sayfa {currentPage} / {totalPages}
                </span>
            </div>
        </div>
    );
};

export default TablePagination;