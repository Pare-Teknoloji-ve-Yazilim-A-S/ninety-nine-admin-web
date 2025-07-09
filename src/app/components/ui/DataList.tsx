import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataListItem {
    id: string | number;
    title: string;
    subtitle?: string;
    description?: string;
    avatar?: string;
    badge?: string;
    badgeColor?: 'primary' | 'gold' | 'red' | 'secondary' | 'accent';
    meta?: React.ReactNode;
    actions?: React.ReactNode;
}

interface DataListProps {
    items: DataListItem[];
    clickable?: boolean;
    showAvatar?: boolean;
    showArrow?: boolean;
    divider?: boolean;
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    onItemClick?: (item: DataListItem) => void;
    className?: string;
}

const DataList: React.FC<DataListProps> = ({
    items,
    clickable = false,
    showAvatar = true,
    showArrow = false,
    divider = true,
    size = 'md',
    loading = false,
    onItemClick,
    className,
}) => {
    const sizeClasses = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const avatarSize = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
    };

    const badgeColors = {
        primary: 'bg-background-primary text-text-primary',
        gold: 'bg-primary-gold text-background-primary',
        red: 'bg-primary-red text-text-primary',
        secondary: 'bg-background-secondary text-text-primary',
        accent: 'bg-primary-gold-light text-text-accent',
    };

    if (loading) {
        return (
            <div className={cn('bg-background-card rounded-lg shadow-card', className)}>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
                    <span className="ml-2 text-text-secondary">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={cn('bg-background-card rounded-lg shadow-card', className)}>
                <div className="flex items-center justify-center py-8">
                    <span className="text-text-secondary">Veri bulunamadı</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('bg-background-card rounded-lg shadow-card overflow-hidden', className)}>
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={cn(
                        'flex items-center',
                        sizeClasses[size],
                        divider && index < items.length - 1 && 'border-b border-primary-dark-gray/10',
                        clickable && 'hover:bg-background-secondary/30 cursor-pointer transition-colors'
                    )}
                    onClick={() => clickable && onItemClick?.(item)}
                >
                    {/* Avatar */}
                    {showAvatar && (
                        <div className={cn('flex-shrink-0 mr-3', avatarSize[size])}>
                            {item.avatar ? (
                                <img
                                    src={item.avatar}
                                    alt={item.title}
                                    className={cn('rounded-full object-cover', avatarSize[size])}
                                />
                            ) : (
                                <div className={cn('rounded-full bg-primary-gold/20 flex items-center justify-center', avatarSize[size])}>
                                    <span className="text-text-accent font-semibold">
                                        {item.title.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-text-primary truncate">
                                    {item.title}
                                </h3>
                                {item.subtitle && (
                                    <p className="text-sm text-text-secondary truncate">
                                        {item.subtitle}
                                    </p>
                                )}
                                {item.description && (
                                    <p className="text-xs text-text-secondary/70 mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            {/* Badge */}
                            {item.badge && (
                                <span
                                    className={cn(
                                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2',
                                        badgeColors[item.badgeColor || 'secondary']
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </div>

                        {/* Meta */}
                        {item.meta && (
                            <div className="mt-2 text-xs text-text-secondary/70">
                                {item.meta}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {item.actions && (
                        <div className="ml-3 flex-shrink-0">
                            {item.actions}
                        </div>
                    )}

                    {/* Arrow */}
                    {showArrow && (
                        <ChevronRight className="ml-3 h-5 w-5 text-text-secondary" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default DataList; 