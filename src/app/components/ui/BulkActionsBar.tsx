import React, { useState } from 'react';
import { LucideIcon, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Card from './Card';

interface BulkAction {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
}

interface BulkActionsBarProps {
    selectedCount: number;
    actions: BulkAction[];
    onClearSelection?: () => void;
    maxVisibleActions?: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal' | 'bordered';
    showClearButton?: boolean;
    itemName?: string;
    itemNamePlural?: string;
    position?: 'top' | 'bottom' | 'sticky';
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
    selectedCount,
    actions,
    onClearSelection,
    maxVisibleActions = 4,
    className,
    size = 'md',
    variant = 'default',
    showClearButton = true,
    itemName = 'öğe',
    itemNamePlural = 'öğe',
    position,
}) => {
    const [showMoreActions, setShowMoreActions] = useState(false);

    if (selectedCount === 0) {
        return null;
    }

    const sizeClasses = {
        sm: 'p-3 gap-3',
        md: 'p-4 gap-4',
        lg: 'p-5 gap-5',
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const variantClasses = {
        default: 'bg-background-card border border-primary-gold/30 shadow-md',
        minimal: 'bg-transparent border-0 shadow-none',
        bordered: 'bg-background-card border-2 border-primary-gold/50 shadow-lg',
    };

    const positionClasses = {
        top: 'mb-6',
        bottom: 'mt-6',
        sticky: 'sticky top-0 z-10 mb-6',
    };

    const getItemName = () => {
        return selectedCount === 1 ? itemName : itemNamePlural;
    };

    const getButtonVariant = (action: BulkAction) => {
        switch (action.variant) {
            case 'danger':
                return 'danger';
            case 'success':
                return 'primary';
            case 'warning':
                return 'secondary';
            default:
                return 'ghost';
        }
    };

    const visibleActions = actions.slice(0, maxVisibleActions);
    const hiddenActions = actions.slice(maxVisibleActions);

    return (
        <Card
            className={cn(
                'transition-all duration-200',
                variantClasses[variant],
                sizeClasses[size],
                position ? positionClasses[position] : undefined,
                className
            )}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Selection Info */}
                <div className="flex items-center gap-4">
                    {/* Selected Count */}
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'text-text-light-secondary dark:text-text-secondary',
                            textSizes[size]
                        )}>
                            Seçili:
                        </span>
                        <span className={cn(
                            'font-medium text-primary-gold',
                            textSizes[size]
                        )}>
                            {selectedCount.toLocaleString('tr-TR')} {getItemName()}
                        </span>
                    </div>

                    {/* Clear Selection Button */}
                    {showClearButton && onClearSelection && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={X}
                            onClick={onClearSelection}
                            className="text-text-light-muted dark:text-text-muted hover:text-primary-red"
                        >
                            Seçimi Temizle
                        </Button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Visible Actions */}
                    {visibleActions.map((action) => (
                        <Button
                            key={action.id}
                            variant={getButtonVariant(action)}
                            size="sm"
                            icon={action.icon}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            isLoading={action.loading}
                        >
                            {action.label}
                        </Button>
                    ))}

                    {/* More Actions Dropdown */}
                    {hiddenActions.length > 0 && (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={ChevronDown}
                                onClick={() => setShowMoreActions(!showMoreActions)}
                                className="pr-3"
                            >
                                Daha Fazla
                            </Button>

                            {showMoreActions && (
                                <div className="absolute top-full right-0 mt-2 bg-background-card border border-primary-gold/30 rounded-lg shadow-lg z-20 min-w-48">
                                    <div className="p-2">
                                        {hiddenActions.map((action) => (
                                            <button
                                                key={action.id}
                                                onClick={() => {
                                                    action.onClick();
                                                    setShowMoreActions(false);
                                                }}
                                                disabled={action.disabled}
                                                className={cn(
                                                    'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                                                    'text-text-on-light dark:text-text-on-dark hover:bg-background-soft',
                                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                                    action.variant === 'danger' && 'text-primary-red hover:bg-primary-red/10',
                                                    action.variant === 'success' && 'text-semantic-success-600 hover:bg-semantic-success-100 dark:hover:bg-semantic-success-900/20',
                                                    action.variant === 'warning' && 'text-semantic-warning-600 hover:bg-semantic-warning-100 dark:hover:bg-semantic-warning-900/20'
                                                )}
                                            >
                                                <action.icon size={16} />
                                                <span>{action.label}</span>
                                                {action.loading && (
                                                    <div className="ml-auto">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showMoreActions && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMoreActions(false)}
                />
            )}
        </Card>
    );
};

export default BulkActionsBar;