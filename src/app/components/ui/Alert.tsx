import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    variant?: 'default' | 'outline' | 'solid';
    title?: string;
    children: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    type = 'info',
    variant = 'default',
    title,
    children,
    closable = false,
    onClose,
    size = 'md',
    className,
}) => {
    const typeConfig = {
        success: {
            icon: CheckCircle,
            colors: {
                default: 'bg-green-600/10 border-green-600/20 text-green-300',
                outline: 'border-green-600/40 text-green-300 bg-transparent',
                solid: 'bg-green-600 text-white border-green-600',
            },
            iconColor: 'text-green-400',
            titleColor: 'text-green-300',
        },
        error: {
            icon: AlertCircle,
            colors: {
                default: 'bg-primary-red/10 border-primary-red/20 text-primary-red',
                outline: 'border-primary-red/40 text-primary-red bg-transparent',
                solid: 'bg-primary-red text-white border-primary-red',
            },
            iconColor: 'text-primary-red',
            titleColor: 'text-primary-red',
        },
        warning: {
            icon: AlertTriangle,
            colors: {
                default: 'bg-yellow-600/10 border-yellow-600/20 text-yellow-300',
                outline: 'border-yellow-600/40 text-yellow-300 bg-transparent',
                solid: 'bg-yellow-600 text-white border-yellow-600',
            },
            iconColor: 'text-yellow-400',
            titleColor: 'text-yellow-300',
        },
        info: {
            icon: Info,
            colors: {
                default: 'bg-primary-gold/10 border-primary-gold/20 text-primary-gold',
                outline: 'border-primary-gold/40 text-primary-gold bg-transparent',
                solid: 'bg-primary-gold text-background-primary border-primary-gold',
            },
            iconColor: 'text-primary-gold',
            titleColor: 'text-primary-gold',
        },
    };

    const sizeClasses = {
        sm: 'p-3 text-sm',
        md: 'p-4 text-base',
        lg: 'p-6 text-lg',
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;

    return (
        <div
            role="alert"
            className={cn(
                'border rounded-lg',
                config.colors[variant],
                sizeClasses[size],
                className
            )}
        >
            <div className="flex items-start gap-3">
                <IconComponent className={cn('mt-0.5 flex-shrink-0', config.iconColor, iconSizes[size])} />

                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={cn('font-semibold mb-1',
                            variant === 'solid' ? 'text-white' : config.titleColor
                        )}>
                            {title}
                        </h4>
                    )}
                    <div className={cn(
                        variant === 'solid' ? 'text-white' : ''
                    )}>
                        {children}
                    </div>
                </div>

                {closable && (
                    <button
                        onClick={onClose}
                        className={cn(
                            'flex-shrink-0 p-1 rounded-full transition-colors',
                            variant === 'solid'
                                ? 'hover:bg-white/20 text-white'
                                : 'hover:bg-background-secondary/50 text-text-secondary'
                        )}
                    >
                        <X className={iconSizes[size]} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert; 