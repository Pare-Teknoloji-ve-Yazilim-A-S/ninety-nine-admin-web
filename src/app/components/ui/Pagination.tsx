import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    maxVisiblePages?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    size = 'md',
    className,
}) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
    };

    const iconSize = {
        sm: 14,
        md: 16,
        lg: 20,
    };

    // Sayfa numaralarını hesaplama
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
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <div className={cn('flex items-center justify-center space-x-1', className)}>
            {/* İlk sayfa */}
            {showFirstLast && !isFirstPage && (
                <button
                    onClick={() => onPageChange(1)}
                    className={cn(
                        'flex items-center justify-center border border-primary-dark-gray/20 rounded-lg bg-background-card text-text-primary hover:bg-background-secondary transition-colors',
                        sizeClasses[size]
                    )}
                >
                    İlk
                </button>
            )}

            {/* Önceki sayfa */}
            {showPrevNext && !isFirstPage && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className={cn(
                        'flex items-center justify-center border border-primary-dark-gray/20 rounded-lg bg-background-card text-text-primary hover:bg-background-secondary transition-colors',
                        sizeClasses[size]
                    )}
                >
                    <ChevronLeft size={iconSize[size]} />
                </button>
            )}

            {/* Sayfa numaraları */}
            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={cn(
                        'flex items-center justify-center border rounded-lg transition-colors font-medium',
                        page === currentPage
                            ? 'bg-primary-gold text-background-primary border-primary-gold hover:bg-primary-gold/90'
                            : 'bg-background-card text-text-primary border-primary-dark-gray/20 hover:bg-background-secondary',
                        sizeClasses[size]
                    )}
                >
                    {page}
                </button>
            ))}

            {/* Sonraki sayfa */}
            {showPrevNext && !isLastPage && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className={cn(
                        'flex items-center justify-center border border-primary-dark-gray/20 rounded-lg bg-background-card text-text-primary hover:bg-background-secondary transition-colors',
                        sizeClasses[size]
                    )}
                >
                    <ChevronRight size={iconSize[size]} />
                </button>
            )}

            {/* Son sayfa */}
            {showFirstLast && !isLastPage && (
                <button
                    onClick={() => onPageChange(totalPages)}
                    className={cn(
                        'flex items-center justify-center border border-primary-dark-gray/20 rounded-lg bg-background-card text-text-primary hover:bg-background-secondary transition-colors',
                        sizeClasses[size]
                    )}
                >
                    Son
                </button>
            )}
        </div>
    );
};

export default Pagination; 