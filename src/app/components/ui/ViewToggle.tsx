import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewOption {
    id: string;
    label: string;
    icon: LucideIcon;
    disabled?: boolean;
}

interface ViewToggleProps {
    options: ViewOption[];
    activeView: string;
    onViewChange: (viewId: string) => void;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal' | 'segmented';
    className?: string;
    showLabels?: boolean;
    disabled?: boolean;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    options,
    activeView,
    onViewChange,
    size = 'md',
    variant = 'default',
    className,
    showLabels = false,
    disabled = false,
}) => {
    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'minimal':
                return {
                    container: 'bg-transparent border-0 p-0 gap-1',
                    button: 'rounded-md border-0 hover:bg-background-light-soft dark:hover:bg-background-soft',
                    activeButton: 'bg-primary-gold/20 text-primary-gold border-primary-gold/30',
                    inactiveButton: 'text-text-light-secondary dark:text-text-secondary',
                };
            case 'segmented':
                return {
                    container: 'bg-background-light-soft dark:bg-background-soft p-1 rounded-lg border border-gray-200 dark:border-gray-700',
                    button: 'rounded-md border-0 transition-all duration-200',
                    activeButton: 'bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark shadow-sm',
                    inactiveButton: 'text-text-light-secondary dark:text-text-secondary hover:text-text-on-light dark:hover:text-text-on-dark',
                };
            default:
                return {
                    container: 'bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 rounded-lg',
                    button: 'border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-all duration-200',
                    activeButton: 'bg-primary-gold text-primary-dark-gray',
                    inactiveButton: 'text-text-light-secondary dark:text-text-secondary hover:bg-background-light-soft dark:hover:bg-background-soft hover:text-text-on-light dark:hover:text-text-on-dark',
                };
        }
    };

    const variantClasses = getVariantClasses();

    const handleViewChange = (viewId: string) => {
        if (disabled) return;
        
        const option = options.find(opt => opt.id === viewId);
        if (option?.disabled) return;
        
        onViewChange(viewId);
    };

    return (
        <div className={cn(
            'inline-flex items-center',
            variantClasses.container,
            disabled && 'opacity-50 cursor-not-allowed',
            className
        )}>
            {options.map((option, index) => {
                const isActive = activeView === option.id;
                const isDisabled = disabled || option.disabled;
                
                return (
                    <button
                        key={option.id}
                        onClick={() => handleViewChange(option.id)}
                        disabled={isDisabled}
                        className={cn(
                            'inline-flex items-center justify-center font-medium transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-primary-gold/50',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            sizeClasses[size],
                            variantClasses.button,
                            isActive 
                                ? variantClasses.activeButton 
                                : variantClasses.inactiveButton,
                            // First button rounding
                            variant === 'default' && index === 0 && 'rounded-l-lg',
                            // Last button rounding
                            variant === 'default' && index === options.length - 1 && 'rounded-r-lg',
                            // Show labels spacing
                            showLabels && 'gap-2'
                        )}
                        title={option.label}
                    >
                        <option.icon size={iconSizes[size]} />
                        {showLabels && (
                            <span className="hidden sm:inline">
                                {option.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ViewToggle;

// Pre-defined common view options
export const commonViewOptions = {
    grid: {
        id: 'grid',
        label: 'Kart Görünümü',
        icon: require('lucide-react').Grid,
    },
    list: {
        id: 'list',
        label: 'Liste Görünümü',
        icon: require('lucide-react').List,
    },
    table: {
        id: 'table',
        label: 'Tablo Görünümü',
        icon: require('lucide-react').Table,
    },
    kanban: {
        id: 'kanban',
        label: 'Kanban Görünümü',
        icon: require('lucide-react').Columns,
    },
    timeline: {
        id: 'timeline',
        label: 'Zaman Çizelgesi',
        icon: require('lucide-react').Clock,
    },
    calendar: {
        id: 'calendar',
        label: 'Takvim Görünümü',
        icon: require('lucide-react').Calendar,
    },
    map: {
        id: 'map',
        label: 'Harita Görünümü',
        icon: require('lucide-react').Map,
    },
};