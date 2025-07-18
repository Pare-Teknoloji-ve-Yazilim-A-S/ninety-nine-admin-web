'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, FileType2, Code, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportOption {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    format: 'pdf' | 'excel' | 'csv' | 'json';
    onClick: () => void;
}

interface ExportDropdownProps {
    onExportPDF?: () => void;
    onExportExcel: () => void;
    onExportCSV: () => void;
    onExportJSON?: () => void;
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'ghost';
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
    onExportPDF,
    onExportExcel,
    onExportCSV,
    onExportJSON,
    disabled = false,
    className = '',
    size = 'md',
    variant = 'secondary'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingOption, setLoadingOption] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const exportOptions: ExportOption[] = [
        ...(onExportPDF
            ? [{
                id: 'pdf',
                label: 'PDF İndir',
                icon: FileText,
                description: 'Sakin listesini PDF formatında indir',
                format: 'pdf' as const,
                onClick: async () => {
                    setLoadingOption('pdf');
                    await onExportPDF();
                    setLoadingOption(null);
                    setIsOpen(false);
                }
            }]
            : []),
        {
            id: 'excel',
            label: 'Excel İndir',
            icon: FileSpreadsheet,
            description: 'Sakin listesini Excel formatında indir',
            format: 'excel' as const,
            onClick: async () => {
                setLoadingOption('excel');
                await onExportExcel();
                setLoadingOption(null);
                setIsOpen(false);
            }
        },
        {
            id: 'csv',
            label: 'CSV İndir',
            icon: FileType2,
            description: 'Sakin listesini CSV formatında indir',
            format: 'csv' as const,
            onClick: async () => {
                setLoadingOption('csv');
                await onExportCSV();
                setLoadingOption(null);
                setIsOpen(false);
            }
        },
        ...(onExportJSON
            ? [{
                id: 'json',
                label: 'JSON İndir',
                icon: Code,
                description: 'Sakin listesini JSON formatında indir',
                format: 'json' as const,
                onClick: async () => {
                    setLoadingOption('json');
                    await onExportJSON();
                    setLoadingOption(null);
                    setIsOpen(false);
                }
            }]
            : []),
    ];

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base'
    };

    // Variant classes
    const variantClasses = {
        primary: 'bg-primary-gold text-primary-dark-gray hover:bg-primary-gold/90',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown on ESC key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold disabled:opacity-50 disabled:cursor-not-allowed',
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
            >
                <Download className="w-4 h-4" />
                İndir
                <svg
                    className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isOpen ? 'transform rotate-180' : ''
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-2">
                        {exportOptions.map((option) => {
                            const Icon = option.icon;
                            const isLoading = loadingOption === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={option.onClick}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex-shrink-0">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Icon className="w-5 h-5 text-gray-500 group-hover:text-primary-gold transition-colors duration-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-text-on-light dark:text-text-on-dark group-hover:text-primary-gold transition-colors duration-200">
                                            {option.label}
                                        </div>
                                        {option.description && (
                                            <div className="text-xs text-text-light-muted dark:text-text-muted mt-0.5">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-text-light-muted dark:text-text-muted">
                            <CheckCircle className="w-3 h-3" />
                            <span>Filtreli veriler dahil edilir</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportDropdown; 